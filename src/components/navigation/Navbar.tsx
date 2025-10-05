"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Whoareyou</span>
            </Link>
          </div>

          {/* Title in middle */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-700">
              Portfolio Platform
            </h1>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : session ? (
              <Button onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signup"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Register
                </Link>
                <Button onClick={() => router.push("/auth/signin")}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
