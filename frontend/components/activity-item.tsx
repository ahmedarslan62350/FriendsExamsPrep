import { Bolt, Flame, Siren, Trophy } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type ActivityItemData } from "@/lib/types";

const typeStyles: Record<ActivityItemData["type"], string> = {
  chapter: "text-cyan-200 bg-cyan-300/10 border-cyan-300/20",
  milestone: "text-violet-200 bg-violet-300/10 border-violet-300/20",
  session: "text-emerald-200 bg-emerald-300/10 border-emerald-300/20",
  rank: "text-amber-200 bg-amber-300/10 border-amber-300/20",
  streak: "text-rose-200 bg-rose-300/10 border-rose-300/20",
  danger: "text-rose-200 bg-rose-400/10 border-rose-400/20",
};

const icons: Record<ActivityItemData["type"], typeof Bolt> = {
  chapter: Bolt,
  milestone: Trophy,
  session: Bolt,
  rank: Trophy,
  streak: Flame,
  danger: Siren,
};

export function ActivityItem({ activity }: { activity: ActivityItemData }) {
  const Icon = icons[activity.type];

  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-white/8 bg-white/[0.03] p-4">
      <Avatar initials={activity.avatar} className="size-11" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">{activity.friend}</span>
          <span className="text-slate-300">{activity.action}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <div className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1", typeStyles[activity.type])}>
            <Icon className="size-3.5" />
            {activity.type}
          </div>
          <span>{activity.time}</span>
        </div>
      </div>
    </div>
  );
}
