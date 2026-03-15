"use client";

import { Plus } from "lucide-react";
import ColourCard from "@/components/ColourCard";
import { useEditStore } from "@/lib/edit-store";

export default function ColourGrid({ categoryId, filterQuery }: { categoryId: string; filterQuery?: string }) {
  const { editMode, getColours, addColour } = useEditStore();
  const allColours = getColours(categoryId);
  const colours = filterQuery
    ? allColours.filter((c) => {
        const q = filterQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q);
      })
    : allColours;

  return (
    <div>
      {colours.length === 0 && !editMode && (
        <p className="text-[#555] text-sm">No colours in this palette yet.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {colours.map((colour) => (
          <ColourCard key={colour.id} colour={colour} />
        ))}
        {editMode && (
          <button
            onClick={() => addColour(categoryId)}
            className="border-2 border-dashed border-white/[0.07] rounded-xl aspect-[16/12] flex flex-col items-center justify-center gap-2 text-[#555] hover:text-[#888] hover:border-white/[0.12] transition-all duration-200"
          >
            <Plus size={22} />
            <span className="text-sm font-medium">Add colour</span>
          </button>
        )}
      </div>
    </div>
  );
}
