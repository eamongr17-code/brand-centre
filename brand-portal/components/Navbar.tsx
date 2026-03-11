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

  // Detect the brand slug from the current path
  const currentBrandSlug = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const slug =
      segments[0] === "owner" || segments[0] === "internal"
        ? segments[1]
        : segments[0];
    return brands.find((b) => b.slug === slug)?.slug ?? null;
  }, [pathname]);

  // True when on the portal home (no brand in path)
  const isHomePage = !isPublic && !currentBrandSlug;

  // Internal users see a "Copy public link" button when on a brand page
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
      className={`${isHomePage ? "" : "border-b"} px-6 py-3 flex items-center gap-4 transition-colors ${
        editMode
          ? "bg-[#1a0c00] border-[#5a2800]"
          : "bg-[#1a1a1a] border-[#2d2d2d]"
      }`}
    >
      {/* Logo — hidden on home page (it shows large in the page body there) */}
      {!isHomePage && (
        <Link href={homeHref} className="shrink-0 hover:opacity-80 transition-opacity">
          <img src={publicPath("/atlas-wordmark.svg")} alt="Atlas" className="h-5 w-auto" />
        </Link>
      )}

      {/* Centre — hidden on home page; home button + search on inner pages */}
      <div className="flex-1 flex justify-center items-center gap-2">
        {!isHomePage && !isPublic && (
          <Link
            href={homeHref}
            className={`shrink-0 inline-flex items-center justify-center w-[38px] h-[38px] rounded-lg border text-[#e8e8e8] transition-colors ${
              editMode
                ? "bg-[#2d1500] border-[#5a2800] hover:bg-[#3a1c00]"
                : "bg-[#2d2d2d] border-[#444] hover:bg-[#333]"
            }`}
            title="Home"
          >
            <Home size={14} />
          </Link>
        )}
        {/* Search bar: hidden on home page (it lives in the page body there) */}
        {!isHomePage && <SearchBar />}
      </div>

      {/* Right actions */}
      <div className="shrink-0 flex items-center gap-2">
        {/* Copy public link — internal portal, brand pages only */}
        {showCopyLink && (
          <button
            onClick={copyPublicLink}
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border bg-[#2d2d2d] border-[#444] hover:bg-[#333] transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Link2 size={14} className="text-[#e8e8e8]" />
                <span className="text-[#e8e8e8]">Public link</span>
              </>
            )}
          </button>
        )}

        {/* Edit button — owner only */}
        {canEdit && (
          <button
            onClick={toggleEditMode}
            className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-colors ${
              editMode
                ? "bg-[#f77614] text-white border-[#f77614] hover:bg-[#e06810]"
                : "bg-[#2d2d2d] text-[#e8e8e8] border-[#444] hover:bg-[#333]"
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

        {/* Sign out — internal and owner portals */}
        {!isPublic && (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-lg border bg-[#2d2d2d] border-[#444] hover:bg-[#333] text-[#666] hover:text-[#e8e8e8] transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
