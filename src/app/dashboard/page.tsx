"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  UserGroupIcon,
  CubeIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: users } = trpc.user.getAll.useQuery();
  const { data: posts } = trpc.post.getAll.useQuery();

  const stats = [
    {
      name: "Total Users",
      value: users?.length || 0,
      icon: UserGroupIcon,
      color: "bg-blue-500",
      href: "/dashboard/users",
    },
    {
      name: "Installed Apps",
      value: "0",
      icon: CubeIcon,
      color: "bg-purple-500",
      href: "/dashboard/apps",
    },
    {
      name: "Total Posts",
      value: posts?.length || 0,
      icon: ChartBarIcon,
      color: "bg-green-500",
      href: "#",
    },
    {
      name: "Recent Activity",
      value: "0",
      icon: ClockIcon,
      color: "bg-orange-500",
      href: "/dashboard/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name || "User"}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/apps">
              <Button variant="outline" className="w-full justify-start">
                <CubeIcon className="w-5 h-5 mr-2" />
                Browse App Marketplace
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full justify-start">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Account created
                  </p>
                  <p className="text-xs text-gray-500">
                    Welcome to NextApp!
                  </p>
                </div>
              </div>
              {posts?.slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Post created: {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
