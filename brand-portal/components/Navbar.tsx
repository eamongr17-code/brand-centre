"use client";

import Link from "next/link";
import { Home, Pencil, Check } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { editMode, toggleEditMode } = useEditStore();
  const { canEdit, mode, portalPath } = usePortal();

  const homeHref = portalPath("/");
  const isPublic = mode === "public";

  return (
    <header
      className={`border-b px-6 py-3 flex items-center gap-4 transition-colors ${
        editMode
          ? "bg-[#1e1500] border-[#5a3e00]"
          : "bg-[#1a1a1a] border-[#2d2d2d]"
      }`}
    >
      {/* Logo */}
      <Link href={homeHref} className="shrink-0 hover:opacity-80 transition-opacity">
        <img src="/atlas-wordmark.svg" alt="Atlas" className="h-5 w-auto" />
      </Link>

      {/* Centre — home button (non-public only) + search */}
      <div className="flex-1 flex justify-center items-center gap-2">
        {!isPublic && (
          <Link
            href={homeHref}
            className={`shrink-0 inline-flex items-center justify-center w-[38px] h-[38px] rounded-lg border text-[#e8e8e8] transition-colors ${
              editMode
                ? "bg-[#2d2200] border-[#5a3e00] hover:bg-[#3a2d00]"
                : "bg-[#2d2d2d] border-[#444] hover:bg-[#333]"
            }`}
            title="Home"
          >
            <Home size={14} />
          </Link>
        )}
        <SearchBar />
      </div>

      {/* Right actions — edit button for owner only */}
      <div className="shrink-0">
        {canEdit && (
          <button
            onClick={toggleEditMode}
            className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-colors ${
              editMode
                ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
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
      </div>
    </header>
  );
}
