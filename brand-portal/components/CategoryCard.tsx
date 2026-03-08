"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Pencil, Trash2, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import ImageUploader from "@/components/ImageUploader";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  brandSlug: string;
}

export default function CategoryCard({ category, brandSlug }: CategoryCardProps) {
  const { editMode, updateCategory, deleteCategory } = useEditStore();
  const isColours = category.categoryType === "colours";
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
      <div className="border border-amber-500 rounded-lg bg-[#242424] flex flex-col overflow-hidden">
        <div className="bg-[#2d2d2d] h-36 flex items-center justify-center text-[#666] text-xs shrink-0">
          {previewImage ? (
            <img src={previewImage} alt="" className="h-full w-full object-contain" />
          ) : (
            <span>No preview image</span>
          )}
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
            <input
              value={downloadAllUrl}
              onChange={(e) => setDownloadAllUrl(e.target.value)}
              className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs font-mono text-[#e8e8e8] placeholder-[#666]"
              placeholder="Download All URL (https://...)"
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
      <div className="border border-[#333] rounded-lg bg-[#242424] hover:border-[#444] transition-colors relative group flex flex-col">
        {/* Preview image — shown for all category types */}
        <div className="bg-[#2d2d2d] h-36 flex items-center justify-center text-[#555] text-xs shrink-0 rounded-t-lg overflow-hidden">
          {category.previewImage ? (
            <img src={category.previewImage} alt={category.name} className="h-full w-full object-cover" />
          ) : (
            <span>No preview</span>
          )}
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
            <p className="text-xs text-[#888] mt-0.5">
              {isColours ? "Colour palette" : `${category.assetCount} assets`}
            </p>
          </div>
          {description && (
            <p className="text-sm text-[#a0a0a0] flex-1">{description}</p>
          )}
          <div className="flex gap-2 mt-auto pt-2">
            <Link
              href={`/${brandSlug}/${category.slug}`}
              className="flex-1 inline-flex items-center justify-center text-xs font-medium bg-[#2d2d2d] border border-[#444] text-[#e8e8e8] px-3 py-1.5 rounded hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              {isColours ? "Browse palette" : "Browse assets"}
            </Link>
            {!isColours && category.downloadAllUrl && category.downloadAllUrl !== "#" && (
              <a
                href={category.downloadAllUrl}
                className="inline-flex items-center justify-center text-xs font-medium bg-white text-black px-3 py-1.5 rounded hover:opacity-80 active:scale-95 transition-all duration-150"
                title="Download All"
              >
                <Download size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
