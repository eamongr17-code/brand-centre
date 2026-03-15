"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { ParagraphBlock, DocBlock } from "@/lib/types";

export default function ParagraphEditor({ block, onSave, onCancel }: { block: ParagraphBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [text, setText] = useState(block.text);

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] resize-none"
        rows={4}
        placeholder="Paragraph text (supports **bold**, *italic*, `code`, [link](url))"
        autoFocus
      />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ text })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
