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
          className="h-7 w-auto mb-10 opacity-80"
        />
        <h1 className="text-[2rem] font-semibold text-[#e8e8e8] text-center mb-8 max-w-xl leading-snug">
          Find what you need<br />across any brand
        </h1>
        <div className="w-full max-w-2xl">
          <SearchBar large />
        </div>

        {/* Brand quick-access */}
        <div className="mt-12 w-full max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-4 text-center">
            Quick access
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={portalPath(`/${brand.slug}`)}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a] hover:bg-[#202020] transition-colors"
              >
                <div className="h-8 flex items-center justify-center w-full">
                  <img
                    src={publicPath(`/${brand.slug}-wordmark.png`)}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-[11px] text-[#555] group-hover:text-[#888] transition-colors font-medium">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
