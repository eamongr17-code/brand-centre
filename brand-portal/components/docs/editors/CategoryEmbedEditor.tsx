"use client";

import { useState, useMemo } from "react";
import { Check, X, FolderOpen, Palette } from "lucide-react";
import { brands } from "@/data/mock-data";
import { useEditStore } from "@/lib/edit-store";
import type { CategoryEmbedBlock, DocBlock } from "@/lib/types";

export default function CategoryEmbedEditor({ block, onSave, onCancel }: { block: CategoryEmbedBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const { getCategories } = useEditStore();
  const [brandId, setBrandId] = useState(block.brandId);
  const [categoryId, setCategoryId] = useState(block.categoryId);

  const categories = useMemo(() => {
    if (!brandId) return [];
    return getCategories(brandId).filter((c) => c.categoryType !== "colours");
  }, [brandId, getCategories]);

  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs text-[#555] mb-1 block">Brand</span>
        <div className="flex flex-wrap gap-1.5">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => { setBrandId(b.id); setCategoryId(""); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${brandId === b.id ? "bg-white/[0.08] text-[#ececec] border border-white/[0.12]" : "bg-white/[0.02] text-[#555] border border-white/[0.04] hover:text-[#888]"}`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
      {brandId && (
        <div>
          <span className="text-xs text-[#555] mb-1 block">Category</span>
          <div className="max-h-48 overflow-y-auto space-y-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a] [&::-webkit-scrollbar-thumb]:rounded-full">
            {categories.length === 0 ? (
              <p className="text-xs text-[#444] py-4 text-center">No asset categories found for this brand</p>
            ) : categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${categoryId === cat.id ? "bg-white/[0.06] border border-white/[0.08]" : "hover:bg-white/[0.03]"}`}
              >
                <FolderOpen size={14} className="text-[#555] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#d0d0d0] truncate">{cat.name}</p>
                  <p className="text-[10px] text-[#444]">{cat.description || "No description"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ categoryId, brandId })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
