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
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="text-[#484848] text-sm">Category not found.</p>
      </div>
    );
  }

  const isColours = category.categoryType === "colours";
  const assets = isColours ? [] : getAssetsForCategory(category.id).filter((a) => a.visibility !== "internal");
  const colours = isColours ? getColoursForCategory(category.id) : [];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#ececec] font-['Urbanist',sans-serif]">
      {/* Header */}
      <div
        className="border-b border-white/[0.04] px-6 py-4"
        style={{ borderTopColor: brand.color, borderTopWidth: 2 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#484848] uppercase tracking-[0.15em]">{brand.name}</span>
          <span className="text-[#282828]">/</span>
          <span className="text-sm font-semibold text-[#ececec]">{category.name}</span>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Assets grid */}
        {!isColours && assets.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {assets.map((asset) => {
              const isView = (asset.actionType ?? "download") === "view";
              return (
                <div key={asset.id} className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden flex flex-col">
                  <div className="h-28 bg-white/[0.01] flex items-center justify-center">
                    {asset.previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset.previewImage} alt={asset.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04]" />
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <p className="text-xs font-semibold text-[#ececec] leading-snug">{asset.name}</p>
                    {asset.rules && asset.rules.length > 0 && (
                      <ul className="space-y-0.5">
                        {asset.rules.map((rule, i) => (
                          <li key={i} className="flex gap-1 text-[10px] text-[#555] leading-snug">
                            <span className="shrink-0 text-[#383838]">—</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#484848]">{asset.fileType}</span>
                      <a
                        href={asset.downloadUrl}
                        target={isView ? "_blank" : undefined}
                        rel={isView ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white text-black px-2 py-1 rounded-lg hover:bg-white/90 transition-colors"
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
              <div key={colour.id} className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
                <div className="h-16" style={{ backgroundColor: colour.hex }} />
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#ececec]">{colour.name}</p>
                  <p className="text-[10px] text-[#484848] font-mono mt-0.5">{colour.hex}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {assets.length === 0 && colours.length === 0 && (
          <p className="text-sm text-[#484848]">No assets in this category.</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/[0.03] mt-4">
        <p className="text-[10px] text-[#282828]">Brand Centre</p>
      </div>
    </div>
  );
}
