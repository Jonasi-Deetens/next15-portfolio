"use client";

import { trpc } from "@/lib/trpc-client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Users,
  FileText,
  TrendingUp,
  Star,
  CheckCircle,
  Globe,
  Lock,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: users } = trpc.user.getAll.useQuery();
  const { data: posts, refetch: refetchPosts } = trpc.post.getAll.useQuery();
  const { data: myPosts, refetch: refetchMyPosts } =
    trpc.post.getMyPosts.useQuery(undefined, { enabled: !!session });

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      refetchPosts();
      refetchMyPosts();
      setTitle("");
      setContent("");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - App Grid */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Who{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  are
                </span>
                <br />
                you?
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Create your professional portfolio. Showcase your story. Get
                discovered.
              </p>

              {!session && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    <Link href="/auth/signup" className="flex items-center">
                      Start Building
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    <Link href="/auth/signin">Browse Portfolios</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Simple Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Professional profiles</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Customizable design</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Global reach</span>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div className="text-center lg:text-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple. Beautiful. Effective.
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Build your professional presence in minutes, not hours.
              </p>
            </div>

            {!session && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <Link href="/auth/signup" className="flex items-center">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      {session && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {session.user?.name}! 👋
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your portfolio is ready. Let's showcase your story.
            </p>
            <Button size="lg" className="px-8 py-4 text-lg">
              <Link href="/dashboard" className="flex items-center">
                Manage Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      Portfolio Views
                    </p>
                    <p className="text-3xl font-bold text-emerald-900">1,234</p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Projects
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      {myPosts?.length || 0}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-600">
                      Connections
                    </p>
                    <p className="text-3xl font-bold text-teal-900">42</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">
                      Skills
                    </p>
                    <p className="text-3xl font-bold text-orange-900">12</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Projects
                </CardTitle>
                <CardDescription>Your latest portfolio updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts?.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600">{post.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {post.author.name} •{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Network
                </CardTitle>
                <CardDescription>Your professional connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users?.slice(0, 4).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Badge variant="secondary">
                        {user.posts.length} posts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
