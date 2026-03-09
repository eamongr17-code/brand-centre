"use client";

import { useState, useEffect, FormEvent } from "react";
import { Lock } from "lucide-react";
import { publicPath } from "@/lib/public-path";

const OWNER_KEY = "atlas-owner-access";
const OWNER_CODE = process.env.NEXT_PUBLIC_OWNER_CODE ?? "atlas-owner";

export default function OwnerGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(OWNER_KEY) === "true") {
      setUnlocked(true);
    }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input.trim() === OWNER_CODE) {
      localStorage.setItem(OWNER_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 2000);
    }
  }

  if (!mounted) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <img src={publicPath("/atlas-wordmark.svg")} alt="Atlas" className="h-5 w-auto opacity-70" />
        </div>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#f77614]/15 border border-[#f77614]/35 flex items-center justify-center">
            <Lock size={16} className="text-[#f77614]" />
          </div>
          <div className="text-center">
            <h1 className="text-base font-semibold text-[#e8e8e8]">Owner Access</h1>
            <p className="text-xs text-[#555] mt-0.5">Enter your access code to continue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Access code"
            autoFocus
            className={`w-full bg-[#1e1e1e] border rounded-lg px-4 py-3 text-sm text-[#e8e8e8] placeholder-[#444] focus:outline-none transition-colors ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-[#f77614]/35 focus:border-[#f77614]/55"
            }`}
          />
          {error && (
            <p className="text-xs text-red-400 text-center">Incorrect access code.</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#f77614]/20 hover:bg-[#f77614]/30 border border-[#f77614]/35 text-[#f8a260] text-sm font-medium px-4 py-3 rounded-lg transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
