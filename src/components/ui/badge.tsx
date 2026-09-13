import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "navy" | "outline" | "score" | "info";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-sm select-none";

  const variants = {
    default: "bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]",
    navy: "bg-[#131921] text-white border border-[#131921]",
    success: "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]",
    warning: "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]",
    danger: "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]",
    info: "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]",
    outline: "bg-white text-[#0f1111] border border-[#d5d9d9]",
    score: "bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa] font-bold",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  return <div className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />;
}
