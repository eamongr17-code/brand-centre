"use client";

import Link from "next/link";
import { brands } from "@/data/mock-data";
import { publicPath } from "@/lib/public-path";
import SearchBar from "@/components/SearchBar";
import FadeImg from "@/components/FadeImg";
import { usePortal } from "@/lib/portal-context";

export default function AllBrandsPage() {
  const { portalPath } = usePortal();

  return (
    <main className="flex flex-col min-h-[calc(100vh-57px)] [animation:fade-in_0.4s_ease-out_forwards] relative">
      {/* Subtle radial glow behind hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(247,118,20,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center justify-center flex-1 px-8 pt-4 pb-16 relative z-10">
        <img
          src={publicPath("/atlas-wordmark.svg")}
          alt="Atlas"
          className="h-12 w-auto mb-14 opacity-90"

        />
        <div className="w-full max-w-2xl">
          <SearchBar large placeholder="Find what you need across any brand..." />
        </div>

        {/* Brand quick-access */}
        <div className="mt-6 w-full max-w-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={portalPath(`/${brand.slug}`)}
                className="group relative rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 overflow-hidden aspect-[2/1] hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <FadeImg
                  src={publicPath(`/${brand.slug}-card.png`)}
                  alt={brand.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
