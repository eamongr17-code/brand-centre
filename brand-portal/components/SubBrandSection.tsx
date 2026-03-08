import CategoryGrid from "@/components/CategoryGrid";
import type { SubBrand } from "@/lib/types";

interface SubBrandSectionProps {
  subBrand: SubBrand;
  brandSlug: string;
}

export default function SubBrandSection({ subBrand, brandSlug }: SubBrandSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-[#e8e8e8]">{subBrand.name}</h2>
      </div>
      <CategoryGrid
        brandSlug={brandSlug}
        brandId={subBrand.parentBrandId}
        subBrandId={subBrand.id}
      />
    </section>
  );
}
