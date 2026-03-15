"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import ImageUploader from "@/components/ImageUploader";
import FadeImg from "@/components/FadeImg";
import { publicPath } from "@/lib/public-path";
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
  const { canEdit } = usePortal();
  const [editingUrl, setEditingUrl] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => { setDraft(imageUrl); setEditingUrl(true); };
  const save = () => { onSave(draft); setEditingUrl(false); };
  const cancel = () => setEditingUrl(false);

  const canEditBanner = editMode && canEdit;

  return (
    <div className="w-full relative border-b border-white/[0.05]">
      <FadeImg src={imageUrl || publicPath("/placeholder-banner.png")} fallbackSrc={publicPath("/placeholder-banner.png")} alt="" className="w-full block" />
      {!imageUrl && canEditBanner && !editingUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/30 text-sm">{emptyLabel}</span>
        </div>
      )}

      {canEditBanner && !editingUrl && (
        <button
          onClick={startEdit}
          className="absolute top-3 right-3 bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-2 hover:bg-white/[0.08] transition-colors"
          title="Set banner image"
        >
          <Pencil size={14} className="text-[#f0f0f0]" />
        </button>
      )}

      {canEditBanner && editingUrl && (
        <div className="absolute inset-x-0 bottom-0 bg-[#141414]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3">
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
              className="shrink-0 inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="shrink-0 inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
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
      <div className="w-full bg-[#1a1a1a] border-b border-white/[0.05] py-10 px-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">{category.name}</h1>
      </div>
    );
  }

  return null;
}
