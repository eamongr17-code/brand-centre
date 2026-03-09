import CategoryPageClient from "@/components/CategoryPageClient";
import { brands, categories } from "@/data/mock-data";

export function generateStaticParams() {
  return categories.map((cat) => {
    const brand = brands.find((b) => b.id === cat.brandId);
    return { brand: brand?.slug ?? "", category: cat.slug };
  });
}

export default async function OwnerCategoryPage({
  params,
}: {
  params: Promise<{ brand: string; category: string }>;
}) {
  const { brand: brandSlug, category: categorySlug } = await params;
  return <CategoryPageClient brandSlug={brandSlug} categorySlug={categorySlug} />;
}
