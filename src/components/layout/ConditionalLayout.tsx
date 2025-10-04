"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    // For auth pages, render children directly (no navbar/footer)
    return <>{children}</>;
  }

  // For all other pages, render with navbar and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
