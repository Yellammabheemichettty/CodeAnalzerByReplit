import OpenAI from "openai";
import { 
  CodeAnalysisResponse, 
  CodeIssueResponse, 
  CodeImprovementResponse,
  CodeMetricsResponse
} from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "REPLACE_WITH_VALID_API_KEY" });

/**
 * Analyzes code to provide description, issues, improvements, and metrics
 * @param code The source code to analyze
 * @param language The detected or specified programming language
 * @returns A complete code analysis response
 */
export async function analyzeCode(code: string, language: string): Promise<CodeAnalysisResponse> {
  try {
    const prompt = `
You are an expert code analysis system. Analyze the following ${language} code and provide:

1. A concise description (3-5 sentences) of what the code does
2. A list of potential issues or bugs
3. Suggestions for code improvements
4. Code metrics

Respond with a JSON object in the following format:
{
  "description": "Brief description of the code's functionality",
  "issues": [
    {
      "type": "warning|error",
      "message": "Description of the issue",
      "lineNumbers": "Line numbers where the issue occurs",
      "severity": "low|medium|high"
    }
  ],
  "improvements": [
    {
      "title": "Short title for the improvement",
      "description": "Detailed explanation",
      "code": "Code example showing the improvement"
    }
  ],
  "metrics": {
    "linesOfCode": 0,
    "functions": 0,
    "complexity": "low|medium|high",
    "maintainabilityScore": 0-100
  }
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`
`;

    // Fallback analysis in case of API issues
    const fallbackAnalysis: CodeAnalysisResponse = {
      language: { name: language, confidence: 0.8 },
      description: "This appears to be " + language + " code. Analysis unavailable without API access.",
      issues: [],
      improvements: [{ 
        title: "Enable API for detailed analysis", 
        description: "For full code analysis, please provide a valid OpenAI API key."
      }],
      metrics: {
        linesOfCode: code.split('\n').length,
        functions: 0,
        complexity: "unknown",
        maintainabilityScore: 50
      }
    };

    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "REPLACE_WITH_VALID_API_KEY") {
      console.warn("No valid OpenAI API key provided. Using fallback analysis.");
      return fallbackAnalysis;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    const analysisData = JSON.parse(content);
    
    // Process and validate the OpenAI response
    return {
      language: { name: language, confidence: 0.9 },
      description: analysisData.description || "No description available",
      issues: validateIssues(analysisData.issues || []),
      improvements: validateImprovements(analysisData.improvements || []),
      metrics: validateMetrics(analysisData.metrics || {}),
    };
  } catch (error) {
    console.error("Error analyzing code with OpenAI:", error);
    
    // Calculate basic metrics without API
    const lines = code.split('\n');
    const functionMatches = code.match(/function\s+\w+\s*\(|\bdef\s+\w+\s*\(|\bfunc\s+\w+\s*\(|\bpublic\s+\w+\s+\w+\s*\(/g);
    
    // Return more detailed fallback analysis
    return {
      language: { name: language, confidence: 0.8 },
      description: "This code appears to be written in " + language + ". I can provide basic metrics, but detailed analysis requires a valid API key with sufficient quota.",
      issues: [
        {
          type: "warning",
          message: "API quota exceeded. Analysis limited to basic metrics.",
          severity: "medium"
        }
      ],
      improvements: [
        {
          title: "Provide valid API key",
          description: "For detailed code analysis, please update the OPENAI_API_KEY environment variable with a valid key that has sufficient quota."
        },
        {
          title: "Consider local analysis",
          description: "For basic linting and code quality checks, consider using local tools like ESLint, Pylint, or other language-specific analyzers."
        }
      ],
      metrics: {
        linesOfCode: lines.length,
        functions: functionMatches ? functionMatches.length : 0,
        complexity: "unknown",
        maintainabilityScore: 50,
      }
    };
  }
}

// Helper functions to validate and sanitize API responses
function validateIssues(issues: any[]): CodeIssueResponse[] {
  return issues.map(issue => ({
    type: typeof issue.type === 'string' ? issue.type : 'warning',
    message: typeof issue.message === 'string' ? issue.message : 'Unknown issue',
    lineNumbers: typeof issue.lineNumbers === 'string' ? issue.lineNumbers : undefined,
    severity: ['low', 'medium', 'high'].includes(issue.severity) ? issue.severity : 'medium'
  }));
}

function validateImprovements(improvements: any[]): CodeImprovementResponse[] {
  return improvements.map(improvement => ({
    title: typeof improvement.title === 'string' ? improvement.title : 'Unknown improvement',
    description: typeof improvement.description === 'string' ? improvement.description : 'No description available',
    code: typeof improvement.code === 'string' ? improvement.code : undefined
  }));
}

function validateMetrics(metrics: any): CodeMetricsResponse {
  return {
    linesOfCode: typeof metrics.linesOfCode === 'number' ? metrics.linesOfCode : 0,
    functions: typeof metrics.functions === 'number' ? metrics.functions : 0,
    complexity: ['low', 'medium', 'high'].includes(metrics.complexity) ? metrics.complexity : 'unknown',
    maintainabilityScore: typeof metrics.maintainabilityScore === 'number' && 
      metrics.maintainabilityScore >= 0 && 
      metrics.maintainabilityScore <= 100 ? 
      metrics.maintainabilityScore : 50
  };
}
