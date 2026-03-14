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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} brandSlug={brandSlug} />
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
