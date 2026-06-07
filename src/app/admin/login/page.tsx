"use client";

import React, { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-[#0a0a0a] border border-[#222] shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">CS Glaze OS</h1>
          <p className="text-sm text-[#888]">Enter your password to access the system.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#666] focus:ring-1 focus:ring-[#666] transition-all"
              required
            />
            {state?.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200"
            disabled={isPending}
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
