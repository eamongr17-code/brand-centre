"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import CategoryGrid from "@/components/CategoryGrid";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

interface SectionHeaderProps {
  name: string;
  canDelete: boolean;
  onRename: (name: string) => void;
  onDelete?: () => void;
}

function SectionHeader({ name, canDelete, onRename, onDelete }: SectionHeaderProps) {
  const { editMode } = useEditStore();
  const { canEdit } = usePortal();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  useEffect(() => {
    if (!editing) setValue(name);
  }, [name, editing]);

  const save = () => {
    const trimmed = value.trim();
    if (trimmed) onRename(trimmed);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="text-xl font-bold bg-[#2d2d2d] border border-amber-500 rounded px-3 py-1 text-[#e8e8e8] w-72 focus:outline-none"
          autoFocus
        />
        <button
          onClick={save}
          className="bg-[#2d2d2d] border border-[#444] rounded p-1.5 hover:bg-[#3a3a3a] text-[#e8e8e8]"
          title="Save"
        >
          <Check size={13} />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="bg-[#2d2d2d] border border-[#444] rounded p-1.5 hover:bg-[#3a3a3a] text-[#888]"
          title="Cancel"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-6 group/header">
      <h2 className="text-xl font-bold text-[#e8e8e8]">{name}</h2>
      {editMode && canEdit && (
        <div className="flex items-center gap-1.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="bg-[#2d2d2d] border border-[#3a3a3a] rounded p-1 hover:bg-[#3a3a3a] text-[#888] hover:text-[#e8e8e8] transition-colors"
            title="Rename section"
          >
            <Pencil size={12} />
          </button>
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              className="bg-[#2d2d2d] border border-[#3a3a3a] rounded p-1 hover:bg-[#3a1a1a] text-[#888] hover:text-red-400 transition-colors"
              title="Delete section"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface BrandSectionsProps {
  brandId: string;
  brandSlug: string;
}

export default function BrandSections({ brandId, brandSlug }: BrandSectionsProps) {
  const {
    editMode,
    getSections,
    addSection,
    updateSection,
    deleteSection,
    getMainSectionName,
    updateMainSectionName,
    getCategories,
  } = useEditStore();
  const { canEdit } = usePortal();

  const sections = getSections(brandId);
  const mainSectionName = getMainSectionName(brandId) || "Categories";
  const mainCategories = getCategories(brandId, undefined);

  const showMainSection = mainCategories.length > 0 || (editMode && canEdit);

  return (
    <div className="space-y-16">
      {/* Main / default section */}
      {showMainSection && (
        <section>
          <SectionHeader
            name={mainSectionName}
            canDelete={false}
            onRename={(name) => updateMainSectionName(brandId, name)}
          />
          <CategoryGrid brandSlug={brandSlug} brandId={brandId} />
        </section>
      )}

      {/* Sub-brand and custom sections */}
      {sections.map((section) => (
        <section key={section.id}>
          <SectionHeader
            name={section.name}
            canDelete
            onRename={(name) => updateSection(section.id, { name })}
            onDelete={() => deleteSection(section.id)}
          />
          <CategoryGrid
            brandSlug={brandSlug}
            brandId={brandId}
            subBrandId={section.subBrandId ?? section.id}
          />
        </section>
      ))}

      {/* Add section button */}
      {editMode && canEdit && (
        <button
          onClick={() => addSection(brandId)}
          className="flex items-center gap-2 text-sm text-[#666] hover:text-[#aaa] border border-dashed border-[#3a3a3a] hover:border-[#555] rounded-lg px-5 py-3 transition-colors w-full justify-center"
        >
          <Plus size={15} />
          Add section
        </button>
      )}
    </div>
  );
}
