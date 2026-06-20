"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

/** Renders the actual Lucide icon for a given icon name string. Falls back to HelpCircle. */
export function ServiceIcon({ name }: { name: string }) {
  const Icon =
    (LucideIcons as Record<string, unknown>)[name] as React.FC<{ size?: number; className?: string }> ||
    LucideIcons.HelpCircle;
  return (
    <span className="flex items-center gap-2">
      <Icon size={16} className="text-[#444]" />
      <span className="text-xs text-[#888]">{name}</span>
    </span>
  );
}
