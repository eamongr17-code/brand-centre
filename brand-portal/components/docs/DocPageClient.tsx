"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Check, X, Lock } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import FadeImg from "@/components/FadeImg";
import ImageUploader from "@/components/ImageUploader";
import DocBlockRenderer from "./DocBlockRenderer";
import DocBlockEditor from "./DocBlockEditor";
import DocBlockAddMenu from "./DocBlockAddMenu";
import DocSidebar from "./DocSidebar";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { getBrandBySlug } from "@/data/mock-data";

interface DocPageClientProps {
  brandSlug: string;
  docSlug: string;
}

export default function DocPageClient({ brandSlug, docSlug }: DocPageClientProps) {
  const { getDocPages, getDocPageBySlug, updateDocPage, deleteDocPage, addDocBlock, updateDocBlock, deleteDocBlock, reorderDocBlocks, editMode } = useEditStore();
  const { portalPath, showInternal, canEdit, mode } = usePortal();
  const isPublic = mode === "public";
  const [mounted, setMounted] = useState(false);
  const [editingMeta, setEditingMeta] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const brand = getBrandBySlug(brandSlug);
  const docPage = mounted && brand ? getDocPageBySlug(brand.id, docSlug) : undefined;
  const allPages = mounted && brand ? getDocPages(brand.id) : [];
  const visiblePages = showInternal ? allPages : allPages.filter((d) => d.visibility !== "internal");

  // Local state for meta editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [visibility, setVisibility] = useState<"public" | "internal">("public");

  useEffect(() => {
    if (docPage) {
      setTitle(docPage.title);
      setDescription(docPage.description);
      setSlug(docPage.slug);
      setCoverImage(docPage.coverImage ?? "");
      setVisibility(docPage.visibility ?? "public");
    }
  }, [docPage]);

  if (!mounted || !brand) {
    return (
      <main>
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse mb-8" />
        </div>
      </main>
    );
  }

  if (!docPage || (!showInternal && docPage.visibility === "internal")) {
    return (
      <main>
        <Breadcrumb
          crumbs={[
            ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
            { label: brand.name, href: portalPath(`/${brand.slug}`) },
            { label: "Docs", href: portalPath(`/${brand.slug}/docs`) },
            { label: "Not found" },
          ]}
        />
        <div className="max-w-6xl mx-auto px-8 py-12">
          <p className="text-[#686868]">Documentation page not found.</p>
        </div>
      </main>
    );
  }

  const saveMeta = () => {
    updateDocPage(docPage.id, {
      title: title.trim() || "Untitled",
      description,
      slug: slug.trim() || docPage.slug,
      coverImage: coverImage || undefined,
      visibility,
    });
    setEditingMeta(false);
  };

  const sortedBlocks = [...docPage.blocks].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData("text/plain", blockId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === targetId) return;
    const ids = sortedBlocks.map((b) => b.id);
    const fromIdx = ids.indexOf(draggedId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, draggedId);
    reorderDocBlocks(docPage.id, ids);
  };

  return (
    <main>
      <Breadcrumb
        crumbs={[
          ...(!isPublic ? [{ label: "Home", href: portalPath("/") }] : []),
          { label: brand.name, href: portalPath(`/${brand.slug}`) },
          { label: "Docs", href: portalPath(`/${brand.slug}/docs`) },
          { label: docPage.title },
        ]}
      />

      <div className="max-w-6xl mx-auto px-8 py-12 flex gap-12 [animation:fade-in_0.3s_ease-out_forwards]">
        {/* Sidebar */}
        <DocSidebar docPage={docPage} allPages={visiblePages} brandSlug={brandSlug} />

        {/* Main content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* Cover image */}
          {docPage.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] mb-8">
              <FadeImg src={docPage.coverImage} alt={docPage.title} className="w-full h-auto max-h-80 object-cover" />
            </div>
          )}

          {/* Page header */}
          {editMode && canEdit && editingMeta ? (
            <div className="space-y-3 mb-10 p-4 border border-[#f77614] rounded-xl bg-[#161616]">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-lg font-bold text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15]"
                placeholder="Page title"
              />
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm font-mono text-[#888] placeholder-[#444] focus:outline-none focus:border-white/[0.15]"
                placeholder="url-slug"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] resize-none"
                rows={2}
                placeholder="Page description"
              />
              <ImageUploader value={coverImage} onChange={setCoverImage} placeholder="Cover image URL" />
              <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg text-xs">
                <button
                  onClick={() => setVisibility("public")}
                  className={`flex-1 py-1.5 rounded-md transition-all ${visibility === "public" ? "bg-white/[0.08] text-[#ececec] font-semibold" : "text-[#555] hover:text-[#888]"}`}
                >
                  Public
                </button>
                <button
                  onClick={() => setVisibility("internal")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md transition-all ${visibility === "internal" ? "bg-white/[0.08] text-[#ececec] font-semibold" : "text-[#555] hover:text-[#888]"}`}
                >
                  <Lock size={10} /> Internal
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={saveMeta} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
                  <Check size={11} /> Save
                </button>
                <button onClick={() => setEditingMeta(false)} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-10 group/header">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-[#ececec]">{docPage.title}</h1>
                    {docPage.visibility === "internal" && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full font-semibold">
                        <Lock size={9} /> Internal
                      </span>
                    )}
                  </div>
                  {docPage.description && (
                    <p className="text-[15px] text-[#686868] mt-2 leading-relaxed">{docPage.description}</p>
                  )}
                </div>
                {editMode && canEdit && (
                  <div className="flex gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setEditingMeta(true)}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-1.5 hover:bg-white/[0.08] text-[#686868] hover:text-[#ececec] transition-colors"
                      title="Edit page details"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this doc page?")) deleteDocPage(docPage.id); }}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-1.5 hover:bg-red-500/20 text-[#686868] hover:text-red-400 transition-colors"
                      title="Delete page"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blocks */}
          <div className="space-y-6">
            {sortedBlocks.map((block) =>
              editMode && canEdit ? (
                <DocBlockEditor
                  key={block.id}
                  block={block}
                  docPageId={docPage.id}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ) : (
                <DocBlockRenderer key={block.id} block={block} />
              )
            )}
          </div>

          {/* Add block button */}
          {editMode && canEdit && (
            <div className="mt-8">
              <DocBlockAddMenu docPageId={docPage.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
