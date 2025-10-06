"use client";

import { ReactNode, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Home,
  Users,
  Settings,
  Menu,
  X,
  TrendingUp,
  Bell,
  LogOut,
  Sparkles,
  FileText,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview",
    alwaysVisible: true,
  },
  {
    name: "Portfolio",
    href: "/dashboard/portfolio-builder",
    icon: FileText,
    description: "Build portfolio",
    settingKey: "portfolioBuilder",
  },
  {
    name: "My Resumes",
    href: "/dashboard/resumes",
    icon: FileText,
    description: "Manage resumes",
    settingKey: "resumeBuilder",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: TrendingUp,
    description: "Insights",
    settingKey: "analytics",
  },
  {
    name: "Network",
    href: "/dashboard/network",
    icon: Users,
    description: "Connections",
    settingKey: "network",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Preferences",
    alwaysVisible: true,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Load user settings
  // @ts-expect-error - tRPC type instantiation issue
  const { data: userSettings } = trpc.user.getSettings.useQuery();

  // Filter navigation based on user settings
  const filteredNavigation = navigation.filter((item) => {
    // Always show items marked as alwaysVisible
    if (item.alwaysVisible) return true;

    // Check if the feature is enabled in user settings
    if (item.settingKey && userSettings) {
      const settingValue = (userSettings as Record<string, boolean>)[
        item.settingKey
      ];
      // Default to true if setting is not explicitly set to false
      return settingValue !== false;
    }

    // Default to showing if no settings data yet
    return true;
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Whoareyou
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive =
              item.name === "Dashboard"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-100">
          <div className="flex items-center h-16 px-4 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Whoareyou
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive =
                item.name === "Dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={session?.user?.image}
                fallback={session?.user?.name || "U"}
                alt={session?.user?.name || "User"}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "User"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-100 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 lg:hidden hover:text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge
                variant="danger"
                className="absolute -top-1 -right-1 w-4 h-4 text-xs"
              >
                3
              </Badge>
            </Button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <Avatar
                src={session?.user?.image}
                fallback={session?.user?.name || "U"}
                alt={session?.user?.name || "User"}
                size="sm"
              />
              <div className="text-sm font-medium text-gray-700">
                {session?.user?.name || "User"}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
