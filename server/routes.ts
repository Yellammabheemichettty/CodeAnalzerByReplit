import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertCodeAnalysisSchema, 
  insertCodeIssueSchema, 
  insertCodeImprovementSchema 
} from "@shared/schema";
import { detectLanguage } from "./services/languageDetectionService";
import { analyzeCode } from "./services/codeAnalysisService";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for analyzing code
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }

      // Detect language if not provided
      const detectedLanguage = language || await detectLanguage(code);
      
      // Analyze the code
      const analysis = await analyzeCode(code, detectedLanguage);
      
      // Save analysis to storage if needed
      // const insertedAnalysis = await storage.createCodeAnalysis({
      //   code,
      //   language: detectedLanguage,
      //   description: analysis.description,
      // });
      
      return res.json(analysis);
    } catch (error) {
      console.error("Error analyzing code:", error);
      return res.status(500).json({ message: "Error analyzing code" });
    }
  });

  // API route for detecting language only
  app.post("/api/detect-language", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }

      const language = await detectLanguage(code);
      return res.json({ language });
    } catch (error) {
      console.error("Error detecting language:", error);
      return res.status(500).json({ message: "Error detecting language" });
    }
  });

  // API route for supported languages
  app.get("/api/languages", (req, res) => {
    const supportedLanguages = [
      "javascript", "typescript", "python", "java", "csharp", "cpp", 
      "php", "ruby", "go", "rust", "swift", "kotlin", "html", "css", 
      "sql", "shell", "powershell", "perl", "r", "matlab"
    ];
    
    return res.json({ languages: supportedLanguages });
  });

  const httpServer = createServer(app);
  return httpServer;
}
