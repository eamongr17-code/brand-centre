"use client";

import type { ParagraphBlock as ParagraphBlockType } from "@/lib/types";

export default function ParagraphBlock({ block }: { block: ParagraphBlockType }) {
  // Lightweight inline markdown: **bold**, *italic*, `code`, [link](url)
  const parts = block.text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

  return (
    <p className="text-[15px] text-[#888] leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-[#f0f0f0] font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-white/[0.04] px-1.5 py-0.5 rounded text-[13px] font-mono text-[#b0b0b0]">{part.slice(1, -1)}</code>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#f77614] hover:underline">{linkMatch[1]}</a>;
        }
        return part;
      })}
    </p>
  );
}
