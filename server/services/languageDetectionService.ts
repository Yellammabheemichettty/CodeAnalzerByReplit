import { Language } from "@shared/schema";

// Map of file extensions to languages
const extensionToLanguage: Record<string, string> = {
  ".js": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".py": "python",
  ".java": "java",
  ".cs": "csharp",
  ".cpp": "cpp",
  ".c": "c",
  ".php": "php",
  ".rb": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".swift": "swift",
  ".kt": "kotlin",
  ".html": "html",
  ".css": "css",
  ".sql": "sql",
  ".sh": "shell",
  ".ps1": "powershell",
  ".pl": "perl",
  ".r": "r",
  ".m": "matlab",
};

// Language patterns for detection
const languagePatterns: Record<string, RegExp[]> = {
  javascript: [
    /\bfunction\s+\w+\s*\(/i,
    /\bconst\s+\w+\s*=/i,
    /\blet\s+\w+\s*=/i,
    /\bvar\s+\w+\s*=/i,
    /\bconsole\.log\s*\(/i,
    /\bdocument\./i,
    /=>\s*{/i,
  ],
  typescript: [
    /\binterface\s+\w+\s*{/i,
    /\btype\s+\w+\s*=/i,
    /\:\s*string\b/i,
    /\:\s*number\b/i,
    /\:\s*boolean\b/i,
    /\<\w+\>/i,
  ],
  python: [
    /\bdef\s+\w+\s*\(\s*\w*\s*\)\:/i,
    /\bimport\s+\w+/i,
    /\bfrom\s+\w+\s+import/i,
    /\bclass\s+\w+\s*\:/i,
    /\bif\s+__name__\s*==\s*('|")__main__('|")\s*\:/i,
  ],
  java: [
    /\bpublic\s+class\s+\w+/i,
    /\bprivate\s+\w+\s+\w+\s*;/i,
    /\bpublic\s+static\s+void\s+main\s*\(/i,
    /\bSystem\.out\.println\s*\(/i,
  ],
  csharp: [
    /\bnamespace\s+\w+/i,
    /\busing\s+\w+\s*;/i,
    /\bpublic\s+class\s+\w+/i,
    /\bConsole\.WriteLine\s*\(/i,
  ],
  cpp: [
    /\#include\s*\<\w+(\.\w+)?\>/i,
    /\bstd::/i,
    /\bint\s+main\s*\(\s*(?:void|int\s+argc,\s*char\s*\*\s*argv\[\s*\])\s*\)/i,
    /\busing\s+namespace\s+std\s*;/i,
  ],
  php: [
    /\<\?php/i,
    /\becho\s+/i,
    /\bfunction\s+\w+\s*\(/i,
    /\$\w+\s*=/i,
  ],
  ruby: [
    /\bdef\s+\w+/i,
    /\bclass\s+\w+\s*</i,
    /\bmodule\s+\w+/i,
    /\bend\b/i,
    /\battr_accessor\s+:/i,
  ],
  go: [
    /\bpackage\s+\w+/i,
    /\bimport\s+\(/i,
    /\bfunc\s+\w+\s*\(/i,
    /\btype\s+\w+\s+struct\s*{/i,
  ],
  rust: [
    /\bfn\s+\w+\s*\(/i,
    /\blet\s+mut\s+\w+/i,
    /\buse\s+\w+::/i,
    /\bpub\s+struct\s+\w+/i,
    /\bimpl\s+\w+\s+for\s+\w+/i,
  ],
  swift: [
    /\bfunc\s+\w+\s*\(/i,
    /\bvar\s+\w+\s*:/i,
    /\blet\s+\w+\s*:/i,
    /\bclass\s+\w+\s*:/i,
    /\bimport\s+\w+/i,
  ],
  kotlin: [
    /\bfun\s+\w+\s*\(/i,
    /\bval\s+\w+\s*:/i,
    /\bvar\s+\w+\s*:/i,
    /\bclass\s+\w+\s*\(/i,
    /\bimport\s+\w+/i,
  ],
  html: [
    /\<!DOCTYPE\s+html\>/i,
    /\<html\>/i,
    /\<head\>/i,
    /\<body\>/i,
    /\<div\>/i,
  ],
  css: [
    /\.\w+\s*{/i,
    /\#\w+\s*{/i,
    /\@media\s+/i,
    /\bmargin\s*:/i,
    /\bpadding\s*:/i,
    /\bcolor\s*:/i,
  ],
  sql: [
    /\bSELECT\s+\w+\s+FROM\s+\w+/i,
    /\bINSERT\s+INTO\s+\w+/i,
    /\bUPDATE\s+\w+\s+SET\s+/i,
    /\bDELETE\s+FROM\s+\w+/i,
    /\bCREATE\s+TABLE\s+\w+/i,
  ],
};

/**
 * Detects the programming language of the given code
 * @param code The source code to analyze
 * @param filename Optional filename to help with detection
 * @returns A Language object with name and confidence score
 */
export async function detectLanguage(code: string, filename?: string): Promise<Language> {
  // Try to detect from filename extension if provided
  if (filename) {
    const extensionMatch = filename.match(/(\.\w+)$/);
    if (extensionMatch && extensionMatch[1] in extensionToLanguage) {
      return {
        name: extensionToLanguage[extensionMatch[1]],
        confidence: 0.9, // High confidence for extension match
      };
    }
  }
  
  // Detect based on code patterns
  const scores: Record<string, number> = {};
  let totalMatches = 0;
  
  // Calculate scores for each language
  for (const [language, patterns] of Object.entries(languagePatterns)) {
    let matches = 0;
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        matches++;
      }
    }
    scores[language] = matches;
    totalMatches += matches;
  }
  
  // Find the language with the highest score
  let bestMatch = { name: "unknown", score: 0 };
  for (const [language, score] of Object.entries(scores)) {
    if (score > bestMatch.score) {
      bestMatch = { name: language, score };
    }
  }
  
  // Calculate confidence (normalized score)
  const confidence = totalMatches > 0 
    ? Math.min(bestMatch.score / Math.max(...Object.values(scores)), 0.98) 
    : 0.3;
  
  return {
    name: bestMatch.name,
    confidence,
  };
}
