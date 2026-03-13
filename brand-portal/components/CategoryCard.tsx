"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Pencil, Trash2, Check, X, Loader } from "lucide-react";
import { zipSync } from "fflate";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import ImageUploader from "@/components/ImageUploader";
import FadeImg from "@/components/FadeImg";
import { publicPath } from "@/lib/public-path";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  brandSlug: string;
}

export default function CategoryCard({ category, brandSlug }: CategoryCardProps) {
  const { editMode, updateCategory, deleteCategory, getAssets } = useEditStore();
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
      const blob = new Blob([zipped.buffer], { type: "application/zip" });
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

  // Re-sync local state when prop changes
  useEffect(() => {
    if (!editing) {
      setName(category.name);
      setDescription(category.description);
      setPreviewImage(category.previewImage);
      setDownloadAllUrl(category.downloadAllUrl);
    }
  }, [category, editing]);

  const save = () => {
    updateCategory(category.id, { name, description, previewImage, downloadAllUrl });
    setEditing(false);
  };

  const cancel = () => {
    setName(category.name);
    setDescription(category.description);
    setPreviewImage(category.previewImage);
    setDownloadAllUrl(category.downloadAllUrl);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="border border-[#f77614] rounded-lg bg-[#242424] flex flex-col overflow-hidden [animation:fade-up_0.3s_ease-out_forwards]">
        <div className="bg-[#2d2d2d] h-36 shrink-0 overflow-hidden">
          <FadeImg src={previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4 space-y-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-sm font-semibold text-[#e8e8e8] placeholder-[#666]"
            placeholder="Category name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs resize-none text-[#e8e8e8] placeholder-[#666]"
            rows={2}
            placeholder="Description"
          />
          {/* Preview image for all category types */}
          <ImageUploader
            value={previewImage}
            onChange={setPreviewImage}
            placeholder="Preview image URL (https://...)"
          />
          {/* Download URL only for non-colour categories */}
          {!isColours && (
            <ImageUploader
              value={downloadAllUrl}
              onChange={setDownloadAllUrl}
              placeholder="Download All URL (https://...)"
              accept="*/*"
            />
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded font-medium"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 text-xs border border-[#444] text-[#e8e8e8] px-3 py-1.5 rounded"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-[#333] rounded-lg bg-[#242424] hover:border-[#444] transition-colors relative group flex flex-col [animation:fade-up_0.3s_ease-out_forwards]">
        {/* Preview image — shown for all category types */}
        <div className="bg-[#2d2d2d] h-36 shrink-0 rounded-t-lg overflow-hidden">
          <FadeImg src={category.previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt={category.name} className="h-full w-full object-cover" />
        </div>

        {editMode && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="bg-[#1a1a1a] border border-[#444] rounded p-1 hover:bg-[#2d2d2d]"
              title="Edit"
            >
              <Pencil size={12} className="text-[#e8e8e8]" />
            </button>
            <button
              onClick={() => deleteCategory(category.id)}
              className="bg-[#1a1a1a] border border-[#444] rounded p-1 hover:bg-[#3a1a1a] text-red-400"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        <div className="p-4 flex flex-col flex-1 gap-2">
          <div>
            <h3 className="font-semibold text-[#e8e8e8]">{name}</h3>
            {!isColours && (
              <p className="text-xs text-[#888] mt-0.5">{liveAssetCount} assets</p>
            )}
          </div>
          {description && (
            <p className="text-sm text-[#a0a0a0] flex-1">{description}</p>
          )}
          <div className="flex gap-2 mt-auto pt-2">
            <Link
              href={portalPath(`/${brandSlug}/${category.slug}`)}
              className="flex-1 inline-flex items-center justify-center text-xs font-medium bg-[#2d2d2d] border border-[#444] text-[#e8e8e8] px-3 py-1.5 rounded hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              {isColours ? "Browse palette" : "Browse assets"}
            </Link>
            {!isColours && visibleAssets.length > 0 && (
              category.downloadAllUrl && category.downloadAllUrl !== "#" ? (
                <a
                  href={category.downloadAllUrl}
                  className="inline-flex items-center justify-center text-xs font-medium bg-white text-black px-3 py-1.5 rounded hover:opacity-80 active:scale-95 transition-all duration-150"
                  title="Download All"
                >
                  <Download size={12} />
                </a>
              ) : (
                <button
                  onClick={handleDownloadAll}
                  disabled={zipping}
                  className="inline-flex items-center justify-center text-xs font-medium bg-white text-black px-3 py-1.5 rounded hover:opacity-80 active:scale-95 transition-all duration-150 disabled:opacity-60"
                  title="Download all assets as ZIP"
                >
                  {zipping ? <Loader size={12} className="animate-spin" /> : <Download size={12} />}
                </button>
              )
            )}
          </div>
        </div>
      </div>

    </>
  );
}
