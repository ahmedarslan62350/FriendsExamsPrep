import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-white/90 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20",
        className,
      )}
      {...props}
    />
  );
}
