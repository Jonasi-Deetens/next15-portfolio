"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          View insights and metrics across your workspace.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analytics Coming Soon
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            We're working on bringing you comprehensive analytics and reporting
            features. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
