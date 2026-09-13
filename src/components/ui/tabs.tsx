"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: {
  defaultValue: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = React.useState(defaultValue);
  const currentTab = value !== undefined ? value : active;

  const handleTabChange = (val: string) => {
    if (value === undefined) setActive(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-start border-b border-[#d5d9d9] w-full gap-1 overflow-x-auto",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  count,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  count?: number;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");
  const isSelected = ctx.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer select-none whitespace-nowrap",
        isSelected
          ? "border-[#f08804] text-[#0f1111] font-semibold"
          : "border-transparent text-[#565959] hover:text-[#0f1111] hover:border-gray-300",
        className
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "text-xs px-1.5 py-0.2 rounded-full",
            isSelected ? "bg-[#fff7ed] text-[#c2410c] font-bold" : "bg-gray-100 text-gray-600"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");
  if (ctx.activeTab !== value) return null;

  return <div className={cn("pt-4 focus-visible:outline-none", className)}>{children}</div>;
}
