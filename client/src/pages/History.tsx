import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function History() {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <Clock className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Coming Soon</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The History feature is currently under development. This feature will allow you to view and manage your past code analyses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
