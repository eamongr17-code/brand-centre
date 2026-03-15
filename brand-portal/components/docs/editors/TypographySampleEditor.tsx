"use client";

import { useState } from "react";
import { Check, X, Plus, Trash2 } from "lucide-react";
import type { TypographySampleBlock, DocBlock } from "@/lib/types";

export default function TypographySampleEditor({ block, onSave, onCancel }: { block: TypographySampleBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [fontFamily, setFontFamily] = useState(block.fontFamily);
  const [weights, setWeights] = useState([...block.weights]);
  const [sampleText, setSampleText] = useState(block.sampleText);

  const addWeight = () => setWeights((prev) => [...prev, "400"]);
  const removeWeight = (i: number) => setWeights((prev) => prev.filter((_, idx) => idx !== i));
  const updateWeight = (i: number, v: string) => setWeights((prev) => prev.map((w, idx) => (idx === i ? v : w)));

  return (
    <div className="space-y-2">
      <input
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
        placeholder="Font family (e.g. Inter, Roboto)"
        autoFocus
      />
      <div className="space-y-1">
        <span className="text-xs text-[#555]">Weights</span>
        {weights.map((w, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={w}
              onChange={(e) => updateWeight(i, e.target.value)}
              className="w-24 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1 text-sm font-mono text-[#f0f0f0] focus:outline-none focus:border-white/[0.15]"
              placeholder="400"
            />
            <button onClick={() => removeWeight(i)} className="text-[#555] hover:text-red-400 transition-colors">
              <Trash2 size={11} />
            </button>
          </div>
        ))}
        <button onClick={addWeight} className="flex items-center gap-1 text-xs text-[#555] hover:text-[#888] transition-colors">
          <Plus size={11} /> Add weight
        </button>
      </div>
      <textarea
        value={sampleText}
        onChange={(e) => setSampleText(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] resize-none"
        rows={2}
        placeholder="Sample text"
      />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ fontFamily, weights, sampleText })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
