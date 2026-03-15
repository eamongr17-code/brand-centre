"use client";

import { useState } from "react";
import { Plus, Type, AlignLeft, ImageIcon, Columns, Palette, Link2, Download, Minus, Code, LetterText, FolderOpen, Layers } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import type { DocBlockType } from "@/lib/types";

const BLOCK_OPTIONS: { type: DocBlockType; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "Heading", icon: <Type size={14} /> },
  { type: "paragraph", label: "Paragraph", icon: <AlignLeft size={14} /> },
  { type: "image", label: "Image", icon: <ImageIcon size={14} /> },
  { type: "do-dont", label: "Do / Don't", icon: <Columns size={14} /> },
  { type: "colour-swatch", label: "Colour Swatch", icon: <Palette size={14} /> },
  { type: "asset-embed", label: "Asset Embed", icon: <Link2 size={14} /> },
  { type: "category-embed", label: "Category", icon: <FolderOpen size={14} /> },
  { type: "colour-palette-embed", label: "Colour Palette", icon: <Layers size={14} /> },
  { type: "download-cta", label: "Download CTA", icon: <Download size={14} /> },
  { type: "divider", label: "Divider", icon: <Minus size={14} /> },
  { type: "code-snippet", label: "Code Snippet", icon: <Code size={14} /> },
  { type: "typography-sample", label: "Typography", icon: <LetterText size={14} /> },
];

export default function DocBlockAddMenu({ docPageId }: { docPageId: string }) {
  const { addDocBlock } = useEditStore();
  const [open, setOpen] = useState(false);

  const handleAdd = (type: DocBlockType) => {
    addDocBlock(docPageId, type);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-[#555] hover:text-[#888] border border-dashed border-white/[0.07] hover:border-white/[0.12] rounded-xl px-5 py-3 transition-all duration-200 w-full justify-center"
      >
        <Plus size={15} />
        Add block
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] p-2 z-50 w-64 [animation:fade-up_0.15s_ease-out_forwards]">
          <div className="grid grid-cols-2 gap-1">
            {BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleAdd(opt.type)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#888] hover:text-[#f0f0f0] hover:bg-white/[0.04] transition-all duration-150 text-left"
              >
                <span className="text-[#555]">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
