"use client";

import { useEffect, useState } from "react";

import { SubjectCard } from "@/components/subject-card";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getChaptersBySubject, getProgressMe, getSubjects } from "@/lib/api";
import { getSubjectMeta } from "@/lib/subject-meta";
import { type DashboardSubject, type ProgressRecord } from "@/lib/types";

function getChapterId(chapterId: ProgressRecord["chapterId"]) {
  return typeof chapterId === "string" ? chapterId : chapterId._id;
}

export default function SubjectsPage() {
  const { token } = useAuth();
  const [subjects, setSubjects] = useState<DashboardSubject[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    const authToken = token;

    async function load() {
      try {
        const [subjectList, progressList] = await Promise.all([getSubjects(authToken), getProgressMe(authToken)]);
        const chaptersBySubject = await Promise.all(
          subjectList.map(async (subject) => ({
            subject,
            chapters: await getChaptersBySubject(authToken, subject._id),
          })),
        );

        const mappedSubjects: DashboardSubject[] = chaptersBySubject.map(({ subject, chapters }) => {
          const chapterIds = new Set(chapters.map((chapter) => chapter._id));
          const relevantProgress = progressList.filter((item) => chapterIds.has(getChapterId(item.chapterId)));
          const meta = getSubjectMeta(subject.name);
          const completion =
            chapters.length > 0
              ? Math.round(
                  chapters.reduce((sum, chapter) => {
                    const match = relevantProgress.find((item) => getChapterId(item.chapterId) === chapter._id);
                    return sum + (match?.completionPercent ?? 0);
                  }, 0) / chapters.length,
                )
              : 0;

          return {
            id: subject._id,
            name: subject.name,
            slug: meta.slug,
            icon: meta.icon,
            completion,
            completedChapters: relevantProgress.filter((item) => item.completionPercent >= 100).length,
            totalChapters: chapters.length,
            remainingHours: Math.max(Math.ceil((chapters.length * 45) / 60), 0),
            rank: 0,
            aheadCount: 0,
          };
        });

        setSubjects(mappedSubjects);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load subjects.");
      }
    }

    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <Badge>All subjects</Badge>
          <h1 className="mt-3 text-4xl font-bold text-white">Every subject is now backed by live chapters</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            This page reads your real subject list and chapter counts from the backend instead of static mock cards.
          </p>
        </CardContent>
      </Card>
      {error ? <div className="text-sm text-neutral-600">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
