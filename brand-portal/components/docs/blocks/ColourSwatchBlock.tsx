"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ColourSwatchBlock as ColourSwatchBlockType } from "@/lib/types";

export default function ColourSwatchBlock({ block }: { block: ColourSwatchBlockType }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyHex = (hex: string, id: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {block.colours.map((c, i) => {
        const id = `${block.id}-${i}`;
        return (
          <button
            key={id}
            onClick={() => copyHex(c.hex, id)}
            className="group flex items-center gap-3 bg-white/[0.02] border border-white/[0.07] rounded-xl px-4 py-3 hover:border-white/[0.12] transition-all duration-200"
          >
            <div
              className="w-8 h-8 rounded-lg border border-white/[0.08] shrink-0"
              style={{ backgroundColor: c.hex }}
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-[#f0f0f0]">{c.name}</p>
              <p className="text-xs font-mono text-[#555]">{c.hex}</p>
            </div>
            <div className="ml-2 text-[#505050] group-hover:text-[#888] transition-colors">
              {copiedId === id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
