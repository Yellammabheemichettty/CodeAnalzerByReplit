import { CodeImprovementResponse } from '@shared/schema';
import { Check } from 'lucide-react';

interface SuggestedImprovementsProps {
  improvements: CodeImprovementResponse[];
}

export default function SuggestedImprovements({ improvements }: SuggestedImprovementsProps) {
  if (!improvements || improvements.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Improvements</h3>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="divide-y divide-gray-200">
          {improvements.map((improvement, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{improvement.title}</h4>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{improvement.description}</p>
                    {improvement.code && (
                      <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {improvement.code}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
