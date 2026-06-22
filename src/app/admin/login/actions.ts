"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter
// Works for a single-process deployment (standard for Next.js self-hosted).
// ---------------------------------------------------------------------------

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const attemptsByIp = new Map<string, AttemptRecord>();

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

async function getClientIp(): Promise<string> {
  // headers() is async in Next.js 16+
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = attemptsByIp.get(ip);

  if (!record) return { allowed: true };

  // Locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  // Window expired — reset
  if (now - record.firstAttempt > WINDOW_MS) {
    attemptsByIp.delete(ip);
    return { allowed: true };
  }

  // Too many attempts — lock
  if (record.count >= MAX_ATTEMPTS) {
    const lockedUntil = now + WINDOW_MS;
    record.lockedUntil = lockedUntil;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = attemptsByIp.get(ip);
  if (!record) {
    attemptsByIp.set(ip, { count: 1, firstAttempt: now, lockedUntil: null });
  } else {
    record.count += 1;
  }
}

function clearAttempts(ip: string) {
  attemptsByIp.delete(ip);
}

// ---------------------------------------------------------------------------

export async function loginAction(_prevState: { error?: string } | null, formData: FormData) {
  const ip = await getClientIp();

  // Check rate limit before touching credentials
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    const mins = Math.ceil((rateLimit.retryAfterSeconds ?? 900) / 60);
    return {
      error: `Too many failed attempts. Please wait ${mins} minute${mins !== 1 ? "s" : ""} before trying again.`,
    };
  }

  const password = formData.get("password") as string;
  const nextPath = getSafeRedirectPath(formData.get("next"));
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Server configuration error: ADMIN_PASSWORD is not set." };
  }

  if (password === adminPassword) {
    clearAttempts(ip);
    await createSession();
    redirect(nextPath);
  }

  // Wrong password — record the failure
  recordFailedAttempt(ip);

  const record = attemptsByIp.get(ip);
  const remaining = record ? Math.max(0, MAX_ATTEMPTS - record.count) : MAX_ATTEMPTS - 1;

  return {
    error:
      remaining > 0
        ? `Invalid password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
        : "Invalid password. Too many attempts — you are now locked out for 15 minutes.",
  };
}
