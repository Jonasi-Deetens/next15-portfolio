"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

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
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Analytics Coming Soon
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            We're working on bringing you comprehensive analytics and reporting
            features. Check back soon!
          </p>
          <div className="flex gap-2">
            <Badge variant="info">
              <BarChart3 className="w-3 h-3 mr-1" />
              Charts
            </Badge>
            <Badge variant="secondary">
              <PieChart className="w-3 h-3 mr-1" />
              Reports
            </Badge>
            <Badge variant="success">
              <Activity className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
