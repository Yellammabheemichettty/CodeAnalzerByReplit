import { apiRequest } from "./queryClient";
import { 
  CodeAnalysisResponse, 
  Language, 
  CodeIssueResponse, 
  CodeImprovementResponse, 
  CodeMetricsResponse 
} from "@shared/schema";

/**
 * Analyzes code using the backend API
 * @param code The source code to analyze
 * @param language Optional language specification
 * @returns A promise with analysis results
 */
export async function analyzeCode(
  code: string,
  language?: string
): Promise<CodeAnalysisResponse> {
  const response = await apiRequest("POST", "/api/analyze", { code, language });
  const data = await response.json();
  return data as CodeAnalysisResponse;
}

/**
 * Detects the programming language of code
 * @param code The source code to analyze
 * @returns A promise with the detected language
 */
export async function detectLanguage(code: string): Promise<Language> {
  const response = await apiRequest("POST", "/api/detect-language", { code });
  const data = await response.json();
  return data.language as Language;
}

/**
 * Gets the list of supported programming languages
 * @returns A promise with the list of supported languages
 */
export async function getSupportedLanguages(): Promise<string[]> {
  const response = await apiRequest("GET", "/api/languages");
  const data = await response.json();
  return data.languages as string[];
}

/**
 * Counts the lines of code
 * @param code The source code
 * @returns The number of lines
 */
export function countLinesOfCode(code: string): number {
  if (!code) return 0;
  return code.split('\n').length;
}

/**
 * Extracts issue severity class for styling
 * @param severity The issue severity
 * @returns The corresponding CSS class
 */
export function getIssueSeverityClass(severity: string): string {
  switch (severity) {
    case 'high':
      return 'bg-red-50 border-red-400 text-red-700';
    case 'medium':
      return 'bg-yellow-50 border-yellow-400 text-yellow-700';
    case 'low':
      return 'bg-blue-50 border-blue-400 text-blue-700';
    default:
      return 'bg-gray-50 border-gray-400 text-gray-700';
  }
}

/**
 * Gets the icon name based on issue type
 * @param type The issue type
 * @returns The icon name to use
 */
export function getIssueTypeIcon(type: string): string {
  switch (type) {
    case 'error':
      return 'CircleX';
    case 'warning':
      return 'AlertTriangle';
    default:
      return 'AlertCircle';
  }
}

/**
 * Generates a color class for maintainability score
 * @param score The maintainability score (0-100)
 * @returns The corresponding CSS class
 */
export function getMaintainabilityColorClass(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}
