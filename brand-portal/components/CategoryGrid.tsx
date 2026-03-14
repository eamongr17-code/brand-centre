"use client";

import { useState, useCallback } from "react";
import { Palette, Plus } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

interface CategoryGridProps {
  brandSlug: string;
  brandId: string;
  subBrandId?: string;
}

export default function CategoryGrid({ brandSlug, brandId, subBrandId }: CategoryGridProps) {
  const { editMode, getCategories, addCategory, reorderCategories } = useEditStore();
  const { canEdit, showInternal } = usePortal();
  const allCategories = getCategories(brandId, subBrandId);
  const categories = showInternal
    ? allCategories
    : allCategories.filter((c) => c.visibility !== "internal");

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
      const ids = categories.map((c) => c.id);
      const fromIdx = ids.indexOf(dragId);
      const toIdx = ids.indexOf(hoverId);
      if (fromIdx !== -1 && toIdx !== -1) {
        ids.splice(fromIdx, 1);
        ids.splice(toIdx, 0, dragId);
        reorderCategories(brandId, subBrandId, ids);
      }
    }
    setDragId(null);
    setHoverId(null);
  }, [dragId, hoverId, categories, brandId, subBrandId, reorderCategories]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
      {categories.map((cat) => (
        <div key={cat.id} className={`${hoverId === cat.id && dragId ? "ring-2 ring-blue-500/50 rounded-xl" : ""}`}>
          <CategoryCard
            category={cat}
            brandSlug={brandSlug}
            onDragStart={editMode ? handleDragStart : undefined}
            onDragOver={editMode ? handleDragOver : undefined}
            onDragEnd={editMode ? handleDragEnd : undefined}
          />
        </div>
      ))}
      {editMode && canEdit && (
        <>
          <button
            onClick={() => addCategory(brandId, subBrandId)}
            className="border-2 border-dashed border-white/[0.06] rounded-xl min-h-[220px] flex flex-col items-center justify-center gap-2 text-[#484848] hover:text-[#888] hover:border-white/[0.12] transition-all duration-200"
          >
            <Plus size={22} />
            <span className="text-sm font-medium">Add category</span>
          </button>
          <button
            onClick={() => addCategory(brandId, subBrandId, "colours")}
            className="border-2 border-dashed border-white/[0.06] rounded-xl min-h-[220px] flex flex-col items-center justify-center gap-2 text-[#484848] hover:text-[#888] hover:border-white/[0.12] transition-all duration-200"
          >
            <Palette size={22} />
            <span className="text-sm font-medium">Add colour palette</span>
          </button>
        </>
      )}
    </div>
  );
}
