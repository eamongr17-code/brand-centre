"use client";

import { useState, useEffect } from "react";
import { Download, Eye, Share2, Check } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import FadeImg from "@/components/FadeImg";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { getBrandBySlug } from "@/data/mock-data";
import { publicPath } from "@/lib/public-path";
import { timeAgo } from "@/lib/utils";

interface AssetDetailViewProps {
  brandSlug: string;
  categorySlug: string;
  assetId: string;
}

export default function AssetDetailView({ brandSlug, categorySlug, assetId }: AssetDetailViewProps) {
  const { getCategoryBySlug, getAssets } = useEditStore();
  const { portalPath, showInternal, mode } = usePortal();
  const isPublic = mode === "public";
  const [mounted, setMounted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const brand = getBrandBySlug(brandSlug);
  const category = mounted && brand ? getCategoryBySlug(brand.id, categorySlug) : undefined;
  const assets = category ? getAssets(category.id) : [];
  const asset = assets.find((a) => a.id === assetId);

  if (!mounted || !brand) {
    return (
      <main>
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse mb-8" />
        </div>
      </main>
    );
  }

  if (!category || !asset) {
    return (
      <main>
        <Breadcrumb
          crumbs={[
            ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
            { label: brand.name, href: portalPath(`/${brand.slug}`) },
            { label: "Not found" },
          ]}
        />
        <div className="max-w-6xl mx-auto px-8 py-12">
          <p className="text-[#686868]">Asset not found.</p>
        </div>
      </main>
    );
  }

  // Respect visibility
  if (!showInternal && asset.visibility === "internal") {
    return (
      <main>
        <Breadcrumb
          crumbs={[
            ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
            { label: brand.name, href: portalPath(`/${brand.slug}`) },
            { label: category.name, href: portalPath(`/${brandSlug}/${categorySlug}`) },
            { label: "Not available" },
          ]}
        />
        <div className="max-w-6xl mx-auto px-8 py-12">
          <p className="text-[#686868]">This asset is not publicly available.</p>
        </div>
      </main>
    );
  }

  const isView = (asset.actionType ?? "download") === "view";

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1500);
  };

  return (
    <main>
      <Breadcrumb
        crumbs={[
          ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
          { label: brand.name, href: portalPath(`/${brand.slug}`) },
          { label: category.name, href: portalPath(`/${brandSlug}/${categorySlug}`) },
          { label: asset.name },
        ]}
      />
      <div className="max-w-6xl mx-auto px-8 py-12 [animation:fade-in_0.3s_ease-out_forwards]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — Preview */}
          <div className="flex-1 min-w-0">
            <div className="glass-card rounded-2xl overflow-hidden">
              <FadeImg
                src={asset.previewImage || publicPath("/placeholder-asset.png")}
                fallbackSrc={publicPath("/placeholder-asset.png")}
                alt={asset.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>

          {/* Right — Details */}
          <div className="lg:w-80 xl:w-96 shrink-0 space-y-5">
            <div>
              <h1 className="text-xl font-bold text-[#ececec]">{asset.name}</h1>
              {asset.description && (
                <p className="text-sm text-[#787878] mt-2 leading-relaxed">{asset.description}</p>
              )}
            </div>

            {/* Tags */}
            {asset.tags && asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] text-[#686868] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#555]">Type</span>
                <span className="text-[#ececec] font-medium">{asset.fileType}</span>
              </div>
              {asset.fileSize && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#555]">Size</span>
                  <span className="text-[#ececec] font-medium">{asset.fileSize}</span>
                </div>
              )}
              {asset.lastEditedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#555]">Updated</span>
                  <span className="text-[#ececec] font-medium">{timeAgo(asset.lastEditedAt)}</span>
                </div>
              )}
            </div>

            {/* Usage rules */}
            {asset.rules && asset.rules.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.15em] mb-2">Usage rules</p>
                <ul className="space-y-1.5">
                  {asset.rules.map((rule, i) => (
                    <li key={i} className="flex gap-1.5 text-xs text-[#787878] leading-snug">
                      <span className="shrink-0 text-[#444]">—</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {isView ? (
                <a
                  href={asset.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white text-black px-4 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
                >
                  <Eye size={15} />
                  View
                </a>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(asset.downloadUrl);
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = asset.name || "download";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch {
                      window.open(asset.downloadUrl, "_blank");
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white text-black px-4 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
                >
                  <Download size={15} />
                  Download
                </button>
              )}
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold border border-white/[0.06] text-[#686868] hover:text-[#ececec] hover:border-white/[0.12] px-4 py-2.5 rounded-lg transition-all duration-200"
                title={shareCopied ? "Copied!" : "Copy link"}
              >
                {shareCopied ? <Check size={15} className="text-green-400" /> : <Share2 size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
