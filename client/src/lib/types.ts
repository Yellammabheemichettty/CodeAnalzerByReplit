// Simple types definitions for the client side
// Duplicated from shared/schema.ts to avoid import issues

export type Language = {
  name: string;
  confidence: number;
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