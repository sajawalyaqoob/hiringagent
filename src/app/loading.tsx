export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        {/* Amazon-style subtle orange spinner */}
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#d5d9d9] border-t-[#f08804]" />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-bold text-[#0f1111] tracking-tight">HireBoost AI</p>
          <p className="text-xs text-[#565959]">Loading candidate intelligence systems...</p>
        </div>
      </div>
    </div>
  );
}
