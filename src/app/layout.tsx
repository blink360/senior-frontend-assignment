"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import "./globals.css";
import { BatchItemApprovalProvider } from "./global-state/BatchItemApprovalContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <BatchItemApprovalProvider>
            <div className="min-h-screen bg-slate-50 text-slate-900">
              {children}
            </div>
          </BatchItemApprovalProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
