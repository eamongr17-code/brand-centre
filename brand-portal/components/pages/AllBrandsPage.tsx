import HeroHeader from "@/components/HeroHeader";
import BrandCard from "@/components/BrandCard";
import { brands } from "@/data/mock-data";

export default function AllBrandsPage() {
  return (
    <main>
      <HeroHeader variant="home" />
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </main>
  );
}
