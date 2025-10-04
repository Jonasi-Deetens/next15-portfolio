"use client";

import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import {
  Home,
  Users,
  Cube,
  Settings,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Apps", href: "/dashboard/apps", icon: Cube },
  { name: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = session?.user?.role && ["ADMIN", "SUPER_ADMIN"].includes(session.user.role);

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            NextApp
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 py-6 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              NextApp
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar
                src={session?.user?.image}
                fallback={session?.user?.name || "U"}
                alt={session?.user?.name || "User"}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 lg:hidden hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex lg:justify-end">
            {/* Could add search, notifications, etc. here */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
