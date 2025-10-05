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
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Box,
  TrendingUp,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: users } = trpc.user.getAll.useQuery();
  const { data: posts } = trpc.post.getAll.useQuery();

  const stats = [
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: <Users className="w-6 h-6" />,
      variant: "primary" as const,
      href: "/dashboard/users",
    },
    {
      title: "Installed Apps",
      value: "0",
      icon: <Box className="w-6 h-6" />,
      variant: "secondary" as const,
      href: "/dashboard/apps",
    },
    {
      title: "Total Posts",
      value: posts?.length || 0,
      icon: <FileText className="w-6 h-6" />,
      variant: "success" as const,
      href: "#",
    },
    {
      title: "Recent Activity",
      value: "0",
      icon: <Clock className="w-6 h-6" />,
      variant: "warning" as const,
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
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <StatCard {...stat} className="cursor-pointer" />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/apps">
              <Button variant="outline" className="w-full justify-start">
                <Box className="w-5 h-5 mr-2" />
                Browse App Marketplace
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-5 h-5 mr-2" />
                Manage Users
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Analytics
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Badge variant="info">New</Badge>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Account created
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Welcome to NextApp!
                  </p>
                </div>
              </div>
              {posts?.slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Badge variant="success">
                      <FileText className="w-3 h-3" />
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Post created: {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
