"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, LayoutDashboard, Radar, Target, UserCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Ranks", icon: Crown },
  { href: "/daily-targets", label: "Targets", icon: Target },
  { href: "/activity", label: "Feed", icon: Radar },
  { href: "/profile", label: "You", icon: UserCircle2 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="glass-panel fixed inset-x-3 bottom-3 z-40 rounded-[12px] p-2 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-[8px] px-1 py-2 text-[11px] transition-colors",
                active ? "bg-black text-white" : "text-neutral-500",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
