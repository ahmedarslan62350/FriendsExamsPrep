import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { formatPercentage } from "@/lib/utils";
import { type DashboardSubject } from "@/lib/types";

export function SubjectCard({ subject }: { subject: DashboardSubject }) {
  const Icon = subject.icon;

  return (
    <Link href={`/subjects/${subject.slug}`}>
      <Card className="group h-full overflow-hidden transition-colors duration-200 hover:bg-neutral-50">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex rounded-[8px] border border-black/15 bg-neutral-100 p-3 text-black">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-3 text-lg font-bold text-black">{subject.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">
                {subject.completedChapters}/{subject.totalChapters} chapters complete
              </p>
            </div>
            <div className="rounded-[8px] border border-black/15 bg-white px-3 py-1 text-sm font-semibold text-black">
              {formatPercentage(subject.completion)}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <Progress value={subject.completion} accentClassName="bg-black" />
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Rank</div>
                <div className="mt-1 font-semibold text-black">#{subject.rank}</div>
              </div>
              <div>
                <div className="text-neutral-500">Remaining</div>
                <div className="mt-1 font-semibold text-black">{subject.remainingHours}h</div>
              </div>
              <div>
                <div className="text-neutral-500">Ahead</div>
                <div className="mt-1 font-semibold text-black">{subject.aheadCount}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black">
            Open subject battle
            <ChevronRight className="size-4 transition group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
