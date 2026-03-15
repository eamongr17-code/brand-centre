"use client";

import FadeImg from "@/components/FadeImg";
import type { ImageBlock as ImageBlockType } from "@/lib/types";

export default function ImageBlock({ block }: { block: ImageBlockType }) {
  if (!block.url) {
    return (
      <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/[0.07] h-48 flex items-center justify-center text-[#505050] text-sm">
        No image set
      </div>
    );
  }

  return (
    <figure className={block.fullWidth ? "" : "max-w-2xl"}>
      <div className="rounded-xl overflow-hidden border border-white/[0.07]">
        <FadeImg src={block.url} alt={block.alt} className="w-full h-auto" />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-xs text-[#555] text-center">{block.caption}</figcaption>
      )}
    </figure>
  );
}
