import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "navy";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer select-none text-sm";

    const variants = {
      primary:
        "bg-[#f08804] hover:bg-[#d97706] active:bg-[#b45309] text-[#0f1111] font-semibold shadow-xs focus-visible:ring-[#f08804]",
      navy: "bg-[#131921] hover:bg-[#1f2937] active:bg-[#0f172a] text-white shadow-xs focus-visible:ring-[#131921]",
      secondary:
        "bg-[#f3f4f6] hover:bg-[#e5e7eb] active:bg-[#d1d5db] text-[#0f1111] border border-[#d5d9d9] focus-visible:ring-gray-400",
      outline:
        "bg-white hover:bg-[#f9fafb] text-[#0f1111] border border-[#d5d9d9] hover:border-[#9ca3af] focus-visible:ring-gray-400",
      ghost: "bg-transparent hover:bg-[#f3f4f6] text-[#0f1111] focus-visible:ring-gray-400",
      danger:
        "bg-[#c41c1c] hover:bg-[#991b1b] active:bg-[#7f1d1d] text-white shadow-xs focus-visible:ring-red-600",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
