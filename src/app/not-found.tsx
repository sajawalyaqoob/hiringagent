import Link from "next/link";
import { Search, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="w-full max-w-lg rounded-xs border border-[#d5d9d9] bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
          <Search className="h-6 w-6" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-[#0f1111] tracking-tight">404 — Page Not Found</h2>
        <p className="mt-2 text-xs text-[#565959] leading-relaxed max-w-sm mx-auto">
          The requested route does not exist or may have moved. Verify the URL or return to the main dashboard workspace.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full font-bold flex items-center justify-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
