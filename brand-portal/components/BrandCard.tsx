import Link from "next/link";
import type { Brand } from "@/lib/types";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/${brand.slug}`}
      className="block border border-[#333] rounded-lg overflow-hidden hover:border-[#555] transition-colors bg-[#242424]"
    >
      <div className="h-32 flex items-center justify-center px-8 bg-[#1e1e1e]">
        <img
          src={`/${brand.slug}-wordmark.svg`}
          alt={brand.name}
          className="h-8 w-auto max-w-[80%] object-contain"
        />
      </div>
    </Link>
  );
}
