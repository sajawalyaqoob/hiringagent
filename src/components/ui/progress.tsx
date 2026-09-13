import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  indicatorColor?: string;
}

export function Progress({ className, value, indicatorColor, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value || 0));

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-xs bg-[#e5e7eb]", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300", indicatorColor || "bg-[#f08804]")}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
