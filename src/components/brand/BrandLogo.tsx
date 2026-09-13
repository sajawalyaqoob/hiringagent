"use client";

import * as React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark" | "white";
  href?: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
}

export function BrandLogo({
  size = "md",
  theme = "light",
  href = "/",
  showBadge = true,
  badgeText = "AI",
  className = "",
}: BrandLogoProps) {
  // Dimensions
  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const badgeSize =
    size === "sm" ? "text-[9px] px-1.5 py-0.2" : size === "lg" ? "text-xs px-2.5 py-0.5" : "text-[10px] px-2 py-0.5";

  // Text color based on theme
  const primaryTextColor =
    theme === "dark" || theme === "white" ? "text-white" : "text-slate-900";
  const gradientTextColor =
    theme === "dark" || theme === "white"
      ? "bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400"
      : "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600";

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Precision Geometric SVG Emblem */}
      <div
        className="relative flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/25"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="tf-grad-1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="tf-grad-2" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="tf-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Rounded Hex/Diamond Shield */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="url(#tf-grad-1)"
            className="transition-opacity duration-300"
          />

          {/* Inner Depth Layer */}
          <rect
            x="5.5"
            y="5.5"
            width="37"
            height="37"
            rx="10"
            fill="#0f172a"
            fillOpacity="0.18"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
          />

          {/* Upward Dynamic Ascent / Precision Arrow & Star */}
          <path
            d="M24 10L35 21H28V36H20V21H13L24 10Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* Modern Accent Cutout Dot */}
          <circle cx="24" cy="28" r="2.5" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center tracking-tight font-extrabold">
        <span className={`${textSize} ${primaryTextColor} tracking-tight`}>
          Talent
        </span>
        <span
          className={`${textSize} font-black tracking-tight ${gradientTextColor} bg-clip-text text-transparent ml-0.5`}
        >
          Forge
        </span>

        {showBadge && (
          <span
            className={`ml-2 rounded-full font-black tracking-wider uppercase border ${badgeSize} ${
              theme === "dark" || theme === "white"
                ? "bg-indigo-500/20 text-cyan-300 border-cyan-500/30"
                : "bg-indigo-50 text-indigo-600 border-indigo-200/80"
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
