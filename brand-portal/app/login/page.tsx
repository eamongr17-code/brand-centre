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

  if (!loading && isAuthenticated) {
    router.replace(isOwner ? "/owner" : "/internal");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error, session } = await signIn(email, password);
    if (error) {
      setError("Invalid email or password.");
      setSubmitting(false);
    } else {
      const role = session?.user?.user_metadata?.role;
      router.replace(role === "owner" ? "/owner" : "/internal");
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4 relative">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(247,118,20,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 [animation:fade-up_0.4s_ease-out_forwards]">
        <div className="flex justify-center mb-10">
          <img src={publicPath("/atlas-wordmark.svg")} alt="Atlas" className="h-5 w-auto opacity-70" />
        </div>

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-[#f77614]/10 border border-[#f77614]/25 flex items-center justify-center">
            <Lock size={16} className="text-[#f77614]" />
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold text-[#ececec]">Sign in</h1>
            <p className="text-xs text-[#484848] mt-1">Enter your credentials to continue.</p>
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
            className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/[0.12] rounded-xl px-4 py-3 text-sm text-[#ececec] placeholder-[#383838] focus:outline-none transition-colors duration-200"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-[#ececec] placeholder-[#383838] focus:outline-none transition-colors duration-200 ${
              error ? "border-red-500/60" : "border-white/[0.06] focus:border-white/[0.12]"
            }`}
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#f77614]/15 hover:bg-[#f77614]/25 disabled:opacity-50 border border-[#f77614]/25 text-[#f8a260] text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(247,118,20,0.15)]"
          >
            {submitting ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
