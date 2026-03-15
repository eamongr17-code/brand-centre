"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Eye, Pencil, Trash2, Check, X, Loader, GripVertical } from "lucide-react";
import { zipSync } from "fflate";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import ImageUploader from "@/components/ImageUploader";
import FadeImg from "@/components/FadeImg";
import { publicPath } from "@/lib/public-path";
import { timeAgo } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  brandSlug: string;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export default function CategoryCard({ category, brandSlug, onDragStart, onDragOver, onDragEnd }: CategoryCardProps) {
  const { editMode, updateCategory, deleteCategory, getAssets, getColours } = useEditStore();
  const { portalPath, showInternal } = usePortal();
  const isColours = category.categoryType === "colours";
  const allAssets = getAssets(category.id);
  const visibleAssets = showInternal
    ? allAssets
    : allAssets.filter((a) => a.visibility !== "internal");
  const liveAssetCount = visibleAssets.length;
  const [zipping, setZipping] = useState(false);

  const handleDownloadAll = async () => {
    if (zipping || visibleAssets.length === 0) return;
    setZipping(true);
    try {
      const files: Record<string, Uint8Array> = {};
      const seen = new Set<string>();
      await Promise.all(
        visibleAssets
          .filter((a) => a.downloadUrl && a.downloadUrl !== "#")
          .map(async (a) => {
            try {
              const res = await fetch(a.downloadUrl);
              const buf = new Uint8Array(await res.arrayBuffer());
              const ext = a.downloadUrl.split(".").pop()?.split("?")[0] || "bin";
              let name = (a.name || "asset").replace(/[^a-z0-9.\-_ ]/gi, "_");
              if (!name.includes(".")) name = `${name}.${ext}`;
              while (seen.has(name)) name = `_${name}`;
              seen.add(name);
              files[name] = buf;
            } catch {}
          })
      );
      if (Object.keys(files).length === 0) return;
      const zipped = zipSync(files, { level: 0 });
      const blob = new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${category.name || "assets"}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [previewImage, setPreviewImage] = useState(category.previewImage);
  const [downloadAllUrl, setDownloadAllUrl] = useState(category.downloadAllUrl);
  const [actionType, setActionType] = useState<"download" | "view">(category.actionType ?? "download");

  useEffect(() => {
    if (!editing) {
      setName(category.name);
      setDescription(category.description);
      setPreviewImage(category.previewImage);
      setDownloadAllUrl(category.downloadAllUrl);
      setActionType(category.actionType ?? "download");
    }
  }, [category, editing]);

  const save = () => {
    updateCategory(category.id, { name, description, previewImage, downloadAllUrl, actionType });
    setEditing(false);
  };

  const cancel = () => {
    setName(category.name);
    setDescription(category.description);
    setPreviewImage(category.previewImage);
    setDownloadAllUrl(category.downloadAllUrl);
    setActionType(category.actionType ?? "download");
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="border border-[#f77614] rounded-xl bg-[#161616] flex flex-col overflow-hidden [animation:fade-up_0.3s_ease-out_forwards]">
        <div className="bg-white/[0.02] h-36 shrink-0 overflow-hidden">
          <FadeImg src={previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4 space-y-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="Category name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs resize-none text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
            rows={2}
            placeholder="Description"
          />
          <ImageUploader
            value={previewImage}
            onChange={setPreviewImage}
            placeholder="Preview image URL (https://...)"
          />
          {/* Action type toggle & URL — only for non-colour categories */}
          {!isColours && (
            <>
              <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActionType("download")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md transition-all duration-200 ${actionType === "download" ? "bg-white/[0.08] text-[#ececec] font-semibold" : "text-[#555] hover:text-[#888]"}`}
                >
                  <Download size={10} /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("view")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md transition-all duration-200 ${actionType === "view" ? "bg-white/[0.08] text-[#ececec] font-semibold" : "text-[#555] hover:text-[#888]"}`}
                >
                  <Eye size={10} /> View
                </button>
              </div>
              <ImageUploader
                value={downloadAllUrl}
                onChange={setDownloadAllUrl}
                placeholder={actionType === "view" ? "View URL (https://...)" : "Download All URL (https://...)"}
                accept="*/*"
              />
            </>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <div
      className="rounded-2xl relative group flex flex-col [animation:fade-up_0.3s_ease-out_forwards] h-full overflow-hidden border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300"
      style={{ minHeight: "380px" }}
      draggable={editMode && !!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, category.id) : undefined}
      onDragOver={onDragOver ? (e) => onDragOver(e, category.id) : undefined}
      onDragEnd={onDragEnd}
    >
      {/* Background image — fills entire card */}
      <div className="absolute inset-0">
        <FadeImg
          src={category.previewImage || publicPath("/placeholder-asset.png")}
          fallbackSrc={publicPath("/placeholder-asset.png")}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Grip handle */}
      {editMode && onDragStart && (
        <div className="absolute bottom-3 right-3 z-20 cursor-grab active:cursor-grabbing text-[#484848] hover:text-[#888] opacity-0 group-hover:opacity-100 transition-all">
          <GripVertical size={14} />
        </div>
      )}

      {/* Edit mode: edit/delete buttons */}
      {editMode && (
        <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl p-1.5 hover:bg-white/[0.08] transition-colors"
            title="Edit"
          >
            <Pencil size={12} className="text-[#ececec]" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCategory(category.id); }}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl p-1.5 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Dark content panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col" style={{ height: '48%' }}>
        {/* Tab — connected to panel with concave corner */}
        <div className="flex flex-shrink-0">
          <div className="relative bg-[#161616] rounded-t-2xl pl-5 pr-5 pt-3 pb-1 max-w-[70%]">
            <p className="font-bold text-[#ececec] text-[15px] leading-tight truncate">{name}</p>
            <p className="text-[10px] text-[#888] mt-0.5">
              {category.actionType === "view"
                ? "External asset"
                : isColours
                  ? `${getColours(category.id).length} colours`
                  : `${liveAssetCount} assets`}
            </p>
            {/* Concave corner — connects tab to panel */}
            <div className="absolute -right-4 bottom-0 w-4 h-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full shadow-[0_0_0_20px_#161616]" />
            </div>
          </div>
        </div>

        {/* Panel body */}
        <div className="bg-[#161616] rounded-tr-2xl flex-1 flex flex-col px-5 pb-5 pt-4 min-h-0">
          {description && (
            <p className="text-sm text-[#787878] leading-relaxed line-clamp-2">{description}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2.5 mt-auto pt-3" onClick={(e) => e.preventDefault()}>
            {category.actionType === "view" ? (
              category.downloadAllUrl && category.downloadAllUrl !== "#" && (
                <a
                  href={category.downloadAllUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-[#ececec] hover:bg-white/[0.1] transition-all duration-200"
                  title="View"
                >
                  <Eye size={14} />
                  View
                </a>
              )
            ) : (
              <>
                <Link
                  href={portalPath(`/${brandSlug}/${category.slug}`)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-10 inline-flex items-center justify-center text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-[#ececec] hover:bg-white/[0.1] transition-all duration-200"
                >
                  {isColours ? "Browse palette" : "Browse assets"}
                </Link>
                {!isColours && visibleAssets.length > 0 && (
                  category.downloadAllUrl && category.downloadAllUrl !== "#" ? (
                    <a
                      href={category.downloadAllUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white hover:bg-white/90 active:scale-95 transition-all duration-200"
                      title="Download All"
                    >
                      <Download size={14} className="text-[#111]" />
                    </a>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDownloadAll(); }}
                      disabled={zipping}
                      className="flex-shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white hover:bg-white/90 active:scale-95 transition-all duration-200 disabled:opacity-60"
                      title="Download all assets as ZIP"
                    >
                      {zipping ? <Loader size={14} className="animate-spin text-[#111]" /> : <Download size={14} className="text-[#111]" />}
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={portalPath(`/${brandSlug}/${category.slug}`)} className="block h-full">
      {cardContent}
    </Link>
  );
}
