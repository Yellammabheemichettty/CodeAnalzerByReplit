import type { CodeMetricsResponse } from '@shared/schema';
import { getMaintainabilityColorClass } from '../../lib/codeAnalysis';

interface CodeMetricsProps {
  metrics: CodeMetricsResponse;
}

export default function CodeMetrics({ metrics }: CodeMetricsProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Code Metrics</h3>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Lines of Code</td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{metrics.linesOfCode}</td>
            </tr>
            <tr>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Functions</td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{metrics.functions}</td>
            </tr>
            <tr>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Complexity</td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                {metrics.complexity.charAt(0).toUpperCase() + metrics.complexity.slice(1)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Maintainability</td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${getMaintainabilityColorClass(metrics.maintainabilityScore)} h-2.5 rounded-full`} 
                      style={{ width: `${metrics.maintainabilityScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{metrics.maintainabilityScore}/100</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
