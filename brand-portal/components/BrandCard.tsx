import Link from "next/link";
import type { Brand } from "@/lib/types";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/${brand.slug}`}
      className="block border border-[#333] rounded-lg overflow-hidden hover:border-[#555] transition-colors bg-[#242424]"
    >
      <div
        className="h-32 flex items-center justify-center"
        style={{ backgroundColor: brand.color + "22" }}
      >
        <span className="text-2xl font-bold text-[#e8e8e8]">{brand.name}</span>
      </div>
    </Link>
  );
}
