"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "./trpc-client";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClientInstance] = useState(() => trpcClient);

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClientInstance} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
