"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, FolderOpen, Palette, FileText, BookOpen, X, Download, Eye, Copy, Check } from "lucide-react";
import { brands } from "@/data/mock-data";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { parseBrandSlug } from "@/lib/parse-brand-slug";

interface CategoryResult {
  type: "category";
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  brandColor: string;
  categorySlug: string;
  assetCount: number;
  categoryType?: string;
}

interface AssetResult {
  type: "asset";
  id: string;
  name: string;
  description: string;
  fileType: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  categoryName: string;
  downloadUrl: string;
  actionType: "download" | "view";
  tags?: string[];
}

interface ColourResult {
  type: "colour";
  id: string;
  name: string;
  hex: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  categoryId: string;
}

interface DocPageResult {
  type: "docpage";
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  docSlug: string;
}

type SearchItem = CategoryResult | AssetResult | ColourResult | DocPageResult;

export default function SearchBar({ large = false, placeholder: placeholderOverride }: { large?: boolean; placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { editMode, getCategories, getAssets, getColours, getDocPages } = useEditStore();
  const { brandScope, showInternal, portalPath, mode } = usePortal();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [copiedColourId, setCopiedColourId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lockedBrandId = useMemo(
    () => (brandScope ? brands.find((b) => b.slug === brandScope)?.id ?? null : null),
    [brandScope]
  );

  const pathBrandId = useMemo(() => {
    if (lockedBrandId) return lockedBrandId;
    const slug = parseBrandSlug(pathname);
    return slug ? brands.find((b) => b.slug === slug)?.id ?? null : null;
  }, [pathname, lockedBrandId]);

  useEffect(() => {
    setSelectedBrandId(pathBrandId);
  }, [pathBrandId]);

  const availableBrands = useMemo(
    () => (lockedBrandId ? brands.filter((b) => b.id === lockedBrandId) : brands),
    [lockedBrandId]
  );

  useEffect(() => {
    if (!query || lockedBrandId) return;
    const words = query.trim().split(/\s+/);

    const matched = availableBrands.find((b) => {
      const nameParts = b.name.toLowerCase().split(/\s+/);
      if (nameParts.length === 1) {
        return words.some((w) => w.toLowerCase() === nameParts[0]);
      }
      for (let i = 0; i <= words.length - nameParts.length; i++) {
        if (nameParts.every((part, j) => words[i + j].toLowerCase() === part)) return true;
      }
      return false;
    });

    if (matched && selectedBrandId !== matched.id) {
      setSelectedBrandId(matched.id);
      const nameParts = matched.name.toLowerCase().split(/\s+/);
      let remaining = [...words];
      if (nameParts.length === 1) {
        remaining = remaining.filter((w) => w.toLowerCase() !== nameParts[0]);
      } else {
        for (let i = 0; i <= remaining.length - nameParts.length; i++) {
          if (nameParts.every((part, j) => remaining[i + j].toLowerCase() === part)) {
            remaining.splice(i, nameParts.length);
            break;
          }
        }
      }
      setQuery(remaining.join(" "));
    }
  }, [query, availableBrands, lockedBrandId, selectedBrandId]);

  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    const brandsToIndex = lockedBrandId
      ? brands.filter((b) => b.id === lockedBrandId)
      : brands;

    for (const brand of brandsToIndex) {
      const brandCategories = getCategories(brand.id);

      for (const cat of brandCategories) {
        if (!showInternal && cat.visibility === "internal") continue;

        if (cat.categoryType === "colours") {
          items.push({
            type: "category",
            id: cat.id,
            name: cat.name,
            description: cat.description,
            brandId: brand.id,
            brandName: brand.name,
            brandSlug: brand.slug,
            brandColor: brand.color,
            categorySlug: cat.slug,
            assetCount: 0,
            categoryType: "colours",
          });
          const catColours = getColours(cat.id);
          for (const colour of catColours) {
            items.push({
              type: "colour",
              id: colour.id,
              name: colour.name,
              hex: colour.hex,
              brandId: brand.id,
              brandName: brand.name,
              brandSlug: brand.slug,
              categorySlug: cat.slug,
              categoryId: cat.id,
            });
          }
        } else {
          const catAssets = getAssets(cat.id);
          const visibleAssets = catAssets.filter(
            (a) => showInternal || a.visibility !== "internal"
          );

          items.push({
            type: "category",
            id: cat.id,
            name: cat.name,
            description: cat.description,
            brandId: brand.id,
            brandName: brand.name,
            brandSlug: brand.slug,
            brandColor: brand.color,
            categorySlug: cat.slug,
            assetCount: visibleAssets.length,
          });

          for (const asset of visibleAssets) {
            items.push({
              type: "asset",
              id: asset.id,
              name: asset.name,
              description: asset.description,
              fileType: asset.fileType,
              brandId: brand.id,
              brandName: brand.name,
              brandSlug: brand.slug,
              categorySlug: cat.slug,
              categoryName: cat.name,
              downloadUrl: asset.downloadUrl,
              actionType: asset.actionType ?? "download",
              tags: asset.tags,
            });
          }
        }
      }

      // Doc pages
      const docPages = getDocPages(brand.id);
      for (const doc of docPages) {
        if (!showInternal && doc.visibility === "internal") continue;
        items.push({
          type: "docpage",
          id: doc.id,
          name: doc.title,
          description: doc.description,
          brandId: brand.id,
          brandName: brand.name,
          brandSlug: brand.slug,
          docSlug: doc.slug,
        });
      }
    }
    return items;
  }, [editMode, showInternal, lockedBrandId, getCategories, getAssets, getColours, getDocPages]);

  const results = useMemo<{ categories: CategoryResult[]; assets: AssetResult[]; colours: ColourResult[]; docPages: DocPageResult[] }>(() => {
    const q = query.trim().toLowerCase();
    const showAll = !q && !!selectedBrandId;

    if (!q && !showAll) return { categories: [], assets: [], colours: [], docPages: [] };

    const filtered = searchIndex.filter((item) => {
      if (selectedBrandId && item.brandId !== selectedBrandId) return false;
      if (!q) return item.type === "category" || item.type === "docpage";
      const haystack = [
        item.name,
        item.type === "colour" ? item.hex : "",
        item.brandName,
        item.type === "asset" ? item.fileType : "",
        item.type === "asset" ? item.categoryName : "",
        item.type === "asset" && item.tags ? item.tags.join(" ") : "",
        item.type === "docpage" ? item.description : "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return {
      categories: filtered.filter((i): i is CategoryResult => i.type === "category").slice(0, 5),
      assets: filtered.filter((i): i is AssetResult => i.type === "asset").slice(0, 8),
      colours: filtered.filter((i): i is ColourResult => i.type === "colour").slice(0, 6),
      docPages: filtered.filter((i): i is DocPageResult => i.type === "docpage").slice(0, 5),
    };
  }, [query, selectedBrandId, searchIndex]);

  const hasResults = results.categories.length > 0 || results.assets.length > 0 || results.colours.length > 0 || results.docPages.length > 0;
  const showPanel = open && (query.trim().length > 0 || !!selectedBrandId || !!pathBrandId);

  const navigate = useCallback(
    (path: string) => {
      setQuery("");
      setOpen(false);
      router.push(portalPath(path));
    },
    [router, portalPath]
  );

  const copyColourHex = useCallback((id: string, hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedColourId(id);
    setTimeout(() => setCopiedColourId(null), 1500);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedBrandId(pathBrandId);
  }, [pathBrandId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSearch();
      inputRef.current?.blur();
    }
    if (e.key === "Backspace" && !query && selectedBrandId && !lockedBrandId) {
      setSelectedBrandId(null);
    }
  };

  const selectedBrand = selectedBrandId ? availableBrands.find((b) => b.id === selectedBrandId) : null;

  const placeholder = placeholderOverride ?? (
    mode === "public" && brandScope
      ? `Search ${brandScope.charAt(0).toUpperCase() + brandScope.slice(1)}...`
      : "Search assets, categories..."
  );

  return (
    <div ref={containerRef} className={`relative w-full ${large ? "max-w-none" : "max-w-lg"}`}>
      <div
        className={`flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] focus-within:border-white/[0.12] focus-within:bg-white/[0.06] transition-all duration-200 ${
          large ? "rounded-2xl px-5 py-4" : "rounded-xl px-3.5 py-2.5"
        }`}
      >
        <Search
          size={large ? 16 : 14}
          className="shrink-0 text-[#555] pointer-events-none"
        />

        {selectedBrand && !lockedBrandId && open && (
          <span className="inline-flex items-center gap-1 shrink-0 bg-[#f77614] text-white rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {selectedBrand.name}
            <button
              onClick={() => { setSelectedBrandId(null); inputRef.current?.focus(); }}
              className="hover:opacity-75 transition-opacity"
              aria-label="Remove brand filter"
            >
              <X size={10} />
            </button>
          </span>
        )}

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (!open) setSelectedBrandId(pathBrandId); setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={selectedBrand ? `Search in ${selectedBrand.name}...` : placeholder}
          className={`flex-1 bg-transparent text-[#f0f0f0] placeholder-[#3a3a3a] focus:outline-none ${
            large ? "text-base" : "text-sm"
          }`}
        />

        {(query || (selectedBrand && !lockedBrandId && open)) && (
          <button
            onClick={() => { setQuery(""); if (!lockedBrandId) setSelectedBrandId(null); inputRef.current?.focus(); }}
            className="shrink-0 text-[#555] hover:text-[#888] transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] z-50 overflow-hidden [animation:fade-up_0.15s_ease-out_forwards]">
          {!lockedBrandId && !selectedBrandId && (
            <div className="flex gap-1.5 px-3.5 pt-3.5 pb-2.5 border-b border-white/[0.05] flex-wrap">
              <button
                onClick={() => setSelectedBrandId(null)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                  !selectedBrandId
                    ? "bg-[#f77614] text-white shadow-[0_0_12px_rgba(247,118,20,0.3)]"
                    : "bg-white/[0.04] text-[#888] hover:bg-white/[0.08]"
                }`}
              >
                All
              </button>
              {availableBrands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBrandId(b.id); setQuery(""); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all duration-200 bg-white/[0.04] text-[#888] hover:bg-white/[0.08]"
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}

          <div className="max-h-[min(280px,40vh)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a] [&::-webkit-scrollbar-thumb]:rounded-full">
            {!hasResults && (
              <div className="px-4 py-8 text-center text-sm text-[#505050]">
                {query ? `No results for "${query}"` : "No categories found"}
              </div>
            )}

            {/* Categories */}
            {results.categories.length > 0 && (
              <div>
                <div className="px-4 pt-3.5 pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#505050]">
                    Categories
                  </span>
                </div>
                {results.categories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/${item.categorySlug}`)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      {item.categoryType === "colours"
                        ? <Palette size={14} className="text-[#686868]" />
                        : <FolderOpen size={14} className="text-[#686868]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#f0f0f0] truncate">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[#555] font-semibold">
                          {item.categoryType === "colours" ? "Palette" : "Category"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#555] truncate">
                          {item.brandName}{item.categoryType !== "colours" ? ` · ${item.assetCount} assets` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Colours */}
            {results.colours.length > 0 && (
              <div>
                <div className="px-4 pt-3.5 pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#505050]">
                    Colours
                  </span>
                </div>
                {results.colours.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/${item.categorySlug}`)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                  >
                    <div
                      className="shrink-0 w-8 h-8 rounded-lg border border-white/[0.07]"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#d0d0d0] truncate">{item.name}</span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[#555] font-semibold">
                          Colour
                        </span>
                      </div>
                      <span className="text-xs text-[#555]">
                        {item.brandName} · <span className="font-mono">{item.hex}</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => copyColourHex(item.id, item.hex, e)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06] text-[#555] hover:text-[#f0f0f0] transition-all duration-200"
                      title="Copy hex"
                    >
                      {copiedColourId === item.id ? (
                        <Check size={13} className="text-green-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Doc Pages */}
            {results.docPages.length > 0 && (
              <div>
                <div className="px-4 pt-3.5 pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#505050]">
                    Documentation
                  </span>
                </div>
                {results.docPages.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/docs/${item.docSlug}`)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <BookOpen size={14} className="text-[#686868]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#f0f0f0] truncate">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[#555] font-semibold">
                          Doc
                        </span>
                      </div>
                      <span className="text-xs text-[#555] truncate block">
                        {item.brandName}
                        {item.description ? ` · ${item.description}` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assets */}
            {results.assets.length > 0 && (
              <div>
                <div className="px-4 pt-3.5 pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#505050]">
                    Assets
                  </span>
                </div>
                {results.assets.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/${item.categorySlug}`)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <FileText size={13} className="text-[#555]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#d0d0d0] truncate">{item.name}</span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[#555] font-semibold">
                          Asset
                        </span>
                      </div>
                      <span className="text-xs text-[#555] truncate block">
                        {item.categoryName} / {item.brandName}
                        {item.fileType ? ` · ${item.fileType}` : ""}
                      </span>
                    </div>
                    <a
                      href={item.downloadUrl}
                      target={item.actionType === "view" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06] text-[#555] hover:text-[#f0f0f0] transition-all duration-200"
                      title={item.actionType === "view" ? "View" : "Download"}
                    >
                      {item.actionType === "view" ? (
                        <Eye size={14} />
                      ) : (
                        <Download size={14} />
                      )}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasResults && (
            <div className="px-4 py-2.5 border-t border-white/[0.05] text-[10px] text-[#333] text-right">
              Press <kbd className="bg-white/[0.04] border border-white/[0.07] rounded px-1.5 py-0.5 font-mono text-[#555]">Esc</kbd> to close
            </div>
          )}
        </div>
      )}
    </div>
  );
}
