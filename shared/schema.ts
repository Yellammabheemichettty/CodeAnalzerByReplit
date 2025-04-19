import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const codeAnalyses = pgTable("code_analyses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  language: text("language"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const codeIssues = pgTable("code_issues", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").notNull(),
  type: text("type").notNull(), // "warning", "error", etc.
  message: text("message").notNull(),
  lineNumbers: text("line_numbers"),
  severity: text("severity"), // "low", "medium", "high"
});

export const codeImprovements = pgTable("code_improvements", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCodeAnalysisSchema = createInsertSchema(codeAnalyses).pick({
  code: true,
  language: true,
  description: true,
});

export const insertCodeIssueSchema = createInsertSchema(codeIssues).pick({
  analysisId: true,
  type: true,
  message: true,
  lineNumbers: true,
  severity: true,
});

export const insertCodeImprovementSchema = createInsertSchema(codeImprovements).pick({
  analysisId: true,
  title: true,
  description: true,
  code: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type CodeAnalysis = typeof codeAnalyses.$inferSelect;

export type InsertCodeIssue = z.infer<typeof insertCodeIssueSchema>;
export type CodeIssue = typeof codeIssues.$inferSelect;

export type InsertCodeImprovement = z.infer<typeof insertCodeImprovementSchema>;
export type CodeImprovement = typeof codeImprovements.$inferSelect;

// Types for API responses
export type Language = {
  name: string;
  confidence: number;
};

export type CodeDescriptionResponse = {
  description: string;
};

export type CodeIssueResponse = {
  type: string;
  message: string;
  lineNumbers?: string;
  severity: string;
};

export type CodeImprovementResponse = {
  title: string;
  description: string;
  code?: string;
};

export type CodeMetricsResponse = {
  linesOfCode: number;
  functions: number;
  complexity: string;
  maintainabilityScore: number;
};

export type CodeAnalysisResponse = {
  language: Language;
  description: string;
  issues: CodeIssueResponse[];
  improvements: CodeImprovementResponse[];
  metrics: CodeMetricsResponse;
};
