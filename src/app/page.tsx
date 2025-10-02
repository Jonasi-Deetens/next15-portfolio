"use client";

import { trpc } from "@/lib/trpc-client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NextApp
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A modern full-stack application built with Next.js 15, tRPC, Prisma,
            and NextAuth. Experience the power of type-safe APIs and seamless
            authentication.
          </p>

          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        {session && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users Section */}
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>View registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users?.map((user) => (
                    <div key={user.id} className="p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.posts.length} posts
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Posts Section */}
            <Card>
              <CardHeader>
                <CardTitle>Posts</CardTitle>
                <CardDescription>Create and manage posts</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (session) {
                      createPost.mutate({
                        title,
                        content,
                      });
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter content"
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createPost.isPending || !session}
                    className="w-full"
                    loading={createPost.isPending}
                  >
                    {createPost.isPending ? "Creating..." : "Create Post"}
                  </Button>
                </form>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      All Posts
                    </h3>
                    <div className="space-y-2">
                      {posts?.map((post) => (
                        <div
                          key={post.id}
                          className="p-3 bg-gray-50 rounded-md"
                        >
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-600">
                            {post.content}
                          </div>
                          <div className="text-xs text-gray-500">
                            By {post.author.name} •{" "}
                            {post.published ? "Published" : "Draft"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      My Posts
                    </h3>
                    <div className="space-y-2">
                      {myPosts?.map((post) => (
                        <div
                          key={post.id}
                          className="p-3 bg-blue-50 rounded-md"
                        >
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-600">
                            {post.content}
                          </div>
                          <div className="text-xs text-gray-500">
                            {post.published ? "Published" : "Draft"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
