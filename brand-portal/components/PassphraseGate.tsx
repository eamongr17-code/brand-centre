"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

const INTERNAL_KEY = "atlas-internal-access";
const OWNER_KEY = "atlas-owner-access";
const INTERNAL_CODE = process.env.NEXT_PUBLIC_INTERNAL_CODE ?? "atlas-internal";
const OWNER_CODE = process.env.NEXT_PUBLIC_OWNER_CODE ?? "atlas-owner";

type GateMode = "internal" | "owner";

export default function PassphraseGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [mode, setMode] = useState<GateMode>("internal");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(INTERNAL_KEY) === "true") {
      setUnlocked(true);
    }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "internal") {
      if (input.trim() === INTERNAL_CODE) {
        localStorage.setItem(INTERNAL_KEY, "true");
        setUnlocked(true);
      } else {
        setError(true);
        setInput("");
        setTimeout(() => setError(false), 2000);
      }
    } else {
      if (input.trim() === OWNER_CODE) {
        localStorage.setItem(OWNER_KEY, "true");
        router.push("/owner");
      } else {
        setError(true);
        setInput("");
        setTimeout(() => setError(false), 2000);
      }
    }
  }

  function switchMode(next: GateMode) {
    setMode(next);
    setInput("");
    setError(false);
  }

  if (!mounted) return null;
  if (unlocked) return <>{children}</>;

  const isOwner = mode === "owner";

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/atlas-wordmark.svg" alt="Atlas" className="h-5 w-auto opacity-70" />
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg mb-6">
          <button
            type="button"
            onClick={() => switchMode("internal")}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${
              !isOwner
                ? "bg-[#2d2d2d] text-[#e8e8e8]"
                : "text-[#555] hover:text-[#888]"
            }`}
          >
            Internal
          </button>
          <button
            type="button"
            onClick={() => switchMode("owner")}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${
              isOwner
                ? "bg-amber-900/60 text-amber-400"
                : "text-[#555] hover:text-[#888]"
            }`}
          >
            Owner
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            isOwner
              ? "bg-amber-900/30 border-amber-800/50"
              : "bg-[#1e1e1e] border-[#333]"
          }`}>
            <Lock size={16} className={isOwner ? "text-amber-500" : "text-[#666]"} />
          </div>
          <div className="text-center">
            <h1 className="text-base font-semibold text-[#e8e8e8]">
              {isOwner ? "Owner Access" : "Internal Access"}
            </h1>
            <p className="text-xs text-[#555] mt-0.5">
              Enter your access code to continue.
            </p>
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
                : isOwner
                ? "border-amber-800/50 focus:border-amber-700/70"
                : "border-[#2d2d2d] focus:border-[#444]"
            }`}
          />
          {error && (
            <p className="text-xs text-red-400 text-center">Incorrect access code.</p>
          )}
          <button
            type="submit"
            className={`w-full text-sm font-medium px-4 py-3 rounded-lg border transition-colors ${
              isOwner
                ? "bg-amber-900/40 hover:bg-amber-900/60 border-amber-800/50 text-amber-300"
                : "bg-[#1e1e1e] hover:bg-[#252525] border-[#2d2d2d] text-[#e8e8e8]"
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
