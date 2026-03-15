"use client";

import { Download } from "lucide-react";
import type { DownloadCtaBlock as DownloadCtaBlockType } from "@/lib/types";

export default function DownloadCtaBlock({ block }: { block: DownloadCtaBlockType }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#ececec]">{block.label || "Download"}</p>
        {block.description && (
          <p className="text-xs text-[#555] mt-0.5">{block.description}</p>
        )}
      </div>
      {block.url && block.url !== "#" && (
        <a
          href={block.url}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
        >
          <Download size={14} />
          Download
        </a>
      )}
    </div>
  );
}
