"use client";

import React, { useActionState, useRef, useEffect } from "react";
import { logoutAction, changePasswordAction, type PasswordChangeState } from "./actions";
import { Key, LogOut, CheckCircle2, AlertCircle, Lock } from "lucide-react";

const INIT: PasswordChangeState = { status: "idle" };

export default function SettingsPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, INIT);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-black tracking-tight">Settings</h1>
        <p className="text-[#888] mt-1 text-sm">Admin account and system configuration.</p>
      </div>

      {/* Change Password */}
      <div className="p-5 sm:p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#d6d6d6] pb-3">
          <Key size={18} className="text-[#666]" />
          <h2 className="text-lg font-medium text-black">Change Password</h2>
        </div>
        <p className="text-sm text-[#888]">
          Update your admin login password. The change takes effect immediately.
        </p>

        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              required
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:border-black focus:outline-none transition-all text-sm"
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:border-black focus:outline-none transition-all text-sm"
              placeholder="At least 6 characters"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:border-black focus:outline-none transition-all text-sm"
              placeholder="Re-enter new password"
            />
          </div>

          {state.status === "success" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              <CheckCircle2 size={15} className="flex-shrink-0" />
              {state.message}
            </div>
          )}
          {state.status === "error" && state.message && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" />
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-[#222] transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <Lock size={14} />
            {isPending ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Session Info */}
      <div className="p-5 sm:p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#d6d6d6] pb-3">
          <Lock size={18} className="text-[#666]" />
          <h2 className="text-lg font-medium text-black">Session</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#f6f6f6] rounded-lg border border-[#c7c7c7]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-[#666]">Active session — expires after 2 hours of inactivity or when browser closes</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-5 sm:p-6 rounded-xl border border-red-200 bg-red-50/50 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-red-200 pb-3">
          <LogOut size={18} className="text-red-500" />
          <h2 className="text-lg font-medium text-red-600">Sign Out</h2>
        </div>
        <p className="text-sm text-[#888]">End your current admin session. You will be redirected to the login page.</p>
        <form action={logoutAction}>
          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
            <LogOut size={14} />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
