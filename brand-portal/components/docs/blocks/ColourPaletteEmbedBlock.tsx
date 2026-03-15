"use client";

import { useState } from "react";
import { Palette, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { brands } from "@/data/mock-data";
import { hexToRgb } from "@/lib/colour-utils";
import type { ColourPaletteEmbedBlock as ColourPaletteEmbedBlockType } from "@/lib/types";

export default function ColourPaletteEmbedBlock({ block }: { block: ColourPaletteEmbedBlockType }) {
  const { getCategories, getColours } = useEditStore();
  const { portalPath } = usePortal();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const brand = brands.find((b) => b.id === block.brandId);
  const allCats = block.brandId ? getCategories(block.brandId) : [];
  const category = allCats.find((c) => c.id === block.categoryId);

  if (!category || !brand) {
    return (
      <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/[0.06] px-5 py-6 flex items-center gap-3 text-[#444]">
        <Palette size={18} />
        <span className="text-sm">{block.categoryId ? "Colour palette not found" : "No palette selected"}</span>
      </div>
    );
  }

  const colours = getColours(category.id);

  const copyHex = (hex: string, id: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <Palette size={14} className="text-[#686868]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#ececec]">{category.name}</p>
            <p className="text-[10px] text-[#444]">{colours.length} colours · {brand.name}</p>
          </div>
        </div>
        <Link
          href={portalPath(`/${brand.slug}/${category.slug}`)}
          className="text-xs text-[#555] hover:text-[#ececec] transition-colors font-semibold"
        >
          View palette
        </Link>
      </div>

      {/* Colour swatches */}
      {colours.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-[#444]">No colours in this palette yet</div>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {colours.map((colour) => (
            <button
              key={colour.id}
              onClick={() => copyHex(colour.hex, colour.id)}
              className="group flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2.5 hover:border-white/[0.1] transition-all duration-200 text-left"
            >
              <div
                className="w-10 h-10 rounded-lg border border-white/[0.08] shrink-0"
                style={{ backgroundColor: colour.hex }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#d0d0d0] truncate">{colour.name}</p>
                <p className="text-[10px] font-mono text-[#555]">{colour.hex}</p>
                <p className="text-[10px] text-[#333]">{(() => { const { r, g, b } = hexToRgb(colour.hex); return `rgb(${r}, ${g}, ${b})`; })()}</p>
              </div>
              <div className="text-[#333] group-hover:text-[#888] transition-colors shrink-0">
                {copiedId === colour.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
