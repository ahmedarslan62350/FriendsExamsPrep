"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookMarked, Clock3, Trophy } from "lucide-react";

import { ActivityItem } from "@/components/activity-item";
import { LeaderboardRow } from "@/components/leaderboard-row";
import { ProgressCard } from "@/components/progress-card";
import { SubjectCard } from "@/components/subject-card";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { XPBadge } from "@/components/xp-badge";
import {
  getActiveStudySession,
  getActivity,
  getChaptersBySubject,
  getLeaderboard,
  getMyRank,
  getProgressMe,
  getSubjects,
} from "@/lib/api";
import { getSubjectMeta } from "@/lib/subject-meta";
import {
  type ActivityItemData,
  type DashboardSubject,
  type LeaderboardApiUser,
  type LeaderboardRowData,
  type ProgressRecord,
} from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

function getAvatar(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapLeaderboard(items: LeaderboardApiUser[]): LeaderboardRowData[] {
  return items.map((item, index) => ({
    id: item._id ?? item.id ?? `${item.name}-${index}`,
    name: item.name,
    username: item.email ? `@${item.email.split("@")[0]}` : undefined,
    avatar: getAvatar(item.name),
    xp: item.leaderboardScore ?? item.xp ?? 0,
    streak: item.streak ?? 0,
    progress: item.progressPercent ?? 0,
    todayMinutes: item.totalStudyMinutes ?? 0,
    rank: index + 1,
    movement: "same",
  }));
}

function mapActivity(messageItems: Awaited<ReturnType<typeof getActivity>>): ActivityItemData[] {
  return messageItems.map((item, index) => {
    const type = item.type.includes("chapter")
      ? "chapter"
      : item.type.includes("streak")
        ? "streak"
        : item.type.includes("rank")
          ? "rank"
          : item.type.includes("session")
            ? "session"
            : item.type.includes("milestone")
              ? "milestone"
              : "danger";

    return {
      id: item._id ?? item.id ?? index,
      friend: item.userId?.name ?? "Friend",
      avatar: getAvatar(item.userId?.name ?? "Friend"),
      action: item.message,
      time: item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now",
      type,
    };
  });
}

function getChapterId(chapterId: ProgressRecord["chapterId"]) {
  return typeof chapterId === "string" ? chapterId : chapterId._id;
}

function getSessionMinutes(session: Awaited<ReturnType<typeof getActiveStudySession>>) {
  if (!session) return 0;
  if (typeof session.durationMinutes === "number") return session.durationMinutes;
  if (!session.startTime) return 0;
  const startedAt = new Date(session.startTime).getTime();
  if (Number.isNaN(startedAt)) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / (1000 * 60)));
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [subjects, setSubjects] = useState<DashboardSubject[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRowData[]>([]);
  const [activity, setActivity] = useState<ActivityItemData[]>([]);
  const [rank, setRank] = useState(0);
  const [studyMinutesToday, setStudyMinutesToday] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const [subjectList, progressList, leaderboardList, activityList, rankResult, activeSession] = await Promise.all([
          getSubjects(authToken),
          getProgressMe(authToken),
          getLeaderboard(authToken),
          getActivity(authToken),
          getMyRank(authToken),
          getActiveStudySession(authToken),
        ]);

        const chaptersBySubject = await Promise.all(
          subjectList.map(async (subject) => ({
            subject,
            chapters: await getChaptersBySubject(authToken, subject._id),
          })),
        );

        const mappedSubjects: DashboardSubject[] = chaptersBySubject.map(({ subject, chapters }) => {
          const chapterIds = new Set(chapters.map((chapter) => chapter._id));
          const relevantProgress = progressList.filter((item) => chapterIds.has(getChapterId(item.chapterId)));
          const completion =
            chapters.length > 0
              ? Math.round(
                  chapters.reduce((sum, chapter) => {
                    const match = relevantProgress.find((item) => getChapterId(item.chapterId) === chapter._id);
                    return sum + (match?.completionPercent ?? 0);
                  }, 0) / chapters.length,
                )
              : 0;
          const completedChapters = relevantProgress.filter((item) => item.completionPercent >= 100).length;
          const totalStudyMinutes = relevantProgress.reduce((sum, item) => sum + (item.studyMinutes ?? 0), 0);
          const meta = getSubjectMeta(subject.name);

          return {
            id: subject._id,
            name: subject.name,
            slug: meta.slug,
            icon: meta.icon,
            completion,
            completedChapters,
            totalChapters: chapters.length,
            remainingHours: Math.max(Math.ceil((chapters.length * 45 - totalStudyMinutes) / 60), 0),
            rank: rankResult.rank,
            aheadCount: Math.max(rankResult.rank - 1, 0),
          };
        });

        const overallProgress =
          mappedSubjects.length > 0
            ? Math.round(mappedSubjects.reduce((sum, subject) => sum + subject.completion, 0) / mappedSubjects.length)
            : 0;

        const leaderboardRows = mapLeaderboard(leaderboardList);
        const currentLeaderEntry =
          leaderboardList.find((item) => item.email && item.email === user?.email) ??
          leaderboardList.find((item) => item.name === user?.name);

        if (!isMounted) {
          return;
        }

        setSubjects(mappedSubjects);
        setLeaderboard(leaderboardRows);
        setActivity(mapActivity(activityList).slice(0, 6));
        setRank(rankResult.rank);
        setProgressPercent(overallProgress);
        setStudyMinutesToday(getSessionMinutes(activeSession) || currentLeaderEntry?.totalStudyMinutes || 0);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();
    const interval = globalThis.setInterval(load, 20000);

    return () => {
      isMounted = false;
      globalThis.clearInterval(interval);
    };
  }, [token, user?.email, user?.name]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProgressCard label="Overall Completion" value={progressPercent} suffix="%" trend="Live from progress API" accent="" />
        <ProgressCard label="Current Rank" value={rank || 0} trend="Live global ranking" accent="" />
        <ProgressCard label="Current Streak" value={user?.streak ?? 0} suffix="d" trend="Pulled from your account" accent="" />
        <ProgressCard label="Study Time Today" value={Math.round(studyMinutesToday / 60)} suffix="h" trend="Based on active/session data" accent="" />
      </section>

      {error ? (
        <Card>
          <CardContent className="p-5 text-sm text-neutral-600">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge>Subject race</Badge>
                <h2 className="mt-3 text-3xl font-bold text-white">Your live syllabus battlefield</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Subject cards now combine `/subjects`, `/chapters/subject/:id`, and `/progress/me`.
                </p>
              </div>
              <XPBadge xp={user?.xp ?? 0} streak={user?.streak ?? 0} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
              {!isLoading && subjects.length === 0 ? (
                <div className="rounded-[10px] border border-black/15 bg-neutral-50 p-4 text-sm text-neutral-600">
                  No subjects were returned yet. If this is a fresh backend, seed subjects first.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <Badge>Top users</Badge>
              <h2 className="mt-3 text-2xl font-bold text-white">Leaderboard preview</h2>
              <div className="mt-5 space-y-3">
                {leaderboard.slice(0, 5).map((friend) => (
                  <LeaderboardRow key={friend.id} friend={friend} compact />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <Badge>Realtime feed</Badge>
                  <h2 className="mt-3 text-2xl font-bold text-white">Live activity</h2>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {activity.map((item) => (
                  <ActivityItem key={item.id} activity={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <Badge>Momentum pulse</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Live account snapshot</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Study time", value: formatMinutes(studyMinutesToday), icon: Clock3 },
                { label: "Subjects active", value: String(subjects.length), icon: BookMarked },
                { label: "XP banked", value: String(user?.xp ?? 0), icon: Trophy },
                { label: "Battle status", value: token ? "Connected" : "Offline", icon: ArrowRight },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-[8px] border border-black/15 bg-white p-3 text-black">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">{item.label}</div>
                        <div className="mt-1 text-xl font-bold text-white">{item.value}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <Badge>Competitive note</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Your real backend is now driving the app</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              The dashboard is no longer using local mock JSON. If a section looks empty, it means the API returned no
              rows for that user yet, not that the UI is faking data.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
