import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AssetGrid from "@/components/AssetGrid";
import ColourGrid from "@/components/ColourGrid";
import {
  brands,
  categories,
  getBrandBySlug,
  getCategoryBySlug,
} from "@/data/mock-data";

export function generateStaticParams() {
  return categories.map((cat) => {
    const brand = brands.find((b) => b.id === cat.brandId);
    return { brand: brand?.slug ?? "", category: cat.slug };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ brand: string; category: string }>;
}) {
  const { brand: brandSlug, category: categorySlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const category = getCategoryBySlug(brand.id, categorySlug);
  if (!category) notFound();

  const isColours = category.categoryType === "colours";

  return (
    <main>
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: brand.name, href: `/${brand.slug}` },
          { label: category.name },
        ]}
      />
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-[#e8e8e8]">{category.name}</h1>
          <p className="text-sm text-[#888]">
            {isColours ? "Colour palette" : `${category.assetCount} assets`}
          </p>
          {!isColours && (
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
