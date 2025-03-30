// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
import fs from "fs";
import path from "path";
var MemoryStore = createMemoryStore(session);
var DATA_FILE = path.join(process.cwd(), "cybercalc_data.json");
var MemStorage = class {
  users;
  quizzes;
  challenges;
  sessionStore;
  // Usamos any para evitar problemas de tipado
  currentUserId;
  currentQuizId;
  currentChallengeId;
  constructor() {
    console.log("Inicializando almacenamiento...");
    const savedState = this.loadState();
    if (savedState) {
      console.log("Restaurando estado desde archivo...");
      this.users = new Map(savedState.users);
      this.quizzes = new Map(savedState.quizzes);
      this.challenges = new Map(savedState.challenges);
      this.currentUserId = savedState.currentUserId;
      this.currentQuizId = savedState.currentQuizId;
      this.currentChallengeId = savedState.currentChallengeId;
    } else {
      console.log("Inicializando con valores predeterminados...");
      this.users = /* @__PURE__ */ new Map();
      this.quizzes = /* @__PURE__ */ new Map();
      this.challenges = /* @__PURE__ */ new Map();
      this.currentUserId = 1;
      this.currentQuizId = 1;
      this.currentChallengeId = 1;
      const seedUsers = [
        { username: "MathWizard", password: "password", points: 1250, lives: 3 },
        { username: "DerivativeNinja", password: "password", points: 980, lives: 3 },
        { username: "CalculusKing", password: "password", points: 875, lives: 3 },
        { username: "DeltaMaster", password: "password", points: 740, lives: 3 },
        { username: "DerivativeQueen", password: "password", points: 685, lives: 3 },
        { username: "IntegralHero", password: "password", points: 620, lives: 3 },
        { username: "FunctionPro", password: "password", points: 590, lives: 3 }
      ];
      seedUsers.forEach((user) => {
        const id = this.currentUserId++;
        this.users.set(id, { ...user, id });
      });
      this.saveState();
    }
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // One day
    });
    console.log(`Almacenamiento inicializado con ${this.users.size} usuarios`);
  }
  // Métodos de persistencia
  saveState() {
    try {
      console.log("Guardando estado a archivo...");
      const state = {
        users: Array.from(this.users.entries()),
        quizzes: Array.from(this.quizzes.entries()),
        challenges: Array.from(this.challenges.entries()),
        currentUserId: this.currentUserId,
        currentQuizId: this.currentQuizId,
        currentChallengeId: this.currentChallengeId
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
      console.log("Estado guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el estado:", error);
    }
  }
  loadState() {
    try {
      console.log("Intentando cargar datos desde archivo...");
      if (fs.existsSync(DATA_FILE)) {
        console.log("Archivo de datos encontrado, cargando...");
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
      }
      console.log("No se encontr\xF3 el archivo de datos");
      return null;
    } catch (error) {
      console.error("Error al cargar el estado:", error);
      return null;
    }
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id, points: 0, lives: 3 };
    this.users.set(id, user);
    this.saveState();
    return user;
  }
  async updateUserPoints(userId, points) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    const updatedUser = { ...user, points };
    this.users.set(userId, updatedUser);
    this.saveState();
    return updatedUser;
  }
  async updateUserLives(userId, lives) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    const updatedUser = { ...user, lives };
    this.users.set(userId, updatedUser);
    this.saveState();
    return updatedUser;
  }
  async getUserProgress(userId) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    return {
      userId: user.id,
      points: user.points,
      lives: user.lives
    };
  }
  async getQuizzesByUserId(userId) {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.userId === userId
    );
  }
  async createQuiz(insertQuiz) {
    const id = this.currentQuizId++;
    const quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    this.saveState();
    return quiz;
  }
  async getChallengesByUserId(userId) {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.userId === userId
    );
  }
  async createChallenge(insertChallenge) {
    const id = this.currentChallengeId++;
    const challenge = { ...insertChallenge, id };
    this.challenges.set(id, challenge);
    this.saveState();
    return challenge;
  }
  async getTopUsers(limit) {
    return Array.from(this.users.values()).sort((a, b) => b.points - a.points).slice(0, limit);
  }
};
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "cybercalc-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false, { message: "Credenciales incorrectas" });
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Nombre de usuario ya existe" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Credenciales incorrectas" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  points: integer("points").notNull().default(0),
  lives: integer("lives").notNull().default(3)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  difficulty: text("difficulty").notNull(),
  score: integer("score").notNull(),
  completedAt: text("completed_at").notNull()
});
var insertQuizSchema = createInsertSchema(quizzes).pick({
  userId: true,
  difficulty: true,
  score: true,
  completedAt: true
});
var challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  completedAt: text("completed_at").notNull()
});
var insertChallengeSchema = createInsertSchema(challenges).pick({
  userId: true,
  score: true,
  completedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/user/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userProgress = await storage.getUserProgress(req.user.id);
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }
    res.json(userProgress);
  });
  app2.patch("/api/user/points", async (req, res) => {
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
  app2.patch("/api/user/lives", async (req, res) => {
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
  app2.post("/api/quizzes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const quizData = insertQuizSchema.parse({
        ...req.body,
        userId: req.user.id,
        completedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      let pointMultiplier = 1.5;
      switch (quizData.difficulty) {
        case "medium":
          pointMultiplier = 2;
          break;
        case "hard":
          pointMultiplier = 2.5;
          break;
      }
      const finalScore = Math.round(quizData.score * pointMultiplier);
      const quizWithScore = { ...quizData, score: finalScore };
      const quiz = await storage.createQuiz(quizWithScore);
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
  app2.post("/api/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const challengeData = insertChallengeSchema.parse({
        ...req.body,
        userId: req.user.id,
        completedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      const challenge = await storage.createChallenge(challengeData);
      const user = await storage.getUser(req.user.id);
      if (user) {
        const finalScore = challengeData.score;
        const newPoints = user.points + finalScore;
        await storage.updateUserPoints(user.id, newPoints);
        challenge.score = finalScore;
      }
      res.status(201).json(challenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid challenge data" });
    }
  });
  app2.get("/api/leaderboard", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const topUsers = await storage.getTopUsers(limit);
    res.json(topUsers.map((user) => ({
      id: user.id,
      username: user.username,
      points: user.points
    })));
  });
  app2.get("/api/questions", (req, res) => {
    const difficulty = req.query.difficulty || "all";
    const questions = [
      // Teoría - Fácil
      {
        id: 1,
        question: "\xBFCu\xE1l de las siguientes afirmaciones sobre la derivada es correcta?",
        formula: "",
        options: [
          { id: "a", formula: "\\text{La derivada de una funci\xF3n en un punto es el valor}\\text{de la funci\xF3n en ese punto}" },
          { id: "b", formula: "\\text{La derivada representa la pendiente de la recta tangente a la funci\xF3n en un punto}" },
          { id: "c", formula: "\\text{La derivada siempre es mayor que la funci\xF3n original}" },
          { id: "d", formula: "\\text{La derivada siempre tiene el mismo signo que la funci\xF3n original}" }
        ],
        correctOptionId: "b",
        explanation: "\\text{La derivada de una funci\xF3n en un punto representa la pendiente de la recta}\\\\\\text{tangente a la gr\xE1fica de la funci\xF3n en ese punto. Esto nos da informaci\xF3n sobre la}\\\\\\text{tasa de cambio instant\xE1nea de la funci\xF3n.}",
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
        question: "\xBFCu\xE1l es el enunciado correcto de la regla de la cadena?",
        formula: "",
        options: [
          { id: "a", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = f'(g(x)) + g'(x)" },
          { id: "b", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)" },
          { id: "c", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = \\frac{f'(x)}{g'(x)}" },
          { id: "d", formula: "Si y = f(g(x)), entonces \\frac{dy}{dx} = f'(x) \\cdot g'(x)" }
        ],
        correctOptionId: "b",
        explanation: "\\text{La regla de la cadena establece que si tenemos una funci\xF3n compuesta}y = f(g(x))\\\\\\text{entonces su derivada es el producto de la derivada de la funci\xF3n externa evaluada}\\\\\\text{en la funci\xF3n interna, multiplicada por la derivada de la funci\xF3n interna:}\\\\\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)",
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
        question: "Encuentra la derivada de la funci\xF3n:",
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
        question: "\xBFQu\xE9 establece el Teorema Fundamental del C\xE1lculo en relaci\xF3n con las derivadas e integrales?",
        formula: "",
        options: [
          { id: "a", formula: "\\text{La derivada y la integral son operaciones independientes sin relaci\xF3n}" },
          { id: "b", formula: "\\text{La derivada de la integral definida de una funci\xF3n es igual a la funci\xF3n original}" },
          { id: "c", formula: "\\text{La integral de la derivada es igual a la diferencia de valores en los extremos}" },
          { id: "d", formula: "\\text{La derivada de la integral de una funci\xF3n siempre es cero}" }
        ],
        correctOptionId: "c",
        explanation: "\\text{El Teorema Fundamental del C\xE1lculo establece que si F es una antiderivada de f}\\\\\\text{entonces la integral definida de f en el intervalo [a,b] es igual a F(b) - F(a).}\\\\\\text{Esto demuestra la relaci\xF3n inversa entre derivaci\xF3n e integraci\xF3n:}\\\\\\int_a^b f'(x)dx = f(b) - f(a).",
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
    if (difficulty === "all") {
      res.json(questions);
    } else {
      const filteredQuestions = questions.filter((q) => q.difficulty === difficulty);
      res.json(filteredQuestions);
    }
  });
  app2.get("/api/challenges", (req, res) => {
    const challenges2 = [
      // Ejercicio de regla de la cadena
      {
        id: 1,
        question: "Encuentra la derivada de la funci\xF3n compuesta:",
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
        question: "Calcula la derivada de la funci\xF3n:",
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
        question: "\xBFQu\xE9 representa geom\xE9tricamente la segunda derivada de una funci\xF3n?",
        formula: "",
        options: [
          { id: "a", formula: "\\text{La pendiente de la recta tangente}" },
          { id: "b", formula: "\\text{La curvatura o concavidad de la funci\xF3n}" },
          { id: "c", formula: "\\text{El \xE1rea bajo la curva}" },
          { id: "d", formula: "\\text{La distancia entre dos puntos de la funci\xF3n}" }
        ],
        correctOptionId: "b",
        explanation: "\\text{La segunda derivada de la funci\xF3n representa la tasa de cambio de la primera}\\\\\\text{derivada lo que geom\xE9tricamente indica c\xF3mo cambia la pendiente a lo largo}\\\\\\text{de la curva. Permite determinar la concavidad de la gr\xE1fica de la funci\xF3n.}",
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
        question: "\xBFCu\xE1l es la aplicaci\xF3n principal de las derivadas en el estudio de la f\xEDsica?",
        formula: "",
        options: [
          { id: "a", formula: "\\\\\\text{Calcular la masa de los objetos}" },
          { id: "b", formula: "\\\\\\text{Determinar la densidad de los materiales}" },
          { id: "c", formula: "\\\\\\text{Analizar la velocidad y aceleraci\xF3n de objetos en movimiento}" },
          { id: "d", formula: "\\\\\\text{Calcular la resistencia de los materiales}" }
        ],
        correctOptionId: "c",
        explanation: "\\text{En f\xEDsica, una de las aplicaciones m\xE1s importantes de las derivadas es el}\\\\\\text{an\xE1lisis del movimiento. la primera derivada es posici\xF3n respecto al tiempo }\\\\\\text{representa la velocidad, mientras que la segunda derivada representa la}\\\\\\text{aceleraci\xF3n. Permite describir el movimiento de los objetos y aplicar las}\\\\\\text{leyes de Newton.}",
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
        question: "En un problema de optimizaci\xF3n, un ingeniero necesita encontrar el punto cr\xEDtico de la funci\xF3n de costo. \xBFCu\xE1l es la derivada de esta funci\xF3n?",
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
        question: "Calcula la derivada de esta funci\xF3n compuesta que combina m\xFAltiples reglas:",
        formula: "f(x) = e^{x^2} \\cdot \\cos(3x)",
        options: [
          { id: "a", formula: "f'(x) = 2xe^{x^2} \\cdot \\cos(3x) - 3e^{x^2} \\cdot \\sin(3x)" },
          { id: "b", formula: "f'(x) = e^{x^2} \\cdot \\cos(3x) \\cdot 2x - 3e^{x^2} \\cdot \\sin(3x)" },
          { id: "c", formula: "f'(x) = e^{x^2} \\cdot (-3\\sin(3x)) + \\cos(3x) \\cdot e^{x^2} \\cdot 2x" },
          { id: "d", formula: "f'(x) = 2xe^{x^2} \\cdot \\cos(3x) - 3\\sin(3x)" }
        ],
        correctOptionId: "c",
        explanation: "\\text{Para calcular esta derivada, aplicamos la regla del producto:} \\begin{align} \\frac{d}{dx}[e^{x^2} \\cdot \\cos(3x)] &= \\frac{d}{dx}[e^{x^2}] \\cdot \\cos(3x) + e^{x^2} \\cdot \\frac{d}{dx}[\\cos(3x)] \\\\ &= e^{x^2} \\cdot 2x \\cdot \\cos(3x) + e^{x^2} \\cdot (-\\sin(3x)) \\cdot 3 \\\\ &= e^{x^2} \\cdot \\cos(3x) \\cdot 2x - 3e^{x^2} \\cdot \\sin(3x) \\\\ &= e^{x^2} \\cdot (-3\\sin(3x)) + \\cos(3x) \\cdot e^{x^2} \\cdot 2x \\end{align}",
        points: 50
      }
    ];
    res.json(challenges2);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared")
    }
  },
  root: path2.resolve(__dirname, "client"),
  build: {
    outDir: path2.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
