"use client";

import Link from "next/link";
import type { Brand } from "@/lib/types";
import { usePortal } from "@/lib/portal-context";
import { publicPath } from "@/lib/public-path";

export default function BrandCard({ brand }: { brand: Brand }) {
  const { portalPath } = usePortal();

  return (
    <Link
      href={portalPath(`/${brand.slug}`)}
      className="group block rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.02]"
    >
      <div className="h-36 flex items-center justify-center p-6 bg-white/[0.01]">
        <img
          src={publicPath(`/${brand.slug}-wordmark.png`)}
          alt={brand.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
