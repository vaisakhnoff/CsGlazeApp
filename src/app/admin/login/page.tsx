"use client";

import React, { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full" style={{ maxWidth: "420px", minWidth: "320px" }}>
        <div className="p-10 rounded-2xl bg-white border border-[#d6d6d6] shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-black tracking-tight mb-2">CS Glaze OS</h1>
            <p className="text-sm text-[#888]">Enter your password to access the system.</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Admin Password"
                style={{ display: "block", width: "100%", boxSizing: "border-box" }}
                className="bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-base"
                required
              />
              {state?.error && (
                <p className="text-red-500 text-sm mt-2">{state.error}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              style={{ display: "block", width: "100%", boxSizing: "border-box" }}
              className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-sm hover:bg-[#222] transition-colors disabled:opacity-50"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
