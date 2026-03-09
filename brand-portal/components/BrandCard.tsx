import Link from "next/link";
import type { Brand } from "@/lib/types";

const logoHeight: Record<string, string> = {
  easygo: "h-[30px]",
  stake:  "h-[37px]",
  kick:   "h-[29px]",
  moon:   "h-[29px]",
};

export default function BrandCard({ brand }: { brand: Brand }) {
  const height = logoHeight[brand.slug] ?? "h-8";
  return (
    <Link
      href={`/${brand.slug}`}
      className="block border border-[#333] rounded-lg overflow-hidden hover:border-[#555] transition-colors bg-[#242424]"
    >
      <div className="h-36 flex items-center justify-center px-8 bg-[#1e1e1e]">
        <img
          src={`/${brand.slug}-wordmark.svg`}
          alt={brand.name}
          className={`${height} w-auto max-w-[80%] object-contain`}
        />
      </div>
    </Link>
  );
}
