"use client";

import { Check, X } from "lucide-react";
import FadeImg from "@/components/FadeImg";
import type { DoDontBlock as DoDontBlockType } from "@/lib/types";

export default function DoDontBlock({ block }: { block: DoDontBlockType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Do */}
      <div className="space-y-2">
        <div className="rounded-xl overflow-hidden border border-green-500/20 bg-white/[0.02]">
          {block.doImage ? (
            <FadeImg src={block.doImage} alt={block.doCaption} className="w-full h-auto" />
          ) : (
            <div className="h-40 flex items-center justify-center text-[#505050] text-sm">No image</div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check size={11} className="text-green-400" />
          </div>
          <span className="text-sm font-semibold text-green-400">{block.doCaption || "Do"}</span>
        </div>
      </div>
      {/* Don't */}
      <div className="space-y-2">
        <div className="rounded-xl overflow-hidden border border-red-500/20 bg-white/[0.02]">
          {block.dontImage ? (
            <FadeImg src={block.dontImage} alt={block.dontCaption} className="w-full h-auto" />
          ) : (
            <div className="h-40 flex items-center justify-center text-[#505050] text-sm">No image</div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <X size={11} className="text-red-400" />
          </div>
          <span className="text-sm font-semibold text-red-400">{block.dontCaption || "Don't"}</span>
        </div>
      </div>
    </div>
  );
}
