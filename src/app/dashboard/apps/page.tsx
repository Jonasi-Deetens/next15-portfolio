"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Box, Download, Check } from "lucide-react";

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
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Box className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium text-center">
              No apps installed yet
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
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
            <Card
              key={app.id}
              className="hover:shadow-lg transition-all hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-2xl">
                      {app.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {app.displayName}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default">{app.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          v{app.version}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button size="sm" disabled className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </Button>
                  {app.isInstalled && (
                    <Badge variant="success">
                      <Check className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
