import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  accentClassName,
}: {
  value: number;
  className?: string;
  accentClassName?: string;
}) {
  return (
    <div className={cn("h-3 overflow-hidden rounded-full border border-[rgba(15,23,42,0.08)] bg-white/70", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#4f46e5_55%,#0ea5e9_100%)] transition-all duration-700",
          accentClassName,
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
