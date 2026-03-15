"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { usePortal } from "@/lib/portal-context";
import type { DocPage, DocBlock, HeadingBlock } from "@/lib/types";

interface DocSidebarProps {
  docPage: DocPage;
  allPages: DocPage[];
  brandSlug: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DocSidebar({ docPage, allPages, brandSlug }: DocSidebarProps) {
  const { portalPath } = usePortal();
  const [activeId, setActiveId] = useState<string>("");

  const headings = docPage.blocks
    .filter((b): b is HeadingBlock => b.type === "heading")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Track which section is currently visible via IntersectionObserver
  useEffect(() => {
    const ids = headings.map((h) => slugify(h.text));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    // Small delay to let DOM render heading ids
    const timer = setTimeout(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {/* Section navigation */}
        {headings.length > 0 && (
          <nav>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#505050] mb-3">
              On this page
            </p>
            <ul className="space-y-0.5">
              {headings.map((heading) => {
                const id = slugify(heading.text);
                const isActive = activeId === id;
                const indent = heading.level === "h3" ? "pl-3" : heading.level === "h2" ? "pl-0" : "pl-0";

                return (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={`block w-full text-left text-xs py-1.5 px-3 rounded-lg transition-all duration-200 ${indent} ${
                        isActive
                          ? "text-[#f0f0f0] bg-white/[0.04] font-semibold"
                          : "text-[#555] hover:text-[#888] hover:bg-white/[0.02]"
                      } ${heading.level === "h1" ? "font-semibold" : ""}`}
                    >
                      {heading.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Other pages in this brand */}
        {allPages.length > 1 && (
          <nav>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#505050] mb-3">
              All docs
            </p>
            <ul className="space-y-0.5">
              {allPages.map((page) => {
                const isCurrent = page.id === docPage.id;
                return (
                  <li key={page.id}>
                    <Link
                      href={portalPath(`/${brandSlug}/docs/${page.slug}`)}
                      className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? "text-[#f0f0f0] bg-white/[0.04] font-semibold"
                          : "text-[#555] hover:text-[#888] hover:bg-white/[0.02]"
                      }`}
                    >
                      <FileText size={11} className="shrink-0" />
                      <span className="truncate">{page.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
}
