"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CountdownCard } from "@/components/countdown-card";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  const router = useRouter();
  const { login, register, token, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      router.push("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto grid max-w-[1200px] gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="space-y-3">
              <Badge>Live backend mode</Badge>
              <h1 className="text-4xl font-bold leading-tight text-black sm:text-5xl">
                Study together.
                <br />
                Track real progress.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-neutral-600">
                The frontend now reads from your real API on `localhost:8000/api/v1`. Sign in to load actual subjects,
                chapters, leaderboard, tasks, progress, and activity.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Real subjects", "Loaded from `/subjects` and `/chapters/subject/:id`"],
                ["Real progress", "Pulled from `/progress/me` and `/progress/subject/:id`"],
                ["Real leaderboard", "Backed by `/leaderboard` and your live rank"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                  <div className="font-semibold text-black">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-neutral-600">{text}</div>
                </div>
              ))}
            </div>

            <CountdownCard />

            {token ? (
              <div className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                <div className="text-sm text-neutral-600">Signed in as</div>
                <div className="mt-1 text-xl font-bold text-black">{user?.name}</div>
                <Link href="/dashboard" className="mt-4 inline-block">
                  <Button>
                    Open Dashboard
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 flex gap-2">
              <button
                className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-black text-white" : "bg-neutral-100 text-black"}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-black text-white" : "bg-neutral-100 text-black"}`}
                onClick={() => setMode("register")}
                type="button"
              >
                Register
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 text-sm font-medium text-black">{mode === "login" ? "Welcome back" : "Create account"}</div>
                <div className="text-sm text-neutral-600">
                  {mode === "login"
                    ? "Use your backend account credentials to load live data."
                    : "Create a user through the real `/auth/register` endpoint."}
                </div>
              </div>

              {mode === "register" ? (
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
              ) : null}

              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required type="email" />
              <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required type="password" />

              {error ? <div className="rounded-[8px] border border-black/15 bg-neutral-100 px-3 py-2 text-sm text-black">{error}</div> : null}

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {mode === "login" ? <LogIn className="mr-2 size-4" /> : <UserPlus className="mr-2 size-4" />}
                {isSubmitting ? "Please wait..." : mode === "login" ? "Login with Real API" : "Register with Real API"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
