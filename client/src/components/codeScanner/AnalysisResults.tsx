import { CodeAnalysisResponse } from '@shared/schema';
import PotentialIssues from './PotentialIssues';
import SuggestedImprovements from './SuggestedImprovements';
import CodeMetrics from './CodeMetrics';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AnalysisResultsProps {
  result: CodeAnalysisResponse | null;
  isLoading: boolean;
}

export default function AnalysisResults({ result, isLoading }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Analyzing your code...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
        <div className="bg-gray-50 rounded-md p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No analysis results yet.</p>
          <p className="text-sm text-gray-500">Enter your code and click 'Analyze Code' to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
      
      {/* Language Detection Result */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Detected Language</h3>
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-800 text-lg font-medium py-1 px-4 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {result.language.name.charAt(0).toUpperCase() + result.language.name.slice(1)}
          </div>
          <div className="ml-3 text-sm text-gray-500">
            Confidence: {Math.round(result.language.confidence * 100)}%
          </div>
        </div>
      </div>
      
      {/* Code Description */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Code Description</h3>
        <div className="bg-gray-50 rounded-md p-4 text-sm">
          <p>{result.description}</p>
        </div>
      </div>
      
      {/* Potential Issues */}
      <PotentialIssues issues={result.issues} />
      
      {/* Suggested Improvements */}
      <SuggestedImprovements improvements={result.improvements} />
      
      {/* Code Metrics */}
      <CodeMetrics metrics={result.metrics} />
    </div>
  );
}
