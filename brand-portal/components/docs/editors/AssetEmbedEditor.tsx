"use client";

import { useState, useMemo } from "react";
import { Check, X, Search, FileText } from "lucide-react";
import { brands } from "@/data/mock-data";
import { useEditStore } from "@/lib/edit-store";
import FadeImg from "@/components/FadeImg";
import { publicPath } from "@/lib/public-path";
import type { AssetEmbedBlock, DocBlock } from "@/lib/types";

export default function AssetEmbedEditor({ block, onSave, onCancel }: { block: AssetEmbedBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const { getCategories, getAssets, getAssetById } = useEditStore();
  const [assetId, setAssetId] = useState(block.assetId);
  const [searchQuery, setSearchQuery] = useState("");

  const allAssets = useMemo(() => {
    const results: { id: string; name: string; fileType: string; previewImage: string; categoryName: string; brandName: string }[] = [];
    for (const brand of brands) {
      const cats = getCategories(brand.id);
      for (const cat of cats) {
        if (cat.categoryType === "colours") continue;
        const assets = getAssets(cat.id);
        for (const asset of assets) {
          results.push({
            id: asset.id,
            name: asset.name,
            fileType: asset.fileType,
            previewImage: asset.previewImage,
            categoryName: cat.name,
            brandName: brand.name,
          });
        }
      }
    }
    return results;
  }, [getCategories, getAssets]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allAssets.slice(0, 10);
    return allAssets.filter((a) =>
      [a.name, a.categoryName, a.brandName, a.fileType].join(" ").toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery, allAssets]);

  const selectedAsset = assetId ? getAssetById(assetId) : undefined;

  return (
    <div className="space-y-3">
      {selectedAsset && (
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04] shrink-0">
            <FadeImg src={selectedAsset.previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt={selectedAsset.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#ececec] truncate">{selectedAsset.name}</p>
            <p className="text-xs text-[#555]">{selectedAsset.fileType}</p>
          </div>
          <button onClick={() => setAssetId("")} className="text-[#555] hover:text-red-400 transition-colors">
            <X size={12} />
          </button>
        </div>
      )}

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15]"
          placeholder="Search assets..."
        />
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a] [&::-webkit-scrollbar-thumb]:rounded-full">
        {filtered.map((a) => (
          <button
            key={a.id}
            onClick={() => setAssetId(a.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              assetId === a.id ? "bg-white/[0.06] border border-white/[0.08]" : "hover:bg-white/[0.03]"
            }`}
          >
            <div className="w-8 h-8 rounded-md overflow-hidden bg-white/[0.02] border border-white/[0.04] shrink-0">
              {a.previewImage ? (
                <FadeImg src={a.previewImage} fallbackSrc={publicPath("/placeholder-asset.png")} alt={a.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><FileText size={12} className="text-[#444]" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#d0d0d0] truncate">{a.name}</p>
              <p className="text-[10px] text-[#444] truncate">{a.brandName} / {a.categoryName}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-[#444] text-center py-4">No assets found</p>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ assetId })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
