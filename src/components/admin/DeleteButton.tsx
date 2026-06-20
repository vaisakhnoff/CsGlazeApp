"use client";

import React, { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface Props {
  action: () => Promise<void>;
  confirmMessage?: string;
  className?: string;
}

/**
 * A drop-in delete button that asks for confirmation before invoking the
 * server action. Replaces the old `<form action={...}>` pattern.
 */
export function DeleteButton({
  action,
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
  className = "text-[#888] hover:text-red-500 transition-colors",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);

  const handleClick = () => {
    if (confirmed) return; // debounce double-click
    const ok = window.confirm(confirmMessage);
    if (!ok) return;
    setConfirmed(true);
    startTransition(async () => {
      await action();
      setConfirmed(false);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className}
      aria-label="Delete"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
