"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { dailyTasks } from "@/lib/mock-data";

type DailyTask = (typeof dailyTasks)[number];

export function DailyTaskCard({ task, index = 0 }: { task: DailyTask; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={cn(
        "rounded-[10px] border p-4 sm:p-5",
        task.completed
          ? "border-emerald-300/20 bg-emerald-300/8 shadow-[0_12px_30px_rgba(32,200,140,0.12)]"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex size-6 items-center justify-center rounded-full border",
              task.completed ? "border-emerald-300/35 bg-emerald-300/15 text-emerald-200" : "border-white/12 bg-white/6",
            )}
          >
            {task.completed ? <CheckCircle2 className="size-4" /> : null}
          </div>
          <div>
            <div className="font-semibold text-white">{task.title}</div>
            <div className="mt-2 inline-flex rounded-[6px] border border-white/10 bg-white/6 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
              {task.tag}
            </div>
          </div>
        </div>
        <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          +{task.xp} XP
        </div>
      </div>
      <div className="mt-4 flex items-center gap-5 text-sm text-slate-400">
        <div className="inline-flex items-center gap-2">
          <Clock3 className="size-4" />
          {task.eta}
        </div>
        <div className="inline-flex items-center gap-2">
          <Sparkles className="size-4" />
          {task.completed ? "Mission cleared" : "Ready to claim"}
        </div>
      </div>
    </motion.div>
  );
}
