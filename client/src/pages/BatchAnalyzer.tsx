import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function BatchAnalyzer() {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Coming Soon</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The Batch Analyzer feature is currently under development. This feature will allow you to analyze multiple code files at once.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
