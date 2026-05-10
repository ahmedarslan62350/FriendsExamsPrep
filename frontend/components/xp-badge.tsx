import { Flame, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function XPBadge({
  xp,
  streak,
  className,
}: {
  xp: number;
  streak?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/8 px-3 py-2 text-xs text-cyan-100", className)}>
      <Sparkles className="size-3.5" />
      <span className="font-semibold">{xp.toLocaleString()} XP</span>
      {typeof streak === "number" ? (
        <>
          <span className="text-cyan-300/40">|</span>
          <Flame className="size-3.5 text-amber-300" />
          <span>{streak} day streak</span>
        </>
      ) : null}
    </div>
  );
}
