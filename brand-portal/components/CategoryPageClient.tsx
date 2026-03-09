"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
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
  const { getCategoryBySlug, getAssets, getColours } = useEditStore();
  const { portalPath, showInternal, mode } = usePortal();
  const isPublic = mode === "public";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const brand = getBrandBySlug(brandSlug);

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

  const category = getCategoryBySlug(brand.id, categorySlug);

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-[#e8e8e8]">{category.name}</h1>
          <p className="text-sm text-[#888]">
            {isColours ? "Colour palette" : `${liveCount} assets`}
          </p>
          {!isColours && category.downloadAllUrl && category.downloadAllUrl !== "#" && (
            <a
              href={category.downloadAllUrl}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-white text-black px-4 py-2 rounded hover:opacity-80 active:scale-95 transition-all duration-150"
              title="Download All"
            >
              <Download size={14} />
            </a>
          )}
        </div>
        {isColours
          ? <ColourGrid categoryId={category.id} />
          : <AssetGrid categoryId={category.id} />}
      </div>
    </main>
  );
}
