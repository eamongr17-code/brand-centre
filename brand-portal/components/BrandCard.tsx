"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Link2, Check } from "lucide-react";
import type { Brand } from "@/lib/types";
import { usePortal } from "@/lib/portal-context";
import { publicPath } from "@/lib/public-path";

export default function BrandCard({ brand }: { brand: Brand }) {
  const { portalPath, mode } = usePortal();
  const [copied, setCopied] = useState(false);

  const showCopyLink = mode !== "public";

  const copyPublicLink = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/${brand.slug}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [brand.slug]);

  return (
    <div className="relative group">
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

      {/* Copy public link — internal/owner only */}
      {showCopyLink && (
        <button
          onClick={copyPublicLink}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded bg-[#1a1a1a] border border-[#333] text-[#888] hover:text-[#e8e8e8] hover:border-[#555]"
          title="Copy public link"
        >
          {copied ? (
            <>
              <Check size={10} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Link2 size={10} />
              Public link
            </>
          )}
        </button>
      )}
    </div>
  );
}
