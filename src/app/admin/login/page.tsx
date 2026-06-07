"use client";

import React, { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-white border border-[#d6d6d6] shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-black tracking-tight mb-2">CS Glaze OS</h1>
          <p className="text-sm text-[#888]">Enter your password to access the system.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
            {state?.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-[#222]"
            disabled={isPending}
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
