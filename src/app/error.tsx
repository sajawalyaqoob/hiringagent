"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log sanitized error internally without leaking sensitive stack traces to UI
    console.error("[HireBoost Error Boundary]:", error.message);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xs border border-[#d5d9d9] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-[#fef2f2] text-[#c41c1c] border border-[#fecaca]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0f1111]">An unexpected system state occurred</h2>
            <p className="text-xs text-[#565959]">Reference Code: {error.digest || "HB-ERR-CLIENT"}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#374151] leading-relaxed">
          HireBoost encountered an issue rendering this section. Our centralized error logging has recorded this event. Your profile data and active applications remain secure.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto font-bold flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
