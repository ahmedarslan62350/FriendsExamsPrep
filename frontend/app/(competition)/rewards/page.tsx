"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboard } from "@/lib/api";
import { type LeaderboardApiUser } from "@/lib/types";

export default function RewardsPage() {
  const { token } = useAuth();
  const [leader, setLeader] = useState<LeaderboardApiUser | null>(null);
  const [lastPlace, setLastPlace] = useState<LeaderboardApiUser | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    getLeaderboard(authToken)
      .then((items) => {
        setLeader(items[0] ?? null);
        setLastPlace(items[items.length - 1] ?? null);
      })
      .catch(() => {
        setLeader(null);
        setLastPlace(null);
      });
  }, [token]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <Badge>Reward season</Badge>
          <h1 className="mt-4 text-4xl font-bold text-white">Rewards now react to the live leaderboard</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            This page still keeps the fun rules, but the projected winner and danger zone now come from `/leaderboard`.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <Badge>Projected winner</Badge>
            <div className="mt-4 text-3xl font-bold text-white">{leader?.name ?? "No leaderboard data yet"}</div>
            <div className="mt-2 text-sm text-neutral-600">{leader ? `${leader.leaderboardScore ?? leader.xp ?? 0} score` : "Waiting for backend data"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Badge>Current danger zone</Badge>
            <div className="mt-4 text-3xl font-bold text-white">{lastPlace?.name ?? "No leaderboard data yet"}</div>
            <div className="mt-2 text-sm text-neutral-600">{lastPlace ? `${lastPlace.leaderboardScore ?? lastPlace.xp ?? 0} score` : "Waiting for backend data"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
