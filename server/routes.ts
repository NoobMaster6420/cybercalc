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

      const quiz = await storage.createQuiz(quizData);

      // Update user points with complete score
      const user = await storage.getUser(req.user.id);
      if (user) {
        const fullScore = quizData.score; // Use the original score from request
        const newPoints = user.points + fullScore;
        await storage.updateUserPoints(user.id, newPoints);
        quiz.score = fullScore; // Update quiz score to reflect full points
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

      // Update user points
      const user = await storage.getUser(req.user.id);
      if (user) {
        await storage.updateUserPoints(user.id, user.points + challengeData.score);
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
      // Easy questions
      {
        id: 1,
        question: "Calcula la derivada de la siguiente función:",
        formula: "f(x) = 3x^2 - 2x + 5",
        options: [
          { id: "a", formula: "f'(x) = 6x - 2" },
          { id: "b", formula: "f'(x) = 6x^2 - 2" },
          { id: "c", formula: "f'(x) = 3x - 2 + 5" },
          { id: "d", formula: "f'(x) = 3 \\cdot 2x - 2 \\cdot 1" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[3x^2 - 2x + 5] &= \\frac{d}{dx}[3x^2] + \\frac{d}{dx}[-2x] + \\frac{d}{dx}[5] \\\\ &= 3 \\cdot \\frac{d}{dx}[x^2] - 2 \\cdot \\frac{d}{dx}[x] + \\frac{d}{dx}[5] \\\\ &= 3 \\cdot 2x^{2-1} - 2 \\cdot 1 + 0 \\\\ &= 6x - 2 \\\\ &= f'(x) \\end{align}",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "Encuentra la derivada de:",
        formula: "g(x) = 5x^3 + 2x",
        options: [
          { id: "a", formula: "g'(x) = 15x^2 + 2" },
          { id: "b", formula: "g'(x) = 5x^2 + 2" },
          { id: "c", formula: "g'(x) = 15x^2" },
          { id: "d", formula: "g'(x) = 15x^3 + 2" }
        ],
        correctOptionId: "a",
        explanation: "\\begin{align} \\frac{d}{dx}[5x^3 + 2x] &= \\frac{d}{dx}[5x^3] + \\frac{d}{dx}[2x] \\\\ &= 5 \\cdot \\frac{d}{dx}[x^3] + 2 \\cdot \\frac{d}{dx}[x] \\\\ &= 5 \\cdot 3x^{3-1} + 2 \\cdot 1 \\\\ &= 15x^2 + 2 \\\\ &= g'(x) \\end{align}",
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
      // Hard questions
      {
        id: 5,
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
        id: 6,
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
      }
    ];

    res.json(challenges);
  });

  const httpServer = createServer(app);
  return httpServer;
}