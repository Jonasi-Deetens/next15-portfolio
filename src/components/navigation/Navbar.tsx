"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NextApp</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/posts"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Posts
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name || session.user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  loading={isSigningOut}
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => router.push("/auth/signup")}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
