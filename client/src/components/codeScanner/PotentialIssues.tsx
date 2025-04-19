import type { CodeIssueResponse } from '../../lib/types';
import { getIssueSeverityClass } from '../../lib/codeAnalysis';
import { AlertTriangle, CircleX, AlertCircle } from 'lucide-react';

interface PotentialIssuesProps {
  issues: CodeIssueResponse[];
}

export default function PotentialIssues({ issues }: PotentialIssuesProps) {
  if (!issues || issues.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Potential Issues</h3>
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                No issues detected in your code.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Potential Issues</h3>
      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div key={index} className={`border-l-4 p-4 ${getIssueSeverityClass(issue.severity)}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {issue.type === 'error' ? (
                  <CircleX className="h-5 w-5 text-red-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  <span className="font-medium">
                    {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}:
                  </span>{' '}
                  {issue.message}
                </p>
                {issue.lineNumbers && (
                  <p className="mt-1 text-xs text-gray-600">
                    Line {issue.lineNumbers}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
