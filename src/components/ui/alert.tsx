import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const icons = {
    info: <Info className="h-4 w-4 text-[#1e40af] shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="h-4 w-4 text-[#065f46] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-4 w-4 text-[#92400e] shrink-0 mt-0.5" />,
    danger: <AlertCircle className="h-4 w-4 text-[#991b1b] shrink-0 mt-0.5" />,
  };

  const variants = {
    info: "bg-[#eff6ff] border-[#bfdbfe] text-[#1e3a8a]",
    success: "bg-[#ecfdf5] border-[#a7f3d0] text-[#064e3b]",
    warning: "bg-[#fffbeb] border-[#fde68a] text-[#78350f]",
    danger: "bg-[#fef2f2] border-[#fecaca] text-[#7f1d1d]",
  };

  return (
    <div
      role="alert"
      className={cn("flex gap-3 p-3 rounded-md border text-xs leading-relaxed", variants[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5 text-xs">{title}</h5>}
        <div>{children}</div>
      </div>
    </div>
  );
}
