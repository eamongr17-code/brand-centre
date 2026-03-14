"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Eye, Code2, Check, Loader } from "lucide-react";
import { zipSync } from "fflate";
import Breadcrumb from "@/components/Breadcrumb";
import AssetGrid from "@/components/AssetGrid";
import ColourGrid from "@/components/ColourGrid";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { getBrandBySlug } from "@/data/mock-data";

interface CategoryPageClientProps {
  brandSlug: string;
  categorySlug: string;
}

export default function CategoryPageClient({ brandSlug, categorySlug }: CategoryPageClientProps) {
  const { getCategoryBySlug, getAssets, getColours, editMode } = useEditStore();
  const { portalPath, showInternal, mode } = usePortal();
  const isPublic = mode === "public";
  const [mounted, setMounted] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!embedOpen) return;
    const handler = (e: MouseEvent) => {
      if (embedRef.current && !embedRef.current.contains(e.target as Node)) {
        setEmbedOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [embedOpen]);

  const brand = getBrandBySlug(brandSlug);
  const category = mounted && brand ? getCategoryBySlug(brand.id, categorySlug) : undefined;

  if (!mounted || !brand) {
    return (
      <main>
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse mb-8" />
        </div>
      </main>
    );
  }

  if (!category) {
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
          <p className="text-[#686868]">Category not found.</p>
        </div>
      </main>
    );
  }

  const isColours = category.categoryType === "colours";
  const allAssets = getAssets(category.id);
  const visibleAssets = showInternal ? allAssets : allAssets.filter((a) => a.visibility !== "internal");
  const liveCount = isColours
    ? getColours(category.id).length
    : visibleAssets.length;

  const handleDownloadAll = async () => {
    if (zipping || visibleAssets.length === 0) return;
    setZipping(true);
    try {
      const files: Record<string, Uint8Array> = {};
      const seen = new Set<string>();
      await Promise.all(
        visibleAssets
          .filter((a) => a.downloadUrl && a.downloadUrl !== "#")
          .map(async (a) => {
            try {
              const res = await fetch(a.downloadUrl);
              const buf = new Uint8Array(await res.arrayBuffer());
              const ext = a.downloadUrl.split(".").pop()?.split("?")[0] || "bin";
              let name = (a.name || "asset").replace(/[^a-z0-9.\-_ ]/gi, "_");
              if (!name.includes(".")) name = `${name}.${ext}`;
              while (seen.has(name)) name = `_${name}`;
              seen.add(name);
              files[name] = buf;
            } catch {}
          })
      );
      if (Object.keys(files).length === 0) return;
      const zipped = zipSync(files, { level: 0 });
      const blob = new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${category.name || "assets"}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  return (
    <main>
      <Breadcrumb
        crumbs={[
          ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
          { label: brand.name, href: portalPath(`/${brand.slug}`) },
          { label: category.name },
        ]}
      />
      <div className="max-w-6xl mx-auto px-8 py-12 [animation:fade-in_0.3s_ease-out_forwards]">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#ececec]">{category.name}</h1>
            {!isColours && category.actionType !== "view" && (
              <p className="text-sm text-[#686868] mt-1">{liveCount} assets</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Embed button */}
            <div className="relative" ref={embedRef}>
              <button
                onClick={() => setEmbedOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-white/[0.06] text-[#686868] hover:text-[#ececec] hover:border-white/[0.12] px-3 py-2 rounded-lg transition-all duration-200"
                title="Get embed code"
              >
                <Code2 size={13} />
                Embed
              </button>
              {embedOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#161616]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] p-4 z-50 [animation:fade-up_0.15s_ease-out_forwards]">
                  <p className="text-xs font-semibold text-[#ececec] mb-2">Embed this category</p>
                  <p className="text-[11px] text-[#555] mb-3">Paste into Notion, Confluence, or any tool that supports iframes.</p>
                  <code className="block text-[10px] bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2.5 text-[#686868] break-all leading-relaxed select-all font-mono">
                    {`<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/embed/${brandSlug}/${categorySlug}" width="100%" height="600" frameborder="0" style="border-radius:8px"></iframe>`}
                  </code>
                  <button
                    onClick={() => {
                      const code = `<iframe src="${window.location.origin}/embed/${brandSlug}/${categorySlug}" width="100%" height="600" frameborder="0" style="border-radius:8px"></iframe>`;
                      navigator.clipboard.writeText(code).then(() => {
                        setEmbedCopied(true);
                        setTimeout(() => setEmbedCopied(false), 2000);
                      });
                    }}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    {embedCopied ? <><Check size={11} /> Copied</> : "Copy code"}
                  </button>
                </div>
              )}
            </div>
            {/* View / Download all */}
            {!isColours && (category.actionType === "view"
              ? (category.downloadAllUrl && category.downloadAllUrl !== "#" && (
                  <a
                    href={category.downloadAllUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
                    title="View"
                  >
                    <Eye size={14} />
                    View
                  </a>
                ))
              : (visibleAssets.length > 0 && (
                  category.downloadAllUrl && category.downloadAllUrl !== "#" ? (
                    <a
                      href={category.downloadAllUrl}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
                      title="Download All"
                    >
                      <Download size={14} />
                      Download all
                    </a>
                  ) : (
                    <button
                      onClick={handleDownloadAll}
                      disabled={zipping}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200 disabled:opacity-60"
                      title="Download all assets as ZIP"
                    >
                      {zipping ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
                      {zipping ? "Zipping..." : "Download all"}
                    </button>
                  )
                ))
            )}
          </div>
        </div>

        {category.actionType === "view" ? (
          category.downloadAllUrl && category.downloadAllUrl !== "#" && (
            <div className="mt-4">
              {category.description && (
                <p className="text-sm text-[#787878] mb-6 leading-relaxed">{category.description}</p>
              )}
              <a
                href={category.downloadAllUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
              >
                <Eye size={15} />
                Open document
              </a>
            </div>
          )
        ) : isColours
          ? <ColourGrid categoryId={category.id} />
          : <AssetGrid categoryId={category.id} />}
      </div>
    </main>
  );
}
