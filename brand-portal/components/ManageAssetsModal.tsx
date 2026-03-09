"use client";

import { X } from "lucide-react";
import AssetGrid from "@/components/AssetGrid";
import ColourGrid from "@/components/ColourGrid";
import type { Category } from "@/lib/types";

interface ManageAssetsModalProps {
  category: Category;
  onClose: () => void;
}

export default function ManageAssetsModal({ category, onClose }: ManageAssetsModalProps) {
  const isColours = category.categoryType === "colours";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333] shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#e8e8e8]">{category.name}</h2>
            <p className="text-xs text-[#666] mt-0.5">
              {isColours ? "Manage colour palette" : "Manage assets"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#aaa] transition-colors p-1"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {isColours
            ? <ColourGrid categoryId={category.id} />
            : <AssetGrid categoryId={category.id} />}
        </div>
      </div>
    </div>
  );
}
