"use client";

import { useEffect, useMemo, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboard, getMyRank, getProgressMe, getSubjects } from "@/lib/api";
import { getSubjectMeta } from "@/lib/subject-meta";
import { type ProgressRecord } from "@/lib/types";

function getChapterId(chapterId: ProgressRecord["chapterId"]) {
  return typeof chapterId === "string" ? chapterId : chapterId._id;
}

export default function ProfilePage() {
  const { token, user } = useAuth();
  const [rank, setRank] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [subjectPerformance, setSubjectPerformance] = useState<Array<{ name: string; slug: string; completion: number }>>([]);
  const [error, setError] = useState("");
  const initials = useMemo(
    () =>
      user?.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "ME",
    [user?.name],
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    async function load() {
      try {
        const [rankResult, progressList, subjectList] = await Promise.all([getMyRank(authToken), getProgressMe(authToken), getSubjects(authToken)]);
        const leaderboard = await getLeaderboard(authToken);
        const subjects = await Promise.all(
          subjectList.map(async (subject) => {
            const chapters = progressList.filter((item) => {
              const chapter = typeof item.chapterId === "string" ? null : item.chapterId;
              return chapter?.title || getChapterId(item.chapterId);
            });
            const completion = chapters.length
              ? Math.round(chapters.reduce((sum, item) => sum + item.completionPercent, 0) / chapters.length)
              : 0;
            return { name: subject.name, slug: getSubjectMeta(subject.name).slug, completion };
          }),
        );

        const currentUserLeader =
          leaderboard.find((item) => item.email && item.email === user?.email) ??
          leaderboard.find((item) => item.name === user?.name);

        setRank(rankResult.rank);
        setOverallProgress(currentUserLeader?.progressPercent ?? 0);
        setSubjectPerformance(subjects);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
      }
    }

    load();
  }, [token, user?.email, user?.name]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <Avatar initials={initials} className="size-24 text-2xl" />
              <div>
                <Badge>Profile mode</Badge>
                <h1 className="mt-4 text-4xl font-bold text-white">{user?.name ?? "User"}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{user?.email}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="rounded-[8px] border border-black/15 bg-neutral-50 px-4 py-2 text-sm text-neutral-700">
                    XP {user?.xp ?? 0}
                  </div>
                  <div className="rounded-[8px] border border-black/15 bg-neutral-50 px-4 py-2 text-sm text-neutral-700">
                    {user?.streak ?? 0} day streak
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Rank", `#${rank || "-"}`],
                ["XP", (user?.xp ?? 0).toLocaleString()],
                ["Syllabus", `${overallProgress}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                  <div className="text-sm text-slate-400">{label}</div>
                  <div className="mt-2 text-2xl font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? <div className="text-sm text-neutral-600">{error}</div> : null}

      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <Badge>Subject performance</Badge>
          <h2 className="mt-3 text-2xl font-bold text-white">Live progress by subject</h2>
          <div className="mt-6 space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.slug} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-black">{subject.name}</div>
                  <div className="text-sm text-neutral-600">{subject.completion}%</div>
                </div>
                <div className="mt-3 h-3 rounded-full bg-neutral-200">
                  <div className="h-full rounded-full bg-black" style={{ width: `${subject.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
