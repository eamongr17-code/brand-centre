import { Download, Eye } from "lucide-react";
import {
  brands,
  categories,
  getBrandBySlug,
  getAssetsForCategory,
  getColoursForCategory,
} from "@/data/mock-data";

export function generateStaticParams() {
  return categories.map((cat) => {
    const brand = brands.find((b) => b.id === cat.brandId);
    return { brand: brand?.slug ?? "", category: cat.slug };
  });
}

export default async function EmbedCategoryPage({
  params,
}: {
  params: Promise<{ brand: string; category: string }>;
}) {
  const { brand: brandSlug, category: categorySlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const category = brand
    ? categories.find((c) => c.brandId === brand.id && c.slug === categorySlug)
    : undefined;

  if (!brand || !category) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <p className="text-[#555] text-sm">Category not found.</p>
      </div>
    );
  }

  const isColours = category.categoryType === "colours";
  const assets = isColours ? [] : getAssetsForCategory(category.id).filter((a) => a.visibility !== "internal");
  const colours = isColours ? getColoursForCategory(category.id) : [];

  return (
    <div className="min-h-screen bg-[#111] text-[#e8e8e8] font-sans">
      {/* Header */}
      <div
        className="border-b border-[#1e1e1e] px-6 py-4"
        style={{ borderTopColor: brand.color, borderTopWidth: 2 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#555] uppercase tracking-widest">{brand.name}</span>
          <span className="text-[#333]">/</span>
          <span className="text-sm font-semibold text-[#e8e8e8]">{category.name}</span>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Assets grid */}
        {!isColours && assets.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {assets.map((asset) => {
              const isView = (asset.actionType ?? "download") === "view";
              return (
                <div key={asset.id} className="bg-[#161616] border border-[#222] rounded-lg overflow-hidden flex flex-col">
                  <div className="h-28 bg-[#1a1a1a] flex items-center justify-center">
                    {asset.previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset.previewImage} alt={asset.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-[#252525]" />
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <p className="text-xs font-medium text-[#e8e8e8] leading-snug">{asset.name}</p>
                    {asset.rules && asset.rules.length > 0 && (
                      <ul className="space-y-0.5">
                        {asset.rules.map((rule, i) => (
                          <li key={i} className="flex gap-1 text-[10px] text-[#666] leading-snug">
                            <span className="shrink-0 text-[#444]">—</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#555]">{asset.fileType}</span>
                      <a
                        href={asset.downloadUrl}
                        target={isView ? "_blank" : undefined}
                        rel={isView ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-white text-black px-2 py-1 rounded hover:opacity-80 transition-opacity"
                      >
                        {isView ? <Eye size={10} /> : <Download size={10} />}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Colours grid */}
        {isColours && colours.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {colours.map((colour) => (
              <div key={colour.id} className="bg-[#161616] border border-[#222] rounded-lg overflow-hidden">
                <div className="h-16" style={{ backgroundColor: colour.hex }} />
                <div className="p-3">
                  <p className="text-xs font-medium text-[#e8e8e8]">{colour.name}</p>
                  <p className="text-[10px] text-[#555] font-mono mt-0.5">{colour.hex}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {assets.length === 0 && colours.length === 0 && (
          <p className="text-sm text-[#555]">No assets in this category.</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1a1a1a] mt-4">
        <p className="text-[10px] text-[#333]">Brand Centre</p>
      </div>
    </div>
  );
}
