"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { HeadingBlock, DocBlock } from "@/lib/types";

export default function HeadingEditor({ block, onSave, onCancel }: { block: HeadingBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [text, setText] = useState(block.text);
  const [level, setLevel] = useState(block.level);

  return (
    <div className="space-y-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
        placeholder="Heading text"
        autoFocus
      />
      <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg text-xs">
        {(["h1", "h2", "h3"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`flex-1 py-1.5 rounded-md transition-all ${level === l ? "bg-white/[0.08] text-[#f0f0f0] font-semibold" : "text-[#555] hover:text-[#888]"}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ text, level })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
