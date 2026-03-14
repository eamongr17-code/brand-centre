"use client";

import { Plus } from "lucide-react";
import AssetCard from "@/components/AssetCard";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

export default function AssetGrid({ categoryId }: { categoryId: string }) {
  const { editMode, getAssets, addAsset } = useEditStore();
  const { canEdit, showInternal } = usePortal();
  const allAssets = getAssets(categoryId);
  const assets = showInternal
    ? allAssets
    : allAssets.filter((a) => a.visibility !== "internal");

  return (
    <div>
      {assets.length === 0 && !editMode && (
        <p className="text-[#484848] text-sm">No assets in this category yet.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
        {editMode && canEdit && (
          <button
            onClick={() => addAsset(categoryId)}
            className="border-2 border-dashed border-white/[0.06] rounded-xl min-h-[220px] flex flex-col items-center justify-center gap-2 text-[#484848] hover:text-[#888] hover:border-white/[0.12] transition-all duration-200"
          >
            <Plus size={22} />
            <span className="text-sm font-medium">Add asset</span>
          </button>
        )}
      </div>
    </div>
  );
}
