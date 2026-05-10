import { ArrowDownRight, ArrowRight, ArrowUpRight, Crown, Medal, Shield } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { cn, formatMinutes } from "@/lib/utils";
import { type LeaderboardRowData } from "@/lib/types";

function movementIcon(direction: LeaderboardRowData["movement"]) {
  if (direction === "up") return <ArrowUpRight className="size-4 text-black" />;
  if (direction === "down") return <ArrowDownRight className="size-4 text-black" />;
  return <ArrowRight className="size-4 text-neutral-500" />;
}

function topRankIcon(rank: number) {
  if (rank === 1) return <Crown className="size-4 text-black" />;
  if (rank === 2) return <Shield className="size-4 text-black" />;
  if (rank === 3) return <Medal className="size-4 text-black" />;
  return null;
}

export function LeaderboardRow({
  friend,
  highlightCurrentUser = false,
  compact = false,
}: {
  friend: LeaderboardRowData;
  highlightCurrentUser?: boolean;
  compact?: boolean;
}) {
  const isTop = friend.rank <= 3;

  return (
    <div
      className={cn(
        "grid grid-cols-[44px_minmax(0,1.4fr)_auto] gap-3 rounded-[10px] border border-black/15 px-3 py-3 text-sm",
        highlightCurrentUser && "sticky top-16 z-10 bg-neutral-100",
        !highlightCurrentUser && "bg-white",
        compact && "grid-cols-[34px_minmax(0,1fr)_auto]",
        !compact && "lg:grid-cols-[52px_1.4fr_repeat(4,minmax(0,1fr))_76px]",
        isTop && "border-black/30",
      )}
    >
      <div className="flex items-center gap-2 font-bold text-black">
        <span>#{friend.rank}</span>
        {topRankIcon(friend.rank)}
      </div>
      <div className="flex items-center gap-3">
        <Avatar initials={friend.avatar} glow={friend.glow} className="size-11" />
        <div>
          <div className="font-semibold text-black">{friend.name}</div>
          <div className="text-xs text-neutral-500">{friend.username}</div>
        </div>
      </div>
      <div className="font-semibold text-black">{friend.xp.toLocaleString()}</div>
      {!compact ? <div className="text-black">{friend.progress}%</div> : null}
      {!compact ? <div className="text-black">{formatMinutes(friend.todayMinutes)}</div> : null}
      {!compact ? <div className="text-black">{friend.streak} days</div> : null}
      <div className="flex items-center gap-1 justify-self-end font-semibold text-neutral-700">
        {movementIcon(friend.movement)}
        {friend.movement}
      </div>
    </div>
  );
}
