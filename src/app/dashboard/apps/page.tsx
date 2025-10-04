"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CubeIcon } from "@heroicons/react/24/outline";

const availableApps = [
  {
    id: "crm",
    name: "CRM",
    displayName: "Customer Relationship Management",
    description: "Manage contacts, deals, and sales pipeline",
    category: "Sales",
    icon: "💼",
    version: "1.0.0",
    isInstalled: false,
  },
  {
    id: "project-management",
    name: "Project Management",
    displayName: "Project Management",
    description: "Tasks, sprints, and team collaboration",
    category: "Productivity",
    icon: "📋",
    version: "1.0.0",
    isInstalled: false,
  },
  {
    id: "inventory",
    name: "Inventory",
    displayName: "Inventory Management",
    description: "Track products, stock, and suppliers",
    category: "Operations",
    icon: "📦",
    version: "1.0.0",
    isInstalled: false,
  },
  {
    id: "analytics",
    name: "Analytics",
    displayName: "Analytics Dashboard",
    description: "Cross-app insights and reporting",
    category: "Analytics",
    icon: "📊",
    version: "1.0.0",
    isInstalled: false,
  },
];

export default function AppsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">App Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Browse and install apps to extend your workspace functionality.
        </p>
      </div>

      {/* Installed Apps Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Installed Apps
        </h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CubeIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">
              You haven't installed any apps yet.
            </p>
            <p className="text-sm text-gray-500 text-center mt-1">
              Browse the marketplace below to get started.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Apps Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Apps
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableApps.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{app.icon}</div>
                    <div>
                      <CardTitle className="text-lg">
                        {app.displayName}
                      </CardTitle>
                      <p className="text-xs text-gray-500">{app.category}</p>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {app.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">v{app.version}</span>
                  <Button size="sm" disabled>
                    Install
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
