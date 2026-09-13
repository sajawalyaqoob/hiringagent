import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "navy" | "outline" | "score" | "info";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full select-none transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200/80",
    navy: "bg-slate-900 text-white border border-slate-900",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    outline: "bg-white text-slate-700 border border-slate-200",
    score: "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  return <div className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />;
}
