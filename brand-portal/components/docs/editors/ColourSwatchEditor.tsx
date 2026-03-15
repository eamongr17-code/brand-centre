"use client";

import { useState } from "react";
import { Check, X, Plus, Trash2 } from "lucide-react";
import type { ColourSwatchBlock, DocBlock } from "@/lib/types";

export default function ColourSwatchEditor({ block, onSave, onCancel }: { block: ColourSwatchBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [colours, setColours] = useState(block.colours.map((c) => ({ ...c })));

  const updateColour = (i: number, field: "name" | "hex", value: string) => {
    setColours((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  const addColour = () => {
    setColours((prev) => [...prev, { name: "New colour", hex: "#000000" }]);
  };

  const removeColour = (i: number) => {
    setColours((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-2">
      {colours.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="color"
            value={c.hex}
            onChange={(e) => updateColour(i, "hex", e.target.value)}
            className="w-8 h-8 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer shrink-0"
          />
          <input
            value={c.name}
            onChange={(e) => updateColour(i, "name", e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
            placeholder="Colour name"
          />
          <input
            value={c.hex}
            onChange={(e) => updateColour(i, "hex", e.target.value)}
            className="w-24 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-[#888] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
            placeholder="#000000"
          />
          <button onClick={() => removeColour(i)} className="text-[#555] hover:text-red-400 transition-colors p-1">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button onClick={addColour} className="flex items-center gap-1 text-xs text-[#555] hover:text-[#888] transition-colors">
        <Plus size={12} /> Add colour
      </button>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ colours })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
