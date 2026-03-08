"use client";

import { Plus } from "lucide-react";
import AssetCard from "@/components/AssetCard";
import { useEditStore } from "@/lib/edit-store";

export default function AssetGrid({ categoryId }: { categoryId: string }) {
  const { editMode, getAssets, addAsset } = useEditStore();
  const assets = getAssets(categoryId);

  return (
    <div>
      {assets.length === 0 && !editMode && (
        <p className="text-gray-500 text-sm">No assets in this category yet.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
        {editMode && (
          <button
            onClick={() => addAsset(categoryId)}
            className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
          >
            <Plus size={22} />
            <span className="text-sm">Add asset</span>
          </button>
        )}
      </div>
    </div>
  );
}
