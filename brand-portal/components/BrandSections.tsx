"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, FileText } from "lucide-react";
import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import QuickLinksPanel from "@/components/QuickLinksPanel";
import DocPageCard from "@/components/docs/DocPageCard";
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
          className="text-xl font-bold bg-white/[0.04] border border-[#f77614] rounded-lg px-3 py-1.5 text-[#f0f0f0] w-72 focus:outline-none"
          autoFocus
        />
        <button
          onClick={save}
          className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1.5 hover:bg-white/[0.08] text-[#f0f0f0] transition-colors"
          title="Save"
        >
          <Check size={13} />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1.5 hover:bg-white/[0.08] text-[#686868] transition-colors"
          title="Cancel"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-6 group/header">
      <h2 className="text-xl font-bold text-[#f0f0f0]">{name}</h2>
      {editMode && canEdit && (
        <div className="flex items-center gap-1.5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setEditing(true)}
            className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1 hover:bg-white/[0.08] text-[#686868] hover:text-[#f0f0f0] transition-colors"
            title="Rename section"
          >
            <Pencil size={12} />
          </button>
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1 hover:bg-red-500/20 text-[#686868] hover:text-red-400 transition-colors"
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
    getDocPages,
    addDocPage,
  } = useEditStore();
  const { canEdit, portalPath, showInternal } = usePortal();

  const sections = getSections(brandId);
  const mainSectionName = getMainSectionName(brandId) || "Categories";
  const mainCategories = getCategories(brandId, undefined);
  const docPages = getDocPages(brandId);
  const visibleDocPages = showInternal ? docPages : docPages.filter((d) => d.visibility !== "internal");

  const showMainSection = mainCategories.length > 0 || (editMode && canEdit);
  const showDocSection = visibleDocPages.length > 0 || (editMode && canEdit);

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

      {/* Quick Links — inline */}
      <QuickLinksPanel brandId={brandId} inline />

      {/* Documentation section */}
      {showDocSection && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-[#f0f0f0]">Documentation</h2>
            <Link
              href={portalPath(`/${brandSlug}/docs`)}
              className="text-xs text-[#555] hover:text-[#888] transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleDocPages.slice(0, 3).map((docPage, i) => (
              <div
                key={docPage.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className="[animation:fade-up_0.3s_ease-out_forwards] opacity-0"
              >
                <DocPageCard docPage={docPage} brandSlug={brandSlug} />
              </div>
            ))}
          </div>
          {editMode && canEdit && (
            <button
              onClick={() => addDocPage(brandId)}
              className="mt-4 flex items-center gap-2 text-sm text-[#555] hover:text-[#888] border border-dashed border-white/[0.07] hover:border-white/[0.12] rounded-xl px-5 py-3 transition-all duration-200 w-full justify-center"
            >
              <Plus size={15} />
              Add doc page
            </button>
          )}
        </section>
      )}

      {editMode && canEdit && (
        <button
          onClick={() => addSection(brandId)}
          className="flex items-center gap-2 text-sm text-[#555] hover:text-[#888] border border-dashed border-white/[0.07] hover:border-white/[0.12] rounded-xl px-5 py-3 transition-all duration-200 w-full justify-center"
        >
          <Plus size={15} />
          Add section
        </button>
      )}
    </div>
  );
}
