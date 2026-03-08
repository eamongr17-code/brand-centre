import { notFound } from "next/navigation";
import HeroHeader from "@/components/HeroHeader";
import CategoryGrid from "@/components/CategoryGrid";
import SubBrandSection from "@/components/SubBrandSection";
import QuickLinksPanel from "@/components/QuickLinksPanel";
import {
  brands,
  getBrandBySlug,
  getCategoriesForBrand,
  getSubBrandsForBrand,
} from "@/data/mock-data";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const categories = getCategoriesForBrand(brand.id);
  const subBrands = getSubBrandsForBrand(brand.id);

  return (
    <main>
      <HeroHeader variant="brand" brand={brand} />
      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-16">
          {categories.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#e8e8e8] mb-6">Categories</h2>
              <CategoryGrid
                brandSlug={brand.slug}
                brandId={brand.id}
              />
            </section>
          )}

          {subBrands.map((subBrand) => (
            <SubBrandSection
              key={subBrand.id}
              subBrand={subBrand}
              brandSlug={brand.slug}
            />
          ))}
        </div>

        {/* Sidebar */}
        <QuickLinksPanel brandId={brand.id} />

      </div>
    </main>
  );
}
