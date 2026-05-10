import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  className,
  glow,
}: {
  initials: string;
  className?: string;
  glow?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[8px] border border-black/15 bg-white font-mono text-sm font-bold text-black",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-full items-center justify-center rounded-[inherit] bg-neutral-100",
          glow && `bg-gradient-to-br ${glow}`,
        )}
      >
        {initials}
      </div>
    </div>
  );
}
