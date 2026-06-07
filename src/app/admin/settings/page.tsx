"use client";

import React, { useState } from "react";
import { logoutAction } from "./actions";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Settings</h1>
        <p className="text-[#888] mt-2">Admin account and system configuration.</p>
      </div>

      {/* Credentials Info */}
      <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] space-y-4">
        <h2 className="text-lg font-medium text-white border-b border-[#222] pb-2">Admin Credentials</h2>
        <p className="text-sm text-[#888]">
          Your admin password is managed via the <code className="bg-[#222] px-2 py-0.5 rounded text-white text-xs">ADMIN_PASSWORD</code> environment variable in your <code className="bg-[#222] px-2 py-0.5 rounded text-white text-xs">.env</code> file. Restart the server after changing it.
        </p>
        <div className="flex items-center gap-3 p-4 bg-[#111] rounded-lg border border-[#333]">
          <code className="text-sm text-[#888] flex-1 font-mono">
            ADMIN_PASSWORD="{showPassword ? "your_password_here" : "••••••••••••"}"
          </code>
          <button onClick={() => setShowPassword(s => !s)} className="text-[#666] hover:text-white transition-colors">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Database Info */}
      <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] space-y-4">
        <h2 className="text-lg font-medium text-white border-b border-[#222] pb-2">Database</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#111] rounded-lg border border-[#333]">
            <div className="text-xs text-[#666] mb-1">Provider</div>
            <div className="text-white font-medium">SQLite</div>
          </div>
          <div className="p-4 bg-[#111] rounded-lg border border-[#333]">
            <div className="text-xs text-[#666] mb-1">Location</div>
            <div className="text-white font-medium font-mono text-sm">prisma/dev.db</div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 rounded-xl border border-red-900/30 bg-red-950/10 space-y-4">
        <h2 className="text-lg font-medium text-red-400 border-b border-red-900/30 pb-2">Session</h2>
        <p className="text-sm text-[#888]">End your current admin session. You will be redirected to the login page.</p>
        <form action={logoutAction}>
          <button type="submit"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
