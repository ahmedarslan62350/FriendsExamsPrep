import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "border border-transparent bg-[linear-gradient(120deg,#2563eb_0%,#4f46e5_100%)] px-4 py-2.5 text-white shadow-[0_10px_20px_rgba(37,99,235,0.25)] hover:brightness-110",
  secondary:
    "border border-[rgba(15,23,42,0.12)] bg-white/85 px-4 py-2.5 text-slate-900 hover:bg-white",
  ghost: "px-3 py-2 text-slate-800 hover:bg-[rgba(37,99,235,0.1)]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "",
  sm: "px-3 py-2 text-xs",
  lg: "px-5 py-3 text-sm",
  icon: "size-10 rounded-[10px]",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-[10px] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
