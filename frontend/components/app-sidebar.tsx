"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookMarked,
  Crown,
  LayoutDashboard,
  Radar,
  ScrollText,
  Target,
  UserCircle2,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookMarked },
  { href: "/leaderboard", label: "Leaderboard", icon: Crown },
  { href: "/daily-targets", label: "Daily Targets", icon: Target },
  { href: "/activity", label: "Activity Feed", icon: Radar },
  { href: "/rewards", label: "Rewards", icon: Award },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ME";

  return (
    <aside className="glass-panel hidden w-[260px] shrink-0 rounded-[12px] p-4 lg:flex lg:flex-col lg:self-start">
      <div className="flex items-center gap-3">
        <div className="rounded-[8px] border border-black bg-black p-2.5 text-white">
          <ScrollText className="size-5" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Boards Battle</div>
          <div className="text-base font-bold text-black">Friends Exam Prep</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm transition-colors duration-200",
                active ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-black",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[10px] border border-black/15 bg-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <Avatar initials={initials} className="size-14" />
          <div>
            <div className="font-semibold text-black">{user?.name ?? "Guest"}</div>
            <div className="text-xs text-neutral-500">{user?.email ?? "Sign in from the landing page"}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Badge>{user?.xp ?? 0} XP</Badge>
          <Badge className="border-black/15 bg-white text-neutral-700">{user?.streak ?? 0} day streak</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[8px] border border-black/15 bg-white p-3">
            <div className="text-neutral-500">Total XP</div>
            <div className="mt-1 font-semibold text-black">{(user?.xp ?? 0).toLocaleString()}</div>
          </div>
          <div className="rounded-[8px] border border-black/15 bg-white p-3">
            <div className="text-neutral-500">Streak</div>
            <div className="mt-1 font-semibold text-black">{user?.streak ?? 0}d</div>
          </div>
        </div>
        {user ? (
          <Button variant="secondary" className="mt-4 w-full" onClick={logout}>
            Log out
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
