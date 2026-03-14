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
          className="text-xl font-bold bg-white/[0.04] border border-[#f77614] rounded-lg px-3 py-1.5 text-[#ececec] w-72 focus:outline-none"
          autoFocus
        />
        <button
          onClick={save}
          className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-1.5 hover:bg-white/[0.08] text-[#ececec] transition-colors"
          title="Save"
        >
          <Check size={13} />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-1.5 hover:bg-white/[0.08] text-[#686868] transition-colors"
          title="Cancel"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-6 group/header">
      <h2 className="text-xl font-bold text-[#ececec]">{name}</h2>
      {editMode && canEdit && (
        <div className="flex items-center gap-1.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-1 hover:bg-white/[0.08] text-[#686868] hover:text-[#ececec] transition-colors"
            title="Rename section"
          >
            <Pencil size={12} />
          </button>
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-1 hover:bg-red-500/20 text-[#686868] hover:text-red-400 transition-colors"
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

      {editMode && canEdit && (
        <button
          onClick={() => addSection(brandId)}
          className="flex items-center gap-2 text-sm text-[#484848] hover:text-[#888] border border-dashed border-white/[0.06] hover:border-white/[0.12] rounded-xl px-5 py-3 transition-all duration-200 w-full justify-center"
        >
          <Plus size={15} />
          Add section
        </button>
      )}
    </div>
  );
}
