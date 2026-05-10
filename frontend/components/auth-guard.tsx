"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="text-sm text-neutral-500">Checking your session...</div>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <h2 className="text-2xl font-bold text-black">Sign in to load your real exam data</h2>
          <p className="text-sm text-neutral-600">
            This section now reads from your backend on `localhost:8000`, so you need a valid account session first.
          </p>
          <Link href="/">
            <Button>Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
