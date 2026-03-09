"use client";

import Link from "next/link";
import { brands } from "@/data/mock-data";
import { publicPath } from "@/lib/public-path";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { usePortal } from "@/lib/portal-context";

export default function AllBrandsPage() {
  const { portalPath } = usePortal();

  return (
    <main className="flex flex-col min-h-[calc(100vh-57px)]">
      {/* Hero — centred search */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 pt-4 pb-12">
        <img
          src={publicPath("/atlas-wordmark.svg")}
          alt="Atlas"
          className="h-12 w-auto mb-12 opacity-90"
        />
        <div className="w-full max-w-2xl">
          <SearchBar large placeholder="Find what you need across any brand…" />
        </div>

        {/* Brand quick-access — card images */}
        <div className="mt-5 w-full max-w-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={portalPath(`/${brand.slug}`)}
                className="group relative rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a] transition-colors overflow-hidden aspect-[4/3]"
              >
                <img
                  src={publicPath(`/${brand.slug}-card.png`)}
                  alt={brand.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
