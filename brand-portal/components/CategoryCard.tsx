"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Eye, Pencil, Trash2, Check, X, Loader, GripVertical } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { downloadAssetsAsZip } from "@/lib/download-zip";
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
      await downloadAssetsAsZip(visibleAssets, category.name || "assets");
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
      <div className="border border-[#f77614] rounded-xl bg-[#1a1a1a] flex flex-col overflow-hidden [animation:fade-up_0.3s_ease-out_forwards]">
        <div className="bg-white/[0.02] h-36 shrink-0 overflow-hidden">
          <FadeImg src={previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4 space-y-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="Category name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs resize-none text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
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
                  className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md transition-all duration-200 ${actionType === "download" ? "bg-white/[0.08] text-[#f0f0f0] font-semibold" : "text-[#555] hover:text-[#888]"}`}
                >
                  <Download size={10} /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("view")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md transition-all duration-200 ${actionType === "view" ? "bg-white/[0.08] text-[#f0f0f0] font-semibold" : "text-[#555] hover:text-[#888]"}`}
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
              className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
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
      className="glass-card rounded-2xl relative overflow-hidden aspect-[16/12] group [animation:fade-up_0.3s_ease-out_forwards]"
      draggable={editMode && !!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, category.id) : undefined}
      onDragOver={onDragOver ? (e) => onDragOver(e, category.id) : undefined}
      onDragEnd={onDragEnd}
    >
      {/* Layer 1 — Image */}
      <div className="absolute inset-0 bg-white/[0.02]">
        <FadeImg
          src={category.previewImage || publicPath("/placeholder-asset.png")}
          fallbackSrc={publicPath("/placeholder-asset.png")}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Layer 2 — Edit overlays */}
      {/* Grip handle — top-left */}
      {editMode && onDragStart && (
        <div className="absolute top-3 left-3 z-10 cursor-grab active:cursor-grabbing text-[#555] hover:text-[#888] opacity-0 group-hover:opacity-100 transition-all duration-200">
          <GripVertical size={14} />
        </div>
      )}

      {/* Edit/delete buttons — top-right */}
      {editMode && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl p-1.5 hover:bg-white/[0.08] transition-colors duration-200"
            title="Edit"
          >
            <Pencil size={12} className="text-[#f0f0f0]" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCategory(category.id); }}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl p-1.5 hover:bg-red-500/20 text-red-400 transition-colors duration-200"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Layer 3 — Dark panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-white/[0.07] rounded-t-xl">
        <div className="px-5 pt-3 pb-3">
          <span className="font-semibold text-base text-[#f0f0f0] truncate block">{name}</span>
          <div className="flex items-end justify-between gap-2 mt-1">
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-xs text-[#636363]">
                {category.actionType === "view"
                  ? "External asset"
                  : isColours
                    ? `${getColours(category.id).length} colours`
                    : `${liveAssetCount} assets`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.preventDefault()}>
              {category.actionType === "view" ? (
                category.downloadAllUrl && category.downloadAllUrl !== "#" && (
                  <a
                    href={category.downloadAllUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 inline-flex items-center justify-center bg-white text-[#111] rounded-xl hover:bg-white/90 active:scale-95 transition-all duration-200"
                    title="View"
                  >
                    <Eye size={14} />
                  </a>
                )
              ) : (
                <>
                  <Link
                    href={portalPath(`/${brandSlug}/${category.slug}`)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-9 px-4 inline-flex items-center justify-center text-xs font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-[#f0f0f0] hover:bg-white/[0.1] active:scale-95 transition-all duration-200"
                  >
                    {isColours ? "Browse" : "Browse"}
                  </Link>
                  {!isColours && visibleAssets.length > 0 && (
                    category.downloadAllUrl && category.downloadAllUrl !== "#" ? (
                      <a
                        href={category.downloadAllUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white hover:bg-white/90 active:scale-95 transition-all duration-200"
                        title="Download All"
                      >
                        <Download size={14} className="text-[#111]" />
                      </a>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDownloadAll(); }}
                        disabled={zipping}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white hover:bg-white/90 active:scale-95 transition-all duration-200 disabled:opacity-60"
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
    </div>
  );

  return (
    <Link href={portalPath(`/${brandSlug}/${category.slug}`)} className="block h-full">
      {cardContent}
    </Link>
  );
}
