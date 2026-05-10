"use client";

import { useEffect, useState } from "react";

import { ActivityItem } from "@/components/activity-item";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getActivity } from "@/lib/api";
import { type ActivityItemData } from "@/lib/types";

function getAvatar(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ActivityFeedPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ActivityItemData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;
    let mounted = true;

    const load = () =>
      getActivity(authToken)
        .then((entries) => {
          if (!mounted) return;
          setItems(
            entries.map((item, index) => ({
              id: item._id ?? item.id ?? index,
              friend: item.userId?.name ?? "Friend",
              avatar: getAvatar(item.userId?.name ?? "Friend"),
              action: item.message,
              time: item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now",
              type: item.type.includes("chapter")
                ? "chapter"
                : item.type.includes("streak")
                  ? "streak"
                  : item.type.includes("rank")
                    ? "rank"
                    : item.type.includes("session")
                      ? "session"
                      : item.type.includes("milestone")
                        ? "milestone"
                        : "danger",
            })),
          );
          setError("");
        })
        .catch((loadError) => {
          if (!mounted) return;
          setError(loadError instanceof Error ? loadError.message : "Unable to load activity.");
        });

    void load();
    const interval = globalThis.setInterval(load, 15000);
    return () => {
      mounted = false;
      globalThis.clearInterval(interval);
    };
  }, [token]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div>
              <Badge>Social timeline</Badge>
              <h1 className="mt-4 text-4xl font-bold text-white">Live activity feed</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                This timeline now comes from `/activity` on your backend instead of a local hardcoded feed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? <div className="text-sm text-neutral-600">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <Badge>Filters</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Feed status</h2>
            <div className="mt-5 rounded-[10px] border border-black/15 bg-neutral-50 p-4 text-sm text-neutral-600">
              Filter controls are still UI-only, but the actual feed rows are now live.
            </div>
            <div className="mt-6">
              <EmptyState
                title="No custom feed filters yet"
                description="The feed is real now. If you want, we can make the filters functional against type and user."
                href="/dashboard"
                cta="Back to Dashboard"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <Badge>Live posts</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Everything happening right now</h2>
            <div className="mt-6 space-y-4">
              {items.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              {items.length === 0 && !error ? (
                <div className="rounded-[10px] border border-black/15 bg-neutral-50 p-4 text-sm text-neutral-600">
                  No activity has been recorded yet.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
