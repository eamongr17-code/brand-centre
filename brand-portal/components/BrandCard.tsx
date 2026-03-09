import Link from "next/link";
import type { Brand } from "@/lib/types";

// Height-constrained for compact logos; width-constrained for wide script logos
const logoClass: Record<string, string> = {
  easygo: "h-[34px] w-auto",
  stake:  "h-auto w-[74%]",
  kick:   "h-[18px] w-auto",
  moon:   "h-[28px] w-auto",
};

export default function BrandCard({ brand }: { brand: Brand }) {
  const cls = logoClass[brand.slug] ?? "h-8 w-auto";
  return (
    <Link
      href={`/${brand.slug}`}
      className="block border border-[#333] rounded-lg overflow-hidden hover:border-[#555] transition-colors bg-[#242424]"
    >
      <div className="h-36 flex items-center justify-center px-8 bg-[#1e1e1e]">
        <img
          src={`/${brand.slug}-wordmark.svg`}
          alt={brand.name}
          className={`${cls} max-w-[88%] object-contain`}
        />
      </div>
    </Link>
  );
}
