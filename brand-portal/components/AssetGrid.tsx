"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import AssetCard from "@/components/AssetCard";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

interface AssetGridProps {
  categoryId: string;
  brandSlug?: string;
  categorySlug?: string;
  filterQuery?: string;
}

export default function AssetGrid({ categoryId, brandSlug, categorySlug, filterQuery }: AssetGridProps) {
  const { editMode, getAssets, addAsset, reorderAssets } = useEditStore();
  const { canEdit, showInternal } = usePortal();
  const allAssets = getAssets(categoryId);
  const visibleAssets = showInternal
    ? allAssets
    : allAssets.filter((a) => a.visibility !== "internal");
  const assets = filterQuery
    ? visibleAssets.filter((a) => {
        const q = filterQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.fileType.toLowerCase().includes(q) ||
          (a.tags ?? []).some((t) => t.toLowerCase().includes(q))
        );
      })
    : visibleAssets;

  const [dragId, setDragId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoverId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragId && hoverId && dragId !== hoverId) {
      const ids = assets.map((a) => a.id);
      const fromIdx = ids.indexOf(dragId);
      const toIdx = ids.indexOf(hoverId);
      if (fromIdx !== -1 && toIdx !== -1) {
        ids.splice(fromIdx, 1);
        ids.splice(toIdx, 0, dragId);
        reorderAssets(categoryId, ids);
      }
    }
    setDragId(null);
    setHoverId(null);
  }, [dragId, hoverId, assets, categoryId, reorderAssets]);

  return (
    <div>
      {assets.length === 0 && !editMode && (
        <p className="text-[#555] text-sm">No assets in this category yet.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {assets.map((asset) => (
          <div key={asset.id} className={`${hoverId === asset.id && dragId ? "ring-2 ring-blue-500/50 rounded-xl" : ""}`}>
            <AssetCard
              asset={asset}
              brandSlug={brandSlug}
              categorySlug={categorySlug}
              onDragStart={editMode ? handleDragStart : undefined}
              onDragOver={editMode ? handleDragOver : undefined}
              onDragEnd={editMode ? handleDragEnd : undefined}
            />
          </div>
        ))}
        {editMode && canEdit && (
          <button
            onClick={() => addAsset(categoryId)}
            className="border-2 border-dashed border-white/[0.07] rounded-xl aspect-video flex flex-col items-center justify-center gap-2 text-[#555] hover:text-[#888] hover:border-white/[0.12] transition-all duration-200"
          >
            <Plus size={22} />
            <span className="text-sm font-medium">Add asset</span>
          </button>
        )}
      </div>
    </div>
  );
}
