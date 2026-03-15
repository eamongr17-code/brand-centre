"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import type { ImageBlock, DocBlock } from "@/lib/types";

export default function ImageEditor({ block, onSave, onCancel }: { block: ImageBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [url, setUrl] = useState(block.url);
  const [alt, setAlt] = useState(block.alt);
  const [caption, setCaption] = useState(block.caption ?? "");
  const [fullWidth, setFullWidth] = useState(block.fullWidth ?? false);

  return (
    <div className="space-y-2">
      <ImageUploader value={url} onChange={setUrl} placeholder="Image URL" />
      <input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
        placeholder="Alt text"
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
        placeholder="Caption (optional)"
      />
      <label className="flex items-center gap-2 text-xs text-[#888] cursor-pointer">
        <input type="checkbox" checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)} className="rounded" />
        Full width
      </label>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ url, alt, caption, fullWidth })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
