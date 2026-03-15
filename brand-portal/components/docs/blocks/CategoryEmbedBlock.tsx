"use client";

import { Download, FolderOpen } from "lucide-react";
import Link from "next/link";
import FadeImg from "@/components/FadeImg";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { publicPath } from "@/lib/public-path";
import { getBrandBySlug, brands } from "@/data/mock-data";
import type { CategoryEmbedBlock as CategoryEmbedBlockType } from "@/lib/types";

export default function CategoryEmbedBlock({ block }: { block: CategoryEmbedBlockType }) {
  const { getCategories, getAssets } = useEditStore();
  const { portalPath, showInternal } = usePortal();

  // Find the category
  const brand = brands.find((b) => b.id === block.brandId);
  const allCats = block.brandId ? getCategories(block.brandId) : [];
  const category = allCats.find((c) => c.id === block.categoryId);

  if (!category || !brand) {
    return (
      <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/[0.06] px-5 py-6 flex items-center gap-3 text-[#444]">
        <FolderOpen size={18} />
        <span className="text-sm">{block.categoryId ? "Category not found" : "No category selected"}</span>
      </div>
    );
  }

  const allAssets = getAssets(category.id);
  const visibleAssets = showInternal ? allAssets : allAssets.filter((a) => a.visibility !== "internal");

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <FolderOpen size={14} className="text-[#686868]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#ececec]">{category.name}</p>
            <p className="text-[10px] text-[#444]">{visibleAssets.length} assets · {brand.name}</p>
          </div>
        </div>
        <Link
          href={portalPath(`/${brand.slug}/${category.slug}`)}
          className="text-xs text-[#555] hover:text-[#ececec] transition-colors font-semibold"
        >
          View all
        </Link>
      </div>

      {/* Asset grid */}
      {visibleAssets.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-[#444]">No assets in this category yet</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.04]">
          {visibleAssets.slice(0, 6).map((asset) => (
            <div key={asset.id} className="bg-[#111] p-3 group/asset">
              <div className="aspect-square rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04] mb-2">
                <FadeImg
                  src={asset.previewImage || publicPath("/placeholder-asset.png")}
                  fallbackSrc={publicPath("/placeholder-asset.png")}
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/asset:scale-105"
                />
              </div>
              <p className="text-xs font-semibold text-[#d0d0d0] truncate">{asset.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#444]">{asset.fileType}</span>
                <a href={asset.downloadUrl || "#"} className="text-[#444] hover:text-[#ececec] transition-colors" title="Download">
                  <Download size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleAssets.length > 6 && (
        <div className="px-5 py-2.5 border-t border-white/[0.04] text-center">
          <Link
            href={portalPath(`/${brand.slug}/${category.slug}`)}
            className="text-xs text-[#555] hover:text-[#ececec] transition-colors font-semibold"
          >
            +{visibleAssets.length - 6} more assets
          </Link>
        </div>
      )}
    </div>
  );
}
