"use client";

import Link from "next/link";
import { Home, Pencil, Check } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { editMode, toggleEditMode } = useEditStore();

  return (
    <header
      className={`border-b px-6 py-3 flex items-center gap-4 transition-colors ${
        editMode
          ? "bg-[#1e1500] border-[#5a3e00]"
          : "bg-[#1a1a1a] border-[#2d2d2d]"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="shrink-0 inline-flex items-center gap-2 font-bold text-base tracking-tight text-[#e8e8e8] hover:text-white transition-colors"
      >
        <Home size={16} />
        <span className="hidden sm:inline">Easygo Brand Portal</span>
      </Link>

      {/* Search — fills remaining space */}
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      {/* Right actions */}
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={toggleEditMode}
          className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded border transition-colors ${
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
      </div>
    </header>
  );
}
