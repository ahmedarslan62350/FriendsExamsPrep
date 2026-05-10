"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const steps = 24;
    const increment = value / steps;
    const interval = window.setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        window.clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [value]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
