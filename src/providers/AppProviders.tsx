import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "@/lib/queryClient";

import type { ReactNode } from "react";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
