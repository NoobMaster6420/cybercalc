import { users, quizzes, challenges, type User, type InsertUser, type Quiz, type InsertQuiz, type Challenge, type InsertChallenge, type UserProgress } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  updateUserLives(userId: number, lives: number): Promise<User | undefined>;
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  getQuizzesByUserId(userId: number): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getChallengesByUserId(userId: number): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getTopUsers(limit: number): Promise<User[]>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizzes: Map<number, Quiz>;
  private challenges: Map<number, Challenge>;
  public sessionStore: session.SessionStore;
  currentUserId: number;
  currentQuizId: number;
  currentChallengeId: number;

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.challenges = new Map();
    this.currentUserId = 1;
    this.currentQuizId = 1;
    this.currentChallengeId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // One day
    });

    // Seed some users for the leaderboard
    const seedUsers = [
      { username: "MathWizard", password: "password", points: 1250, lives: 3 },
      { username: "DerivativeNinja", password: "password", points: 980, lives: 3 },
      { username: "CalculusKing", password: "password", points: 875, lives: 3 },
      { username: "DeltaMaster", password: "password", points: 740, lives: 3 },
      { username: "DerivativeQueen", password: "password", points: 685, lives: 3 },
      { username: "IntegralHero", password: "password", points: 620, lives: 3 },
      { username: "FunctionPro", password: "password", points: 590, lives: 3 }
    ];

    seedUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, { ...user, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, points: 0, lives: 3 };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, points };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserLives(userId: number, lives: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, lives };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    return {
      userId: user.id,
      points: user.points,
      lives: user.lives
    };
  }

  async getQuizzesByUserId(userId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.userId === userId
    );
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async getChallengesByUserId(userId: number): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.userId === userId
    );
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const challenge: Challenge = { ...insertChallenge, id };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async getTopUsers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
