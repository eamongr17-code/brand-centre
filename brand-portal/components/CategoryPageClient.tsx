"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Code2, Check, HelpCircle, ChevronDown, X } from "lucide-react";
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
  const { getCategoryBySlug, getAssets, getColours, updateCategory, editMode } = useEditStore();
  const { portalPath, showInternal, mode } = usePortal();
  const isPublic = mode === "public";
  const [mounted, setMounted] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);
  const [rulesLines, setRulesLines] = useState<string[]>([""]);
  const [showRules, setShowRules] = useState(false);

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

  // Sync rules inputs when category data changes (e.g. after localStorage hydration or save)
  useEffect(() => {
    if (category) setRulesLines([...(category.rules ?? []), ""]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id, (category?.rules ?? []).join("|")]);

  // Wait for client mount before reading localStorage-backed data
  if (!mounted || !brand) {
    return (
      <main>
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="h-8 w-48 bg-[#2d2d2d] rounded animate-pulse mb-8" />
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
          <p className="text-[#888]">Category not found.</p>
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

  return (
    <main>
      <Breadcrumb
        crumbs={[
          ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
          { label: brand.name, href: portalPath(`/${brand.slug}`) },
          { label: category.name },
        ]}
      />
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#e8e8e8]">{category.name}</h1>
            {!isColours && (
              <p className="text-sm text-[#888] mt-1">{liveCount} assets</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Embed button */}
            <div className="relative" ref={embedRef}>
              <button
                onClick={() => setEmbedOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-[#333] text-[#888] hover:text-[#e8e8e8] hover:border-[#555] px-3 py-2 rounded transition-colors"
                title="Get embed code"
              >
                <Code2 size={13} />
                Embed
              </button>
              {embedOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl p-4 z-50">
                  <p className="text-xs font-medium text-[#e8e8e8] mb-2">Embed this category</p>
                  <p className="text-[11px] text-[#666] mb-3">Paste into Notion, Confluence, or any tool that supports iframes.</p>
                  <code className="block text-[10px] bg-[#111] border border-[#2a2a2a] rounded px-3 py-2.5 text-[#888] break-all leading-relaxed select-all">
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
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-white text-black px-3 py-1.5 rounded hover:opacity-80 transition-opacity"
                  >
                    {embedCopied ? <><Check size={11} /> Copied</> : "Copy code"}
                  </button>
                </div>
              )}
            </div>
            {/* Download all */}
            {!isColours && (
              category.downloadAllUrl && category.downloadAllUrl !== "#" ? (
                <a
                  href={category.downloadAllUrl}
                  className="inline-flex items-center gap-1.5 text-sm font-medium bg-white text-black px-4 py-2 rounded hover:opacity-80 active:scale-95 transition-all duration-150"
                  title="Download All"
                >
                  <Download size={14} />
                  Download all
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium bg-[#2d2d2d] border border-[#3a3a3a] text-[#555] px-4 py-2 rounded cursor-not-allowed"
                  title="No download URL set"
                >
                  <Download size={14} />
                  Download all
                </span>
              )
            )}
          </div>
        </div>

        {/* Category rules */}
        {editMode ? (
          <div className="mb-8">
            <p className="text-xs font-medium text-[#666] mb-1.5 uppercase tracking-wide">Usage rules</p>
            <div className="space-y-1.5">
              {rulesLines.map((rule, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <input
                    value={rule}
                    onChange={(e) => {
                      const next = [...rulesLines];
                      next[i] = e.target.value;
                      if (i === rulesLines.length - 1 && e.target.value) next.push("");
                      setRulesLines(next);
                    }}
                    onBlur={() => updateCategory(category.id, { rules: rulesLines.filter(Boolean) })}
                    className="flex-1 bg-[#1e1e1e] border border-[#333] focus:border-[#555] rounded px-3 py-2 text-xs text-[#e8e8e8] placeholder-[#444] outline-none transition-colors"
                    placeholder={i === rulesLines.length - 1 ? (i === 0 ? "e.g. Always maintain minimum clear space" : "Add another rule…") : ""}
                  />
                  {rule !== "" && (
                    <button
                      onClick={() => {
                        const next = rulesLines.filter((_, j) => j !== i);
                        const withTrailing = next[next.length - 1] !== "" ? [...next, ""] : next;
                        const final = withTrailing.length ? withTrailing : [""];
                        setRulesLines(final);
                        updateCategory(category.id, { rules: next.filter(Boolean) });
                      }}
                      className="text-[#555] hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : category.rules && category.rules.length > 0 ? (
          <div className="mb-8">
            <button
              onClick={() => setShowRules((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-[#555] hover:text-[#888] transition-colors"
            >
              <HelpCircle size={13} />
              Usage rules
              <ChevronDown size={11} className={`transition-transform ${showRules ? "rotate-180" : ""}`} />
            </button>
            {showRules && (
              <ul className="mt-2 space-y-1.5 pl-1">
                {category.rules.map((rule, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#888] leading-snug">
                    <span className="mt-0.5 shrink-0 text-[#444]">—</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {isColours
          ? <ColourGrid categoryId={category.id} />
          : <AssetGrid categoryId={category.id} />}
      </div>
    </main>
  );
}
