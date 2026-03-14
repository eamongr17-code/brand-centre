"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Pencil, Check, Link2, LogOut } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { useAuth } from "@/lib/auth-context";
import SearchBar from "@/components/SearchBar";
import { publicPath } from "@/lib/public-path";
import { brands } from "@/data/mock-data";

export default function Navbar() {
  const { editMode, toggleEditMode } = useEditStore();
  const { canEdit, mode, portalPath } = usePortal();
  const { signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const homeHref = portalPath("/");
  const isPublic = mode === "public";

  const currentBrandSlug = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const slug =
      segments[0] === "owner" || segments[0] === "internal"
        ? segments[1]
        : segments[0];
    return brands.find((b) => b.slug === slug)?.slug ?? null;
  }, [pathname]);

  const isHomePage = !isPublic && !currentBrandSlug;
  const showCopyLink = mode === "internal" && !!currentBrandSlug;

  const copyPublicLink = useCallback(() => {
    const url = `${window.location.origin}${publicPath(`/${currentBrandSlug}`)}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentBrandSlug]);

  const handleSignOut = useCallback(async () => {
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
            className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border text-[#ececec] transition-all duration-200 ${
              editMode
                ? "bg-[#2d1500] border-[#5a2800] hover:bg-[#3a1c00]"
                : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1]"
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
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Link2 size={14} className="text-[#ececec]" />
                <span className="text-[#ececec]">Public link</span>
              </>
            )}
          </button>
        )}

        {canEdit && (
          <button
            onClick={toggleEditMode}
            className={`inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-lg border transition-all duration-200 ${
              editMode
                ? "bg-[#f77614] text-white border-[#f77614] hover:bg-[#e06810] shadow-[0_0_20px_rgba(247,118,20,0.25)]"
                : "bg-white/[0.04] text-[#ececec] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1]"
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
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] text-[#555] hover:text-[#ececec] transition-all duration-200"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
