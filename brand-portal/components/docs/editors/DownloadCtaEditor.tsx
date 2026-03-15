"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import type { DownloadCtaBlock, DocBlock } from "@/lib/types";

export default function DownloadCtaEditor({ block, onSave, onCancel }: { block: DownloadCtaBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [label, setLabel] = useState(block.label);
  const [url, setUrl] = useState(block.url);
  const [description, setDescription] = useState(block.description ?? "");

  return (
    <div className="space-y-2">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
        placeholder="Button label"
        autoFocus
      />
      <ImageUploader value={url} onChange={setUrl} placeholder="Download URL" accept="*/*" />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15]"
        placeholder="Description (optional)"
      />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ label, url, description })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
