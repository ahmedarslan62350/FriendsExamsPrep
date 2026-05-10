"use client";

import { useEffect, useMemo, useState } from "react";

import { boardExamDate } from "@/lib/mock-data";

function getTimeLeft() {
  const now = new Date().getTime();
  const target = new Date(boardExamDate).getTime();
  const diff = Math.max(target - now, 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function CountdownCard({ compact = false }: { compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const items = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Mins", value: timeLeft.minutes },
    ],
    [timeLeft],
  );

  return (
    <div className={compact ? "countdown-pill rounded-[8px] px-3 py-2" : "glass-panel rounded-[12px] p-4 sm:p-5"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!compact ? (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Boards Countdown</p>
            <h3 className="mt-2 text-xl font-bold text-white">Boards are getting closer</h3>
          </div>
        ) : null}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {items.map((item) => (
            <div
              key={item.label}
              className={`rounded-[8px] border border-white/10 bg-white/8 px-3 py-2 text-center ${compact ? "min-w-14" : "min-w-18 sm:min-w-20"}`}
            >
              <div className={`${compact ? "text-base" : "text-2xl"} font-bold text-white`}>{item.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
