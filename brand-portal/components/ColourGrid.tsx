"use client";

import { Plus } from "lucide-react";
import ColourCard from "@/components/ColourCard";
import { useEditStore } from "@/lib/edit-store";

export default function ColourGrid({ categoryId }: { categoryId: string }) {
  const { editMode, getColours, addColour } = useEditStore();
  const colours = getColours(categoryId);

  return (
    <div>
      {colours.length === 0 && !editMode && (
        <p className="text-[#484848] text-sm">No colours in this palette yet.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
        {colours.map((colour) => (
          <ColourCard key={colour.id} colour={colour} />
        ))}
        {editMode && (
          <button
            onClick={() => addColour(categoryId)}
            className="border-2 border-dashed border-white/[0.06] rounded-xl min-h-[140px] flex flex-col items-center justify-center gap-2 text-[#484848] hover:text-[#888] hover:border-white/[0.12] transition-all duration-200"
          >
            <Plus size={22} />
            <span className="text-sm font-medium">Add colour</span>
          </button>
        )}
      </div>
    </div>
  );
}
