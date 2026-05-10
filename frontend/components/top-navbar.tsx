"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { getLeaderboard } from "@/lib/api";
import { type LeaderboardApiUser } from "@/lib/types";

export function TopNavbar() {
  const { token } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardApiUser[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    const load = () =>
      getLeaderboard(authToken)
        .then((data) => setLeaders(data.slice(0, 4)))
        .catch(() => {});

    void load();
    const interval = globalThis.setInterval(load, 20000);
    return () => globalThis.clearInterval(interval);
  }, [token]);

  return (
    <header className="sticky top-2 z-30 mb-4">
      <div className="glass-panel flex flex-col gap-3 rounded-[12px] p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="flex items-center justify-between gap-2 rounded-[8px] border border-black/15 bg-neutral-50 px-3 py-2">
            <Users className="size-4 text-black" />
            <div className="flex -space-x-2">
              {leaders.map((friend) => (
                <Avatar
                  key={friend._id ?? friend.id ?? friend.name}
                  initials={friend.name.slice(0, 2).toUpperCase()}
                  className="size-8 border-2 border-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
