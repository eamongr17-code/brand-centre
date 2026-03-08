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
        <p className="text-gray-500 text-sm">No colours in this palette yet.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {colours.map((colour) => (
          <ColourCard key={colour.id} colour={colour} />
        ))}
        {editMode && (
          <button
            onClick={() => addColour(categoryId)}
            className="border-2 border-dashed border-[#3a3a3a] rounded-lg min-h-[140px] flex flex-col items-center justify-center gap-2 text-[#666] hover:text-[#aaa] hover:border-[#555] transition-colors"
          >
            <Plus size={22} />
            <span className="text-sm">Add colour</span>
          </button>
        )}
      </div>
    </div>
  );
}
