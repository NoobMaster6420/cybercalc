import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertQuizSchema, insertChallengeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  setupAuth(app);

  // API routes
  // Get current user's progress
  app.get("/api/user/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const userProgress = await storage.getUserProgress(req.user.id);
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    res.json(userProgress);
  });

  // Update user points
  app.patch("/api/user/points", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const schema = z.object({
      points: z.number().int().min(0)
    });

    try {
      const { points } = schema.parse(req.body);
      const user = await storage.updateUserPoints(req.user.id, points);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ points: user.points });
    } catch (error) {
      res.status(400).json({ message: "Invalid request body" });
    }
  });

  // Update user lives
  app.patch("/api/user/lives", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const schema = z.object({
      lives: z.number().int().min(0).max(3)
    });

    try {
      const { lives } = schema.parse(req.body);
      const user = await storage.updateUserLives(req.user.id, lives);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ lives: user.lives });
    } catch (error) {
      res.status(400).json({ message: "Invalid request body" });
    }
  });

  // Save quiz result
  app.post("/api/quizzes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const quizData = insertQuizSchema.parse({
        ...req.body,
        userId: req.user.id,
        completedAt: new Date().toISOString()
      });

      // Calcular puntos basado en la dificultad
      let pointMultiplier = 1.5;
      switch (quizData.difficulty) {
        case 'medium':
          pointMultiplier = 2;
          break;
        case 'hard':
          pointMultiplier = 2.5;
          break;
      }

      const finalScore = Math.round(quizData.score * pointMultiplier);
      const quizWithScore = { ...quizData, score: finalScore };
      const quiz = await storage.createQuiz(quizWithScore);

      // Actualizar puntos del usuario
      const user = await storage.getUser(req.user.id);
      if (user) {
        const newPoints = user.points + finalScore;
        await storage.updateUserPoints(user.id, newPoints);
      }

      res.status(201).json(quiz);
    } catch (error) {
      res.status(400).json({ message: "Invalid quiz data" });
    }
  });

  // Save challenge result
  app.post("/api/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const challengeData = insertChallengeSchema.parse({
        ...req.body,
        userId: req.user.id,
        completedAt: new Date().toISOString()
      });

      const challenge = await storage.createChallenge(challengeData);

      // Update user points with challenge score
      const user = await storage.getUser(req.user.id);
      if (user) {
        const finalScore = challengeData.score;
        const newPoints = user.points + finalScore;
        await storage.updateUserPoints(user.id, newPoints);
        challenge.score = finalScore; // Ensure correct score is returned
      }

      res.status(201).json(challenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid challenge data" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topUsers = await storage.getTopUsers(limit);

    res.json(topUsers.map(user => ({
      id: user.id,
      username: user.username,
      points: user.points
    })));
  });

  // Get quiz questions
  app.get("/api/questions", (req, res) => {
    const difficulty = req.query.difficulty as string || 'all';

    // Static predefined questions
    const questions = [
      // Teoría - Fácil
      {
        id: 1,
        question: "¿Cuál de las siguientes afirmaciones sobre la derivada es correcta?",
        formula: "",
        options: [
          { id: "a", formula: "\\text{La derivada de una función en un punto es el valor}" + "\\text{de la función en ese punto}" },
          { id: "b", formula: "\\text{La derivada representa la pendiente de la recta tangente a la función en un punto}" },
          { id: "c", formula: "\\text{La derivada siempre es mayor que la función original}" },
          { id: "d", formula: "\\text{La derivada siempre tiene el mismo signo que la función original}" }
        ],
        correctOptionId: "b",
        explanation: "\\text{La derivada de una función en un punto representa la pendiente de la recta}" + "\\\\\\text{tangente a la gráfica de la función en ese punto. Esto nos da información sobre la}" + "\\\\\\text{tasa de cambio instantánea de la función.}",
        difficulty: "easy"
      },
      // Ejercicio coeficiente - Fácil
      {
        id: 2,
        question: "Calcula la derivada aplicando la regla del coeficiente constante:",
        formula: "h(x) = 7\\sin(x)",
        options: [
          { id: "a", formula: "h'(x) = 7\\cos(x)" },
          { id: "b", formula: "h'(x) = \\cos(x)" },
          { id: "c", formula: "h'(x) = -7\\sin(x)" },
          { id: "d", formula: "h'(x) = 7" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[7\\sin(x)] &= 7 \\cdot \\frac{d}{dx}[\\sin(x)] \\\\ &= 7 \\cdot \\cos(x) \\\\ &= 7\\cos(x) \\end{align}",
        difficulty: "easy"
      },
      // Medium questions
      {
        id: 3,
        question: "Calcula la derivada usando la regla del producto:",
        formula: "h(x) = x^2 \\cdot \\sin(x)",
        options: [
          { id: "a", formula: "h'(x) = 2x \\cdot \\sin(x)" },
          { id: "b", formula: "h'(x) = x^2 \\cdot \\cos(x)" },
          { id: "c", formula: "h'(x) = 2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x)" },
          { id: "d", formula: "h'(x) = 2x \\cdot \\cos(x)" }
        ],
        correctOptionId: "c",
        explanation: "\\begin{align} \\frac{d}{dx}[x^2 \\cdot \\sin(x)] &= \\frac{d}{dx}[x^2] \\cdot \\sin(x) + x^2 \\cdot \\frac{d}{dx}[\\sin(x)] \\\\ &= 2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x) \\\\ &= h'(x) \\end{align}",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "Calcula la derivada usando la regla de la cadena:",
        formula: "j(x) = \\sin(x^2)",
        options: [
          { id: "a", formula: "j'(x) = \\cos(x^2)" },
          { id: "b", formula: "j'(x) = 2x \\cdot \\cos(x^2)" },
          { id: "c", formula: "j'(x) = 2 \\cdot \\cos(x^2)" },
          { id: "d", formula: "j'(x) = x \\cdot \\cos(x^2)" }
        ],
        correctOptionId: "b",
        explanation: "\\begin{align} \\frac{d}{dx}[\\sin(x^2)] &= \\frac{d}{du}[\\sin(u)] \\cdot \\frac{du}{dx} \\quad \\text{donde } u = x^2 \\\\ &= \\cos(x^2) \\cdot \\frac{d}{dx}[x^2] \\\\ &= \\cos(x^2) \\cdot 2x \\\\ &= 2x \\cdot \\cos(x^2) \\\\ &= j'(x) \\end{align}",
        difficulty: "medium"
      },
      // Teoría - Medio
      {
        id: 5,
        question: "¿Cuál es el enunciado correcto de la regla de la cadena?",
        formula: "",
        options: [
          { id: "a", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = f'(g(x)) + g'(x)" },
          { id: "b", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)" },
          { id: "c", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = \\frac{f'(x)}{g'(x)}" },
          { id: "d", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = f'(x) \\cdot g'(x)" }
        ],
        correctOptionId: "b",
        explanation: "\\text{La regla de la cadena establece que si tenemos una función compuesta}" + "y = f(g(x))" + "\\\\\\text{entonces su derivada es el producto de la derivada de la función externa evaluada}" + "\\\\\\text{en la función interna, multiplicada por la derivada de la función interna:}" + "\\\\\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)",
        difficulty: "medium"
      },
      // Ejercicio cadena - Medio
      {
        id: 6,
        question: "Calcula la derivada aplicando la regla de la cadena:",
        formula: "f(x) = \\ln(4x^2 + 3)",
        options: [
          { id: "a", formula: "f'(x) = \\frac{1}{4x^2 + 3}" },
          { id: "b", formula: "f'(x) = \\frac{8x}{4x^2 + 3}" },
          { id: "c", formula: "f'(x) = \\frac{4x^2 + 3}{8x}" },
          { id: "d", formula: "f'(x) = \\frac{8x^2}{4x^2 + 3}" }
        ],
        correctOptionId: "b",
        explanation: "\\begin{align} \\frac{d}{dx}[\\ln(4x^2 + 3)] &= \\frac{1}{4x^2 + 3} \\cdot \\frac{d}{dx}[4x^2 + 3] \\\\ &= \\frac{1}{4x^2 + 3} \\cdot 8x \\\\ &= \\frac{8x}{4x^2 + 3} \\end{align}",
        difficulty: "medium"
      },
      // Hard questions
      {
        id: 7,
        question: "Calcula la derivada usando la regla del cociente:",
        formula: "k(x) = \\frac{x^2}{\\cos(x)}",
        options: [
          { id: "a", formula: "k'(x) = \\frac{2x \\cdot \\cos(x) + x^2 \\cdot \\sin(x)}{\\cos^2(x)}" },
          { id: "b", formula: "k'(x) = \\frac{2x \\cdot \\cos(x) - x^2 \\cdot \\sin(x)}{\\cos^2(x)}" },
          { id: "c", formula: "k'(x) = \\frac{2x}{\\cos(x)} - \\frac{x^2 \\cdot \\sin(x)}{\\cos^2(x)}" },
          { id: "d", formula: "k'(x) = \\frac{2x - x^2 \\cdot \\sin(x)}{\\cos(x)}" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}\\left[\\frac{x^2}{\\cos(x)}\\right] &= \\frac{\\frac{d}{dx}[x^2] \\cdot \\cos(x) - x^2 \\cdot \\frac{d}{dx}[\\cos(x)]}{\\cos^2(x)} \\\\ &= \\frac{2x \\cdot \\cos(x) - x^2 \\cdot (-\\sin(x))}{\\cos^2(x)} \\\\ &= \\frac{2x \\cdot \\cos(x) + x^2 \\cdot \\sin(x)}{\\cos^2(x)} \\\\ &= k'(x) \\end{align}",
        difficulty: "hard"
      },
      {
        id: 8,
        question: "Encuentra la derivada de la función:",
        formula: "m(x) = e^{\\sin(x^2)}",
        options: [
          { id: "a", formula: "m'(x) = e^{\\sin(x^2)} \\cdot \\cos(x^2) \\cdot 2x" },
          { id: "b", formula: "m'(x) = e^{\\sin(x^2)} \\cdot \\cos(x^2)" },
          { id: "c", formula: "m'(x) = e^{\\sin(x^2)} \\cdot \\sin(x^2) \\cdot 2x" },
          { id: "d", formula: "m'(x) = e^{\\sin(x^2)} \\cdot 2x" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[e^{\\sin(x^2)}] &= e^{\\sin(x^2)} \\cdot \\frac{d}{dx}[\\sin(x^2)] \\\\ &= e^{\\sin(x^2)} \\cdot \\cos(x^2) \\cdot \\frac{d}{dx}[x^2] \\\\ &= e^{\\sin(x^2)} \\cdot \\cos(x^2) \\cdot 2x \\\\ &= m'(x) \\end{align}",
        difficulty: "hard"
      },
      // Teoría - Difícil
      {
        id: 9,
        question: "¿Qué establece el Teorema Fundamental del Cálculo en relación con las derivadas e integrales?",
        formula: "",
        options: [
          { id: "a", formula: "\\text{La derivada y la integral son operaciones independientes sin relación}" },
          { id: "b", formula: "\\text{La derivada de la integral definida de una función es igual a la función original}" },
          { id: "c", formula: "\\text{La integral de la derivada es igual a la diferencia de valores en los extremos}" },
          { id: "d", formula: "\\text{La derivada de la integral de una función siempre es cero}" }
        ],
        correctOptionId: "c",
        explanation: "\\text{El Teorema Fundamental del Cálculo establece que si F es una antiderivada de f}" + "\\\\\\text{entonces la integral definida de f en el intervalo [a,b] es igual a F(b) - F(a).}" + "\\\\\\text{Esto demuestra la relación inversa entre derivación e integración:}" + "\\\\\\int_a^b f'(x)dx = f(b) - f(a).",
        difficulty: "hard"
      },
      // Ejercicio cadena y coeficiente - Difícil
      {
        id: 10,
        question: "Calcula la derivada aplicando la regla del coeficiente y de la cadena:",
        formula: "f(x) = 5\\sqrt{3x^3 + 2x}",
        options: [
          { id: "a", formula: "f'(x) = \\frac{5(9x^2 + 2)}{2\\sqrt{3x^3 + 2x}}" },
          { id: "b", formula: "f'(x) = \\frac{15x^2 + 10}{\\sqrt{3x^3 + 2x}}" },
          { id: "c", formula: "f'(x) = 5 \\cdot \\frac{1}{2}(3x^3 + 2x)^{-\\frac{1}{2}} \\cdot (9x^2 + 2)" },
          { id: "d", formula: "f'(x) = \\frac{5}{2\\sqrt{3x^3 + 2x}} \\cdot (9x^2 + 2)" }
        ],
        correctOptionId: "d",
        explanation: "\\begin{align} \\frac{d}{dx}[5\\sqrt{3x^3 + 2x}] &= 5 \\cdot \\frac{d}{dx}[(3x^3 + 2x)^{\\frac{1}{2}}] \\\\ &= 5 \\cdot \\frac{1}{2}(3x^3 + 2x)^{-\\frac{1}{2}} \\cdot \\frac{d}{dx}[3x^3 + 2x] \\\\ &= 5 \\cdot \\frac{1}{2}(3x^3 + 2x)^{-\\frac{1}{2}} \\cdot (9x^2 + 2) \\\\ &= \\frac{5(9x^2 + 2)}{2\\sqrt{3x^3 + 2x}} \\\\ &= \\frac{5}{2\\sqrt{3x^3 + 2x}} \\cdot (9x^2 + 2) \\end{align}",
        difficulty: "hard"
      }
    ];

    if (difficulty === 'all') {
      res.json(questions);
    } else {
      const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
      res.json(filteredQuestions);
    }
  });

  // Get challenge questions
  app.get("/api/challenges", (req, res) => {
    // Static predefined challenge questions
    const challenges = [
      // Ejercicio de regla de la cadena
      {
        id: 1,
        question: "Encuentra la derivada de la función compuesta:",
        formula: "f(x) = \\sin(x^2 + 3x)",
        options: [
          { id: "a", formula: "f'(x) = \\cos(x^2 + 3x) \\cdot (2x + 3)" },
          { id: "b", formula: "f'(x) = \\sin(2x + 3)" },
          { id: "c", formula: "f'(x) = \\cos(x^2 + 3x)" },
          { id: "d", formula: "f'(x) = (2x + 3) \\cdot \\sin(x^2 + 3x)" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[\\sin(x^2 + 3x)] &= \\frac{d}{du}[\\sin(u)] \\cdot \\frac{du}{dx} \\quad \\text{donde } u = x^2 + 3x \\\\ &= \\cos(x^2 + 3x) \\cdot \\frac{d}{dx}[x^2 + 3x] \\\\ &= \\cos(x^2 + 3x) \\cdot (2x + 3) \\\\ &= f'(x) \\end{align}",
        points: 25
      },
      // Ejercicio de combinación de reglas
      {
        id: 2,
        question: "Calcula la derivada de la función:",
        formula: "g(x) = \\ln(\\cos(x))",
        options: [
          { id: "a", formula: "g'(x) = -\\tan(x)" },
          { id: "b", formula: "g'(x) = \\frac{-\\sin(x)}{\\cos(x)}" },
          { id: "c", formula: "g'(x) = \\frac{1}{\\cos(x)} \\cdot (-\\sin(x))" },
          { id: "d", formula: "g'(x) = -\\sec(x) \\cdot \\tan(x)" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[\\ln(\\cos(x))] &= \\frac{d}{du}[\\ln(u)] \\cdot \\frac{du}{dx} \\quad \\text{donde } u = \\cos(x) \\\\ &= \\frac{1}{u} \\cdot \\frac{d}{dx}[\\cos(x)] \\\\ &= \\frac{1}{\\cos(x)} \\cdot (-\\sin(x)) \\\\ &= -\\frac{\\sin(x)}{\\cos(x)} \\\\ &= -\\tan(x) \\\\ &= g'(x) \\end{align}",
        points: 30
      },
      // Ejercicio de regla del producto
      {
        id: 3,
        question: "Encuentra la derivada usando la regla del producto:",
        formula: "h(x) = x^3 \\cdot e^x",
        options: [
          { id: "a", formula: "h'(x) = 3x^2 \\cdot e^x" },
          { id: "b", formula: "h'(x) = x^3 \\cdot e^x" },
          { id: "c", formula: "h'(x) = 3x^2 \\cdot e^x + x^3 \\cdot e^x" },
          { id: "d", formula: "h'(x) = 3x^2 \\cdot e^x \\cdot x" }
        ],
        correctOptionId: "c",
        explanation: "\\begin{align} \\frac{d}{dx}[x^3 \\cdot e^x] &= \\frac{d}{dx}[x^3] \\cdot e^x + x^3 \\cdot \\frac{d}{dx}[e^x] \\\\ &= 3x^2 \\cdot e^x + x^3 \\cdot e^x \\\\ &= e^x \\cdot (3x^2 + x^3) \\\\ &= h'(x) \\end{align}",
        points: 35
      },
      // Teoría sobre derivadas 
      {
        id: 4,
        question: "¿Qué representa geométricamente la segunda derivada de una función?",
        formula: "",
        options: [
          { id: "a", formula: "\\text{La pendiente de la recta tangente}" },
          { id: "b", formula: "\\text{La curvatura o concavidad de la función}" },
          { id: "c", formula: "\\text{El área bajo la curva}" },
          { id: "d", formula: "\\text{La distancia entre dos puntos de la función}" }
        ],
        correctOptionId: "b",
        explanation: "\\text{La segunda derivada de la función representa la tasa de cambio de la primera}" + "\\\\\\text{derivada lo que geométricamente indica cómo cambia la pendiente a lo largo}" + "\\\\\\text{de la curva. Permite determinar la concavidad de la gráfica de la función.}",
        points: 40
      },
      // Ejercicio de coeficiente
      {
        id: 5,
        question: "Calcula la derivada aplicando la regla del coeficiente:",
        formula: "f(x) = 12x^4 - 8x^3 + 6x^2",
        options: [
          { id: "a", formula: "f'(x) = 12 \\cdot 4x^3 - 8 \\cdot 3x^2 + 6 \\cdot 2x" },
          { id: "b", formula: "f'(x) = 48x^3 - 24x^2 + 12x" },
          { id: "c", formula: "f'(x) = 48x^3 - 8x^2 + 6x" },
          { id: "d", formula: "f'(x) = 48x^3 - 24x^2 + 6x" }
        ],
        correctOptionId: "b",
        explanation: "\\begin{align} \\frac{d}{dx}[12x^4 - 8x^3 + 6x^2] &= 12 \\cdot \\frac{d}{dx}[x^4] - 8 \\cdot \\frac{d}{dx}[x^3] + 6 \\cdot \\frac{d}{dx}[x^2] \\\\ &= 12 \\cdot 4x^3 - 8 \\cdot 3x^2 + 6 \\cdot 2x \\\\ &= 48x^3 - 24x^2 + 12x \\end{align}",
        points: 30
      },
      // Ejercicio de regla de la cadena complejo
      {
        id: 6,
        formula: "g(x) = (2x^3 + 5x)^4",
        options: [
          { id: "a", formula: "g'(x) = 4(2x^3 + 5x)^3 \\cdot (6x^2 + 5)" },
          { id: "b", formula: "g'(x) = 4(2x^3 + 5x)^3" },
          { id: "c", formula: "g'(x) = (2x^3 + 5x)^3 \\cdot (6x^2 + 5)" },
          { id: "d", formula: "g'(x) = 4 \\cdot 3(2x^3 + 5x)^2 \\cdot (6x^2 + 5)" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[(2x^3 + 5x)^4] &= 4(2x^3 + 5x)^{4-1} \\cdot \\frac{d}{dx}[2x^3 + 5x] \\\\ &= 4(2x^3 + 5x)^3 \\cdot (\\frac{d}{dx}[2x^3] + \\frac{d}{dx}[5x]) \\\\ &= 4(2x^3 + 5x)^3 \\cdot (2 \\cdot 3x^2 + 5) \\\\ &= 4(2x^3 + 5x)^3 \\cdot (6x^2 + 5) \\end{align}",
        points: 45
      },
      // Teoría sobre aplicaciones de derivadas
      {
        id: 7,
        question: "¿Cuál es la aplicación principal de las derivadas en el estudio de la física?",
        formula: "",
        options: [
          { id: "a", formula: "\\\\\\text{Calcular la masa de los objetos}" },
          { id: "b", formula: "\\\\\\text{Determinar la densidad de los materiales}" },
          { id: "c", formula: "\\\\\\text{Analizar la velocidad y aceleración de objetos en movimiento}" },
          { id: "d", formula: "\\\\\\text{Calcular la resistencia de los materiales}" }
        ],
        correctOptionId: "c",
        explanation: "\\text{En física, una de las aplicaciones más importantes de las derivadas es el}" + "\\\\\\text{análisis del movimiento. la primera derivada es posición respecto al tiempo }" + "\\\\\\text{representa la velocidad, mientras que la segunda derivada representa la}" + "\\\\\\text{aceleración. Permite describir el movimiento de los objetos y aplicar las}" + "\\\\\\text{leyes de Newton.}",
        points: 35
      },
      // Ejercicio combinado de cadena y coeficiente
      {
        id: 8,
        question: "Encuentra la derivada aplicando las reglas del coeficiente y de la cadena:",
        formula: "h(x) = 3\\sin(2x^2 + 1)",
        options: [
          { id: "a", formula: "h'(x) = 3\\cos(2x^2 + 1) \\cdot 4x" },
          { id: "b", formula: "h'(x) = 6\\cos(2x^2 + 1) \\cdot x" },
          { id: "c", formula: "h'(x) = 12x\\cos(2x^2 + 1)" },
          { id: "d", formula: "h'(x) = 6x\\cos(2x^2 + 1)" }
        ],
        correctOptionId: "b",
        explanation: "\\begin{align} \\frac{d}{dx}[3\\sin(2x^2 + 1)] &= 3 \\cdot \\frac{d}{dx}[\\sin(2x^2 + 1)] \\\\ &= 3 \\cdot \\cos(2x^2 + 1) \\cdot \\frac{d}{dx}[2x^2 + 1] \\\\ &= 3 \\cdot \\cos(2x^2 + 1) \\cdot 4x \\\\ &= 6x\\cos(2x^2 + 1) \\end{align}",
        points: 40
      },
      // Ejercicio de aplicación práctica
      {
        id: 9,
        question: "En un problema de optimización, un ingeniero necesita encontrar el punto crítico de la función de costo. ¿Cuál es la derivada de esta función?",
        formula: "C(x) = 2x^3 - 15x^2 + 36x + 10",
        options: [
          { id: "a", formula: "C'(x) = 6x^2 - 30x + 36" },
          { id: "b", formula: "C'(x) = 2x^2 - 15x + 36" },
          { id: "c", formula: "C'(x) = 6x^2 - 15x + 36" },
          { id: "d", formula: "C'(x) = 6x^2 - 30x + 10" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[2x^3 - 15x^2 + 36x + 10] &= \\frac{d}{dx}[2x^3] - \\frac{d}{dx}[15x^2] + \\frac{d}{dx}[36x] + \\frac{d}{dx}[10] \\\\ &= 2 \\cdot 3x^2 - 15 \\cdot 2x + 36 \\cdot 1 + 0 \\\\ &= 6x^2 - 30x + 36 \\end{align}",
        points: 35
      },
      // Ejercicio que combina múltiples reglas
      {
        id: 10,
        question: "Calcula la derivada de esta función compuesta que combina múltiples reglas:",
        formula: "f(x) = e^{x^2} \\cdot \\cos(3x)",
        options: [
          { id: "a", formula: "f'(x) = 2xe^{x^2} \\cdot \\cos(3x) - 3e^{x^2} \\cdot \\sin(3x)" },
          { id: "b", formula: "f'(x) = e^{x^2} \\cdot \\cos(3x) \\cdot 2x - 3e^{x^2} \\cdot \\sin(3x)" },
          { id: "c", formula: "f'(x) = e^{x^2} \\cdot (-3\\sin(3x)) + \\cos(3x) \\cdot e^{x^2} \\cdot 2x" },
          { id: "d", formula: "f'(x) = 2xe^{x^2} \\cdot \\cos(3x) - 3\\sin(3x)" }
        ],
        correctOptionId: "c",
        explanation: "\\text{Para calcular esta derivada, aplicamos la regla del producto:}" + " \\begin{align} \\frac{d}{dx}[e^{x^2} \\cdot \\cos(3x)] &= \\frac{d}{dx}[e^{x^2}] \\cdot \\cos(3x) + e^{x^2} \\cdot \\frac{d}{dx}[\\cos(3x)] \\\\ &= e^{x^2} \\cdot 2x \\cdot \\cos(3x) + e^{x^2} \\cdot (-\\sin(3x)) \\cdot 3 \\\\ &= e^{x^2} \\cdot \\cos(3x) \\cdot 2x - 3e^{x^2} \\cdot \\sin(3x) \\\\ &= e^{x^2} \\cdot (-3\\sin(3x)) + \\cos(3x) \\cdot e^{x^2} \\cdot 2x \\end{align}",
        points: 50
      }
    ];

    res.json(challenges);
  });

  const httpServer = createServer(app);
  return httpServer;
}