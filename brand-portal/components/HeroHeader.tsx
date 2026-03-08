"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import ImageUploader from "@/components/ImageUploader";
import type { Brand, Category } from "@/lib/types";

interface HeroHeaderProps {
  variant: "home" | "brand" | "category";
  brand?: Brand;
  category?: Category;
}

function ImageBanner({
  imageUrl,
  emptyLabel,
  onSave,
}: {
  imageUrl: string;
  emptyLabel: string;
  onSave: (url: string) => void;
}) {
  const { editMode } = useEditStore();
  const [editingUrl, setEditingUrl] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => { setDraft(imageUrl); setEditingUrl(true); };
  const save = () => { onSave(draft); setEditingUrl(false); };
  const cancel = () => setEditingUrl(false);

  return (
    <div className="w-full relative border-b border-[#2d2d2d]">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-full block" />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-[#242424]">
          {editMode && !editingUrl && (
            <span className="text-[#666] text-sm">{emptyLabel}</span>
          )}
        </div>
      )}

      {editMode && !editingUrl && (
        <button
          onClick={startEdit}
          className="absolute top-3 right-3 bg-[#2d2d2d] border border-[#444] rounded p-1.5 hover:bg-[#333]"
          title="Set banner image"
        >
          <Pencil size={14} className="text-[#e8e8e8]" />
        </button>
      )}

      {editMode && editingUrl && (
        <div className="absolute inset-x-0 bottom-0 bg-[#1a1a1a] border-t border-[#333] px-4 py-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1 min-w-0">
              <ImageUploader
                value={draft}
                onChange={setDraft}
                placeholder="https://..."
              />
            </div>
            <button
              onClick={save}
              className="shrink-0 inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded font-medium"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="shrink-0 inline-flex items-center gap-1 text-xs border border-[#444] text-[#e8e8e8] px-3 py-1.5 rounded"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeroHeader({ variant, brand, category }: HeroHeaderProps) {
  const { getHomeImage, setHomeImage, getBrandImage, setBrandImage } = useEditStore();

  if (variant === "home") {
    return (
      <ImageBanner
        imageUrl={getHomeImage()}
        emptyLabel="No banner image — click the pencil to add one"
        onSave={setHomeImage}
      />
    );
  }

  if (variant === "brand" && brand) {
    return (
      <ImageBanner
        imageUrl={getBrandImage(brand.id)}
        emptyLabel="No banner image — click the pencil to add one"
        onSave={(url) => setBrandImage(brand.id, url)}
      />
    );
  }

  if (variant === "category" && category) {
    return (
      <div className="w-full bg-[#242424] border-b border-[#333] py-10 px-8">
        <h1 className="text-2xl font-bold text-[#e8e8e8]">{category.name}</h1>
      </div>
    );
  }

  return null;
}
