import { notFound } from "next/navigation";
import HeroHeader from "@/components/HeroHeader";
import BrandSections from "@/components/BrandSections";
import QuickLinksPanel from "@/components/QuickLinksPanel";
import { brands, getBrandBySlug } from "@/data/mock-data";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export default async function OwnerBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  return (
    <main>
      <HeroHeader variant="brand" brand={brand} />
      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 min-w-0">
          <BrandSections brandId={brand.id} brandSlug={brand.slug} />
        </div>
        <QuickLinksPanel brandId={brand.id} />
      </div>
    </main>
  );
}
