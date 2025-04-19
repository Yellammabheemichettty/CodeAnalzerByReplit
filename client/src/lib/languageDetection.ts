import { Language } from "./types";

/**
 * Client-side language detection as fallback when API is unavailable
 * Uses simple patterns to identify common languages
 * 
 * @param code The source code to analyze
 * @returns The detected language and confidence
 */
export function detectLanguageClient(code: string): Language {
  // Basic patterns to detect common languages
  const patterns: Record<string, RegExp[]> = {
    javascript: [
      /\bfunction\s+\w+\s*\(/i,
      /\bconst\s+\w+\s*=/i,
      /\blet\s+\w+\s*=/i,
      /\bconsole\.log\s*\(/i,
    ],
    typescript: [
      /\binterface\s+\w+/i,
      /\btype\s+\w+\s*=/i,
      /\:\s*\w+/i,
    ],
    python: [
      /\bdef\s+\w+\s*\(/i,
      /\bimport\s+\w+/i,
      /\bif\s+__name__\s*==\s*('|")__main__('|")/i,
    ],
    html: [
      /\<!DOCTYPE\s+html\>/i,
      /\<html\>/i,
      /\<body\>/i,
    ],
    css: [
      /\.\w+\s*\{/i,
      /\#\w+\s*\{/i,
      /\@media\s+/i,
    ],
    java: [
      /\bpublic\s+class\s+\w+/i,
      /\bprivate\s+\w+\s+\w+/i,
    ],
    csharp: [
      /\bnamespace\s+\w+/i,
      /\bpublic\s+class\s+\w+/i,
    ],
  };

  // Count matches for each language
  const scores: Record<string, number> = {};
  let maxScore = 0;
  let detectedLang = "unknown";

  for (const [lang, regexes] of Object.entries(patterns)) {
    let score = 0;
    for (const regex of regexes) {
      if (regex.test(code)) {
        score++;
      }
    }
    scores[lang] = score;
    
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }

  // Calculate confidence based on score difference
  const totalPatterns = patterns[detectedLang]?.length || 1;
  const confidence = maxScore > 0 ? Math.min(maxScore / totalPatterns, 0.8) : 0.3;

  return {
    name: detectedLang,
    confidence,
  };
}
