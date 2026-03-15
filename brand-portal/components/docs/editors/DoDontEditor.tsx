"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import type { DoDontBlock, DocBlock } from "@/lib/types";

export default function DoDontEditor({ block, onSave, onCancel }: { block: DoDontBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [doImage, setDoImage] = useState(block.doImage);
  const [doCaption, setDoCaption] = useState(block.doCaption);
  const [dontImage, setDontImage] = useState(block.dontImage);
  const [dontCaption, setDontCaption] = useState(block.dontCaption);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-green-400">Do</span>
          <ImageUploader value={doImage} onChange={setDoImage} placeholder="Do image URL" />
          <input value={doCaption} onChange={(e) => setDoCaption(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15]" placeholder="Do caption" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold text-red-400">Don&apos;t</span>
          <ImageUploader value={dontImage} onChange={setDontImage} placeholder="Don't image URL" />
          <input value={dontCaption} onChange={(e) => setDontCaption(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15]" placeholder="Don't caption" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ doImage, doCaption, dontImage, dontCaption })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
