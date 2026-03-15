"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Pencil, Check, Link2, LogOut, User, Shield, Users, ChevronDown } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { useAuth } from "@/lib/auth-context";
import SearchBar from "@/components/SearchBar";
import { publicPath } from "@/lib/public-path";
import { parseBrandSlug } from "@/lib/parse-brand-slug";

export default function Navbar() {
  const { editMode, toggleEditMode } = useEditStore();
  const { canEdit, mode, portalPath } = usePortal();
  const { signOut, user, isOwner } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const homeHref = portalPath("/");
  const isPublic = mode === "public";

  const currentBrandSlug = useMemo(() => parseBrandSlug(pathname), [pathname]);

  const isHomePage = !isPublic && !currentBrandSlug;
  const showCopyLink = mode === "internal" && !!currentBrandSlug;

  const copyPublicLink = useCallback(() => {
    const url = `${window.location.origin}${publicPath(`/${currentBrandSlug}`)}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentBrandSlug]);

  useEffect(() => {
    if (!accountOpen) return;
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [accountOpen]);

  const handleSignOut = useCallback(async () => {
    setAccountOpen(false);
    await signOut();
    router.push("/login");
  }, [signOut, router]);

  return (
    <header
      className={`${isHomePage ? "" : "border-b"} px-6 py-3 flex items-center gap-4 transition-colors sticky top-0 z-40 ${
        editMode
          ? "bg-[#1a0c00]/95 border-[#5a2800] backdrop-blur-xl"
          : "glass-nav border-[#1e1e1e]"
      }`}
    >
      {!isHomePage && (
        <Link href={homeHref} className="shrink-0 hover:opacity-70 transition-opacity">
          <img src={publicPath("/atlas-wordmark.svg")} alt="Atlas" className="h-5 w-auto" />
        </Link>
      )}

      <div className="flex-1 flex justify-center items-center gap-2">
        {!isHomePage && !isPublic && (
          <Link
            href={homeHref}
            className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border text-[#f0f0f0] transition-all duration-200 ${
              editMode
                ? "bg-[#2d1500] border-[#5a2800] hover:bg-[#3a1c00]"
                : "bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.1]"
            }`}
            title="Home"
          >
            <Home size={14} />
          </Link>
        )}
        {!isHomePage && <SearchBar />}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {showCopyLink && (
          <button
            onClick={copyPublicLink}
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Link2 size={14} className="text-[#f0f0f0]" />
                <span className="text-[#f0f0f0]">Public link</span>
              </>
            )}
          </button>
        )}

        {canEdit && (
          <button
            onClick={toggleEditMode}
            className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border transition-all duration-200 ${
              editMode
                ? "bg-[#f77614] text-white border-[#f77614] hover:bg-[#e06810] shadow-[0_0_20px_rgba(247,118,20,0.25)]"
                : "bg-white/[0.04] text-[#f0f0f0] border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.1]"
            }`}
          >
            {editMode ? (
              <>
                <Check size={14} />
                Done editing
              </>
            ) : (
              <>
                <Pencil size={14} />
                Edit
              </>
            )}
          </button>
        )}

        {!isPublic && (
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-200 ${
                accountOpen
                  ? "bg-white/[0.08] border-white/[0.12] text-[#f0f0f0]"
                  : "bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.08] text-[#555] hover:text-[#f0f0f0]"
              }`}
              title="Account"
            >
              <User size={14} />
              <ChevronDown size={10} className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden z-50 [animation:fade-up_0.15s_ease-out_forwards]">
                {/* User info */}
                <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
                  <p className="text-sm font-semibold text-[#f0f0f0] truncate">{user?.email ?? "User"}</p>
                  <p className="text-[11px] text-[#555] mt-0.5">
                    {isOwner ? "Owner" : "Team member"}
                  </p>
                </div>

                {/* Portal switching */}
                <div className="px-2 py-2 border-b border-white/[0.05]">
                  <p className="px-2 pb-1.5 text-[10px] font-bold text-[#505050] uppercase tracking-[0.15em]">Portal</p>
                  {isOwner && (
                    <button
                      onClick={() => { setAccountOpen(false); router.push("/owner"); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors duration-150 ${
                        mode === "owner"
                          ? "bg-[#f77614]/10 text-[#f8a260] font-semibold"
                          : "text-[#888] hover:bg-white/[0.04] hover:text-[#f0f0f0]"
                      }`}
                    >
                      <Shield size={13} />
                      Owner
                      {mode === "owner" && <span className="ml-auto text-[10px] text-[#f77614]">Active</span>}
                    </button>
                  )}
                  <button
                    onClick={() => { setAccountOpen(false); router.push("/internal"); }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      mode === "internal"
                        ? "bg-[#f77614]/10 text-[#f8a260] font-semibold"
                        : "text-[#888] hover:bg-white/[0.04] hover:text-[#f0f0f0]"
                    }`}
                  >
                    <Users size={13} />
                    Internal
                    {mode === "internal" && <span className="ml-auto text-[10px] text-[#f77614]">Active</span>}
                  </button>
                </div>

                {/* Sign out */}
                <div className="px-2 py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#888] hover:bg-white/[0.04] hover:text-red-400 transition-colors duration-150"
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
