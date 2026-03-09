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
      className="block border border-[#333] rounded-lg overflow-hidden hover:border-[#555] transition-colors bg-[#242424]"
    >
      <div className="h-36 flex items-center justify-center p-6 bg-[#1e1e1e]">
        <img
          src={publicPath(`/${brand.slug}-wordmark.png`)}
          alt={brand.name}
          className="w-full h-full object-contain"
        />
      </div>
    </Link>
  );
}
