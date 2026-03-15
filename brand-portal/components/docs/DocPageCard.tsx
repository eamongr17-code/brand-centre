"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Pencil, Trash2, Check, X, Lock } from "lucide-react";
import FadeImg from "@/components/FadeImg";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import type { DocPage } from "@/lib/types";

interface DocPageCardProps {
  docPage: DocPage;
  brandSlug: string;
}

export default function DocPageCard({ docPage, brandSlug }: DocPageCardProps) {
  const { editMode, updateDocPage, deleteDocPage } = useEditStore();
  const { portalPath, canEdit } = usePortal();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(docPage.title);
  const [description, setDescription] = useState(docPage.description);

  useEffect(() => {
    if (!editing) {
      setTitle(docPage.title);
      setDescription(docPage.description);
    }
  }, [docPage, editing]);

  const save = () => {
    updateDocPage(docPage.id, { title: title.trim() || "Untitled", description });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="border border-[#f77614] rounded-xl bg-[#1a1a1a] p-4 space-y-2 [animation:fade-up_0.3s_ease-out_forwards]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
          placeholder="Page title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs resize-none text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
          rows={2}
          placeholder="Description"
        />
        <div className="flex gap-2">
          <button onClick={save} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
            <Check size={11} /> Save
          </button>
          <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
            <X size={11} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link href={portalPath(`/${brandSlug}/docs/${docPage.slug}`)} className="block h-full">
      <div className="rounded-2xl relative group flex flex-col [animation:fade-up_0.3s_ease-out_forwards] h-full overflow-hidden border border-white/[0.07] hover:border-white/[0.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300" style={{ minHeight: "260px" }}>
        {/* Cover image or icon */}
        <div className="absolute inset-0">
          {docPage.coverImage ? (
            <FadeImg src={docPage.coverImage} alt={docPage.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-white/[0.02] to-white/[0.01] flex items-center justify-center">
              <FileText size={48} className="text-[#222]" />
            </div>
          )}
        </div>

        {/* Edit buttons */}
        {editMode && canEdit && (
          <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
              className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1.5 hover:bg-white/[0.08] transition-colors"
              title="Edit"
            >
              <Pencil size={12} className="text-[#f0f0f0]" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteDocPage(docPage.id); }}
              className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1.5 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-[100px]" />

        {/* Dark panel */}
        <div className="relative z-10 bg-[#1a1a1a] px-5 py-4">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#f0f0f0] text-[15px] leading-tight truncate">{docPage.title}</p>
            {docPage.visibility === "internal" && (
              <Lock size={11} className="text-yellow-500 shrink-0" />
            )}
          </div>
          {docPage.description && (
            <p className="text-xs text-[#555] mt-1 line-clamp-2">{docPage.description}</p>
          )}
          <p className="text-xs text-[#505050] mt-2">{docPage.blocks.length} blocks</p>
        </div>
      </div>
    </Link>
  );
}
