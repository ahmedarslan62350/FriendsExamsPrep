"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { completeSubjectProgress, getChaptersBySubject, getProgressForSubject, getSubjects, getLeaderboard, updateProgress } from "@/lib/api";
import { getSubjectMeta } from "@/lib/subject-meta";
import { type Chapter, type LeaderboardApiUser, type ProgressRecord, type Subject } from "@/lib/types";

function getChapterId(chapterId: ProgressRecord["chapterId"]) {
  return typeof chapterId === "string" ? chapterId : chapterId?._id;
}

export default function SubjectDetailPage() {
  const params = useParams<{ subject: string }>();
  const { token } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardApiUser[]>([]);
  const [error, setError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [completingChapterId, setCompletingChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    async function load() {
      try {
        const subjects = await getSubjects(authToken);
        const currentSubject = subjects.find((item) => getSubjectMeta(item.name).slug === params.subject) ?? null;
        setSubject(currentSubject);

        if (!currentSubject) {
          return;
        }

        const [chapterList, subjectProgress, leaderboardList] = await Promise.all([
          getChaptersBySubject(authToken, currentSubject._id),
          getProgressForSubject(authToken, currentSubject._id),
          getLeaderboard(authToken),
        ]);

        setChapters(chapterList);
        setProgress(subjectProgress);
        setLeaderboard(leaderboardList.slice(0, 5));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load subject details.");
      }
    }

    load();
  }, [params.subject, token]);

  const completion =
    chapters.length > 0
      ? Math.round(
          chapters.reduce((sum, chapter) => {
            const match = progress.find((item) => getChapterId(item.chapterId) === chapter._id);
            return sum + (match?.completionPercent ?? 0);
          }, 0) / chapters.length,
        )
      : 0;

  const completedChapters = progress.filter((item) => item.completionPercent >= 100).length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <Badge>Subject detail</Badge>
          <h1 className="mt-4 text-4xl font-bold text-white">{subject?.name ?? "Subject"}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            This page now uses `/subjects`, `/chapters/subject/:id`, and `/progress/subject/:id`.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Completion", `${completion}%`],
              ["Chapters done", `${completedChapters}/${chapters.length}`],
              ["Tracked rows", `${progress.length}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                <div className="text-sm text-slate-400">{label}</div>
                <div className="mt-2 text-2xl font-bold text-white">{value}</div>
              </div>
            ))}
          </div>
          {subject ? (
            <div className="mt-5">
              <Button
                disabled={!token || isCompleting}
                onClick={async () => {
                  if (!token || !subject) return;
                  setIsCompleting(true);
                  setError("");
                  try {
                    await completeSubjectProgress(token, subject._id);
                    const subjectProgress = await getProgressForSubject(token, subject._id);
                    setProgress(subjectProgress);
                  } catch (completeError) {
                    setError(completeError instanceof Error ? completeError.message : "Unable to complete subject.");
                  } finally {
                    setIsCompleting(false);
                  }
                }}
              >
                {isCompleting ? "Completing..." : "Mark Subject as Completed"}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {error ? <div className="text-sm text-neutral-600">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <Badge>Chapter tracker</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Chapter-by-chapter progress</h2>
            <div className="mt-6 space-y-4">
              {chapters.map((chapter) => {
                const match = progress.find((item) => getChapterId(item.chapterId) === chapter._id);
                const completionValue = match?.completionPercent ?? 0;
                return (
                  <div key={chapter._id} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-black">{chapter.title}</h3>
                        <div className="mt-1 text-sm text-neutral-600">
                          {(match?.studyMinutes ?? 0)} study minutes • {(match?.revisionCount ?? 0)} revisions
                        </div>
                      </div>
                      <div className="min-w-[160px]">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Completion</span>
                          <span className="font-semibold text-black">{completionValue}%</span>
                        </div>
                        <Progress value={completionValue} accentClassName="bg-black" />
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant={completionValue >= 100 ? "secondary" : "default"}
                            disabled={!token || completionValue >= 100 || completingChapterId === chapter._id}
                            onClick={async () => {
                              if (!token) return;
                              setError("");
                              setCompletingChapterId(chapter._id);
                              try {
                                const updated = await updateProgress(token, {
                                  chapterId: chapter._id,
                                  completionPercent: 100,
                                  studyMinutes: Math.max((match?.studyMinutes ?? 0), 90),
                                  revisionCount: Math.max((match?.revisionCount ?? 0), 2),
                                });
                                setProgress((prev) => {
                                  const found = prev.some((item) => getChapterId(item.chapterId) === chapter._id);
                                  if (found) {
                                    return prev.map((item) => (getChapterId(item.chapterId) === chapter._id ? updated : item));
                                  }
                                  return [...prev, updated];
                                });
                              } catch (completeError) {
                                setError(completeError instanceof Error ? completeError.message : "Unable to complete chapter.");
                              } finally {
                                setCompletingChapterId(null);
                              }
                            }}
                          >
                            {completionValue >= 100
                              ? "Completed"
                              : completingChapterId === chapter._id
                                ? "Completing..."
                                : "Mark Chapter Completed"}
                          </Button>
                        </div>
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
            <Badge>Squad snapshot</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Global leaderboard context</h2>
            <div className="mt-6 space-y-3">
              {leaderboard.map((item, index) => (
                <div key={item._id ?? `${item.name}-${index}`} className="rounded-[10px] border border-black/15 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-black">{item.name}</div>
                    <div className="text-sm text-neutral-600">#{index + 1}</div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">
                    Score {item.leaderboardScore ?? item.xp ?? 0} • Streak {item.streak ?? 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
