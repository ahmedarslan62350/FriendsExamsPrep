import Link from "next/link";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="rounded-[10px] border border-white/12 bg-white/6 p-4">
          <Inbox className="size-8 text-cyan-200" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-white">{title}</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">{description}</p>
        <Link href={href} className="mt-6">
          <Button>{cta}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
