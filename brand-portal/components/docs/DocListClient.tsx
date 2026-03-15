"use client";

import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import DocPageCard from "./DocPageCard";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { getBrandBySlug } from "@/data/mock-data";

interface DocListClientProps {
  brandSlug: string;
}

export default function DocListClient({ brandSlug }: DocListClientProps) {
  const { getDocPages, addDocPage, editMode } = useEditStore();
  const { portalPath, showInternal, canEdit, mode } = usePortal();
  const isPublic = mode === "public";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const brand = getBrandBySlug(brandSlug);

  if (!mounted || !brand) {
    return (
      <main>
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse mb-8" />
        </div>
      </main>
    );
  }

  const docPages = getDocPages(brand.id);
  const visiblePages = showInternal
    ? docPages
    : docPages.filter((d) => d.visibility !== "internal");

  return (
    <main>
      <Breadcrumb
        crumbs={[
          ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
          { label: brand.name, href: portalPath(`/${brand.slug}`) },
          { label: "Documentation" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-8 py-12 [animation:fade-in_0.3s_ease-out_forwards]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-[#ececec]">Documentation</h1>
            <p className="text-sm text-[#686868] mt-1">{visiblePages.length} pages</p>
          </div>
        </div>

        {visiblePages.length === 0 && !editMode ? (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-[#222] mb-4" />
            <p className="text-[#555] text-sm">No documentation pages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePages.map((docPage, i) => (
              <div
                key={docPage.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className="[animation:fade-up_0.3s_ease-out_forwards] opacity-0"
              >
                <DocPageCard docPage={docPage} brandSlug={brandSlug} />
              </div>
            ))}
          </div>
        )}

        {editMode && canEdit && (
          <button
            onClick={() => addDocPage(brand.id)}
            className="mt-6 flex items-center gap-2 text-sm text-[#484848] hover:text-[#888] border border-dashed border-white/[0.06] hover:border-white/[0.12] rounded-xl px-5 py-3 transition-all duration-200 w-full justify-center"
          >
            <Plus size={15} />
            Add documentation page
          </button>
        )}
      </div>
    </main>
  );
}
