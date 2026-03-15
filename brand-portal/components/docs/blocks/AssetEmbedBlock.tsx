"use client";

import { Download, FileText } from "lucide-react";
import FadeImg from "@/components/FadeImg";
import { useEditStore } from "@/lib/edit-store";
import { publicPath } from "@/lib/public-path";
import type { AssetEmbedBlock as AssetEmbedBlockType } from "@/lib/types";

export default function AssetEmbedBlock({ block }: { block: AssetEmbedBlockType }) {
  const { getAssetById } = useEditStore();
  const asset = block.assetId ? getAssetById(block.assetId) : undefined;

  if (!asset) {
    return (
      <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/[0.07] px-5 py-6 flex items-center gap-3 text-[#505050]">
        <FileText size={18} />
        <span className="text-sm">{block.assetId ? "Asset not found" : "No asset selected"}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all duration-200">
      <div className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.05] shrink-0">
          <FadeImg
            src={asset.previewImage || publicPath("/placeholder-asset.png")}
            fallbackSrc={publicPath("/placeholder-asset.png")}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f0f0f0] truncate">{asset.name}</p>
          {asset.description && (
            <p className="text-xs text-[#555] mt-0.5 truncate">{asset.description}</p>
          )}
          <p className="text-xs text-[#505050] mt-1">
            {asset.fileType}{asset.fileSize ? ` · ${asset.fileSize}` : ""}
          </p>
        </div>
        <a
          href={asset.downloadUrl || "#"}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-3 py-2 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
        >
          <Download size={12} />
          Download
        </a>
      </div>
    </div>
  );
}
