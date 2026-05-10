import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[999px] border border-blue-200/60 bg-blue-50/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700",
        className,
      )}
      {...props}
    />
  );
}
