"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { publicPath } from "@/lib/public-path";

export default function LoginPage() {
  const { signIn, isOwner, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
  if (!loading && isAuthenticated) {
    router.replace(isOwner ? "/owner" : "/internal");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError("Invalid email or password.");
      setSubmitting(false);
    } else {
      // onAuthStateChange will update isOwner; redirect based on role
      // Small delay to let auth state settle
      setTimeout(() => {
        router.replace(isOwner ? "/owner" : "/internal");
      }, 100);
    }
  }

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
            <h1 className="text-base font-semibold text-[#e8e8e8]">Sign in</h1>
            <p className="text-xs text-[#555] mt-0.5">Enter your credentials to continue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            required
            className="w-full bg-[#1e1e1e] border border-[#2d2d2d] focus:border-[#444] rounded-lg px-4 py-3 text-sm text-[#e8e8e8] placeholder-[#444] focus:outline-none transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={`w-full bg-[#1e1e1e] border rounded-lg px-4 py-3 text-sm text-[#e8e8e8] placeholder-[#444] focus:outline-none transition-colors ${
              error ? "border-red-500" : "border-[#2d2d2d] focus:border-[#444]"
            }`}
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#f77614]/20 hover:bg-[#f77614]/30 disabled:opacity-50 border border-[#f77614]/35 text-[#f8a260] text-sm font-medium px-4 py-3 rounded-lg transition-colors"
          >
            {submitting ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
