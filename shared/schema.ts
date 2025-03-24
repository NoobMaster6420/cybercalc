import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  points: integer("points").notNull().default(0),
  lives: integer("lives").notNull().default(3),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  difficulty: text("difficulty").notNull(),
  score: integer("score").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  userId: true,
  difficulty: true,
  score: true,
  completedAt: true,
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  userId: true,
  score: true,
  completedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

// Types for the quiz questions
export interface QuizQuestion {
  id: number;
  question: string;
  formula: string;
  options: {
    id: string;
    formula: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChallengeQuestion {
  id: number;
  question: string;
  formula: string;
  options: {
    id: string;
    formula: string;
  }[];
  correctOptionId: string;
  explanation: string;
  points: number;
}

export interface UserProgress {
  userId: number;
  points: number;
  lives: number;
}
