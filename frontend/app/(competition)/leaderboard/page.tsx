"use client";

import { useEffect, useState } from "react";
import { Crown, Trophy } from "lucide-react";

import { LeaderboardRow } from "@/components/leaderboard-row";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboard, getMyRank } from "@/lib/api";
import { type LeaderboardRowData } from "@/lib/types";

function getAvatar(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LeaderboardPage() {
  const { token, user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRowData[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    Promise.all([getLeaderboard(authToken), getMyRank(authToken)])
      .then(([leaderboard, rank]) => {
        setRows(
          leaderboard.map((item, index) => ({
            id: item._id ?? item.id ?? `${item.name}-${index}`,
            name: item.name,
            username: item.email ? `@${item.email.split("@")[0]}` : undefined,
            avatar: getAvatar(item.name),
            xp: item.leaderboardScore ?? item.xp ?? 0,
            streak: item.streak ?? 0,
            progress: item.progressPercent ?? 0,
            todayMinutes: item.totalStudyMinutes ?? 0,
            rank: index + 1,
            movement: "same",
          })),
        );
        setMyRank(rank.rank);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load leaderboard."));
  }, [token]);

  const leader = rows[0];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge>Leaderboard spotlight</Badge>
              <h1 className="mt-4 text-5xl font-bold leading-none text-white md:text-6xl">Global ranks from the real API</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                This page is now populated by `/leaderboard` and `/leaderboard/me/rank`.
              </p>
            </div>
            <div className="rounded-[12px] border border-black/15 bg-neutral-50 p-5 min-w-[280px]">
              <div className="flex items-center gap-3 text-black">
                <Crown className="size-6" />
                <span className="text-sm uppercase tracking-[0.16em]">Current throne</span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white">{leader?.name ?? "No data yet"}</div>
              <div className="mt-3 text-sm text-neutral-600">Your rank: #{myRank || "-"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? <div className="text-sm text-neutral-600">{error}</div> : null}

      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge>Full ranking board</Badge>
              <h2 className="mt-3 text-3xl font-bold text-white">Every move is visible</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-black/15 bg-neutral-50 px-4 py-2 text-sm text-neutral-600">
              <Trophy className="size-4 text-black" />
              Logged in as {user?.name ?? "user"}
            </div>
          </div>
          <div className="mt-6 overflow-x-auto scrollbar-thin">
            <div className="min-w-[980px] space-y-3">
              <div className="grid grid-cols-[52px_1.4fr_repeat(4,minmax(0,1fr))_76px] gap-3 px-4 text-xs uppercase tracking-[0.24em] text-slate-500">
                <div>Rank</div>
                <div>Name</div>
                <div>Total XP</div>
                <div>Completion</div>
                <div>Study time</div>
                <div>Streak</div>
                <div>Change</div>
              </div>
              {rows.map((friend) => (
                <LeaderboardRow
                  key={friend.id}
                  friend={friend}
                  highlightCurrentUser={friend.username === (user?.email ? `@${user.email.split("@")[0]}` : undefined) || friend.name === user?.name}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
