import { ArrowUpRight } from "lucide-react";

import { AnimatedCounter } from "@/components/animated-counter";
import { Card, CardContent } from "@/components/ui/card";

export function ProgressCard({
  label,
  value,
  suffix = "",
  trend,
}: {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  accent: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative p-6">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-black" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
            <div className="mt-4 text-4xl font-bold text-white">
              <AnimatedCounter value={value} suffix={suffix} />
            </div>
          </div>
          <div className="rounded-[8px] border border-black/15 bg-neutral-100 px-3 py-1 text-xs text-black">
            <span className="inline-flex items-center gap-1">
              <ArrowUpRight className="size-3" />
              {trend}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
