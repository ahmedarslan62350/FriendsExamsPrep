import { Flame } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function StreakCard({ streak }: { streak: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current Fire</p>
            <div className="mt-2 text-3xl font-bold text-white">{streak} days</div>
          </div>
          <div className="rounded-[8px] border border-black/15 bg-neutral-100 p-3 text-black">
            <Flame className="size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
