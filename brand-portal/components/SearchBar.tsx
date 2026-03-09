"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, FolderOpen, Palette, FileText, X, Download, Eye, Copy, Check } from "lucide-react";
import { brands, categories, assets } from "@/data/mock-data";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

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

type SearchItem = CategoryResult | AssetResult | ColourResult;

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { editMode, getCategories, getAssets, getColours } = useEditStore();
  const { brandScope, showInternal, portalPath, mode } = usePortal();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [copiedColourId, setCopiedColourId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // In public portal, always lock to the scoped brand
  const lockedBrandId = useMemo(
    () => (brandScope ? brands.find((b) => b.slug === brandScope)?.id ?? null : null),
    [brandScope]
  );

  // Derive brand from current path and sync the filter (only for non-scoped portals)
  const pathBrandId = useMemo(() => {
    if (lockedBrandId) return lockedBrandId;
    // Strip portal prefix before reading brand slug
    const segments = pathname.split("/").filter(Boolean);
    const slug =
      segments[0] === "owner" || segments[0] === "internal"
        ? segments[1]
        : segments[0];
    return brands.find((b) => b.slug === slug)?.id ?? null;
  }, [pathname, lockedBrandId]);

  useEffect(() => {
    setSelectedBrandId(pathBrandId);
  }, [pathBrandId]);

  // Brands available for filter chips — restricted to scoped brand in public portals
  const availableBrands = useMemo(
    () => (lockedBrandId ? brands.filter((b) => b.id === lockedBrandId) : brands),
    [lockedBrandId]
  );

  // Build search index: in edit mode use live data, otherwise use static data
  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    const brandsToIndex = lockedBrandId
      ? brands.filter((b) => b.id === lockedBrandId)
      : brands;

    for (const brand of brandsToIndex) {
      const brandCategories = editMode
        ? getCategories(brand.id)
        : categories.filter((c) => c.brandId === brand.id && !c.subBrandId);

      for (const cat of brandCategories) {
        // Filter internal categories in public portal
        if (!showInternal && cat.visibility === "internal") continue;

        if (cat.categoryType === "colours") {
          // Index the palette category itself so headings like "Brand Colours" are searchable
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
          // Also index individual colours
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
          const catAssets = editMode
            ? getAssets(cat.id)
            : assets.filter((a) => a.categoryId === cat.id);
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
            // already filtered above
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
            });
          }
        }
      }
    }
    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, showInternal, lockedBrandId]);

  const results = useMemo<{ categories: CategoryResult[]; assets: AssetResult[]; colours: ColourResult[] }>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { categories: [], assets: [], colours: [] };

    const filtered = searchIndex.filter((item) => {
      if (selectedBrandId && item.brandId !== selectedBrandId) return false;
      const haystack = [
        item.name,
        item.type === "colour" ? item.hex : "",
        item.type !== "colour" ? item.description : "",
        item.brandName,
        item.type === "asset" ? item.fileType : "",
        item.type === "asset" ? item.categoryName : "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return {
      categories: filtered.filter((i): i is CategoryResult => i.type === "category").slice(0, 5),
      assets: filtered.filter((i): i is AssetResult => i.type === "asset").slice(0, 8),
      colours: filtered.filter((i): i is ColourResult => i.type === "colour").slice(0, 6),
    };
  }, [query, selectedBrandId, searchIndex]);

  const hasResults = results.categories.length > 0 || results.assets.length > 0 || results.colours.length > 0;
  const showPanel = open && query.trim().length > 0;

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

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const placeholder =
    mode === "public" && brandScope
      ? `Search ${brandScope.charAt(0).toUpperCase() + brandScope.slice(1)}…`
      : "Search assets, categories…";

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      {/* Input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#2d2d2d] border border-[#444] rounded-lg pl-8 pr-8 py-2 text-sm text-[#e8e8e8] placeholder-[#555] focus:outline-none focus:border-[#666] transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#aaa] transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showPanel && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Brand filters — hidden when locked to one brand */}
          {!lockedBrandId && (
            <div className="flex gap-1.5 px-3 pt-3 pb-2 border-b border-[#2a2a2a] flex-wrap">
              <button
                onClick={() => setSelectedBrandId(null)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  !selectedBrandId
                    ? "bg-amber-500 text-white"
                    : "bg-[#2d2d2d] text-[#a0a0a0] hover:bg-[#333]"
                }`}
              >
                All
              </button>
              {availableBrands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrandId(selectedBrandId === b.id ? null : b.id)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    selectedBrandId === b.id
                      ? "bg-amber-500 text-white"
                      : "bg-[#2d2d2d] text-[#a0a0a0] hover:bg-[#333]"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}

          <div className="max-h-[420px] overflow-y-auto">
            {!hasResults && (
              <div className="px-4 py-6 text-center text-sm text-[#555]">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}

            {/* Categories */}
            {results.categories.length > 0 && (
              <div>
                <div className="px-3 pt-3 pb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                    Categories
                  </span>
                </div>
                {results.categories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/${item.categorySlug}`)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-md bg-[#2d2d2d] flex items-center justify-center">
                      {item.categoryType === "colours"
                        ? <Palette size={14} className="text-[#888]" />
                        : <FolderOpen size={14} className="text-[#888]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#e8e8e8] truncate">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[#2d2d2d] text-[#666] font-medium">
                          {item.categoryType === "colours" ? "Palette" : "Category"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#666] truncate">
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
                <div className="px-3 pt-3 pb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                    Colours
                  </span>
                </div>
                {results.colours.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/${item.categorySlug}`)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    <div
                      className="shrink-0 w-7 h-7 rounded-md border border-[#444]"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#d0d0d0] truncate">{item.name}</span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[#2d2d2d] text-[#666] font-medium">
                          Colour
                        </span>
                      </div>
                      <span className="text-xs text-[#555]">
                        {item.brandName} · <span className="font-mono">{item.hex}</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => copyColourHex(item.id, item.hex, e)}
                      className="shrink-0 p-1.5 rounded hover:bg-[#3a3a3a] text-[#555] hover:text-[#e8e8e8] transition-colors"
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

            {/* Assets */}
            {results.assets.length > 0 && (
              <div>
                <div className="px-3 pt-3 pb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                    Assets
                  </span>
                </div>
                {results.assets.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/${item.brandSlug}/${item.categorySlug}`)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-md bg-[#2d2d2d] flex items-center justify-center">
                      <FileText size={13} className="text-[#666]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#d0d0d0] truncate">{item.name}</span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[#2d2d2d] text-[#666] font-medium">
                          Asset
                        </span>
                      </div>
                      <span className="text-xs text-[#555] truncate block">
                        {item.categoryName} / {item.brandName}
                        {item.fileType ? ` · ${item.fileType}` : ""}
                      </span>
                    </div>
                    {/* Action icon */}
                    <a
                      href={item.downloadUrl}
                      target={item.actionType === "view" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 p-1.5 rounded hover:bg-[#3a3a3a] text-[#555] hover:text-[#e8e8e8] transition-colors"
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
            <div className="px-3 py-2 border-t border-[#2a2a2a] text-[10px] text-[#444] text-right">
              Press <kbd className="bg-[#2d2d2d] border border-[#3a3a3a] rounded px-1 py-0.5 font-mono">Esc</kbd> to close
            </div>
          )}
        </div>
      )}
    </div>
  );
}
