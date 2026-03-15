"use client";

import type { TypographySampleBlock as TypographySampleBlockType } from "@/lib/types";

export default function TypographySampleBlock({ block }: { block: TypographySampleBlockType }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#444] mb-1">Font Family</p>
        <p className="text-lg font-semibold text-[#ececec]" style={{ fontFamily: block.fontFamily }}>
          {block.fontFamily}
        </p>
      </div>
      <div className="space-y-3">
        {block.weights.map((weight) => (
          <div key={weight} className="flex items-baseline gap-4">
            <span className="text-xs text-[#555] w-12 shrink-0 font-mono">{weight}</span>
            <p
              className="text-xl text-[#d0d0d0]"
              style={{ fontFamily: block.fontFamily, fontWeight: parseInt(weight, 10) }}
            >
              {block.sampleText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
