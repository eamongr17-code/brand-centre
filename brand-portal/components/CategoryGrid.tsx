"use client";

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
  const { editMode, getCategories, addCategory } = useEditStore();
  const { canEdit, showInternal } = usePortal();
  const allCategories = getCategories(brandId, subBrandId);
  const categories = showInternal
    ? allCategories
    : allCategories.filter((c) => c.visibility !== "internal");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} brandSlug={brandSlug} />
      ))}
      {editMode && canEdit && (
        <>
          <button
            onClick={() => addCategory(brandId, subBrandId)}
            className="border-2 border-dashed border-[#3a3a3a] rounded-lg min-h-[220px] flex flex-col items-center justify-center gap-2 text-[#666] hover:text-[#aaa] hover:border-[#555] transition-colors"
          >
            <Plus size={22} />
            <span className="text-sm">Add category</span>
          </button>
          <button
            onClick={() => addCategory(brandId, subBrandId, "colours")}
            className="border-2 border-dashed border-[#3a3a3a] rounded-lg min-h-[220px] flex flex-col items-center justify-center gap-2 text-[#666] hover:text-[#aaa] hover:border-[#555] transition-colors"
          >
            <Palette size={22} />
            <span className="text-sm">Add colour palette</span>
          </button>
        </>
      )}
    </div>
  );
}
