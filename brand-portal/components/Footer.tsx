"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import { usePathname } from "next/navigation";

export default function Footer() {
  const {
    editMode,
    getFooterLinks,
    addFooterLink,
    updateFooterLink,
    deleteFooterLink,
    getFooterText,
    setFooterText,
  } = useEditStore();
  const { canEdit } = usePortal();
  const pathname = usePathname();

  const links = getFooterLinks();
  const footerText = getFooterText();
  const isEditing = editMode && canEdit;

  // Text editing is only available on the home page
  const isHomePage = pathname === "/" || pathname === "/internal";
  const canEditText = isEditing && isHomePage;

  const hasLinks = links.length > 0 || isEditing;

  return (
    <footer className="border-t border-[#1e1e1e] mt-auto py-7 px-8 w-full">
      <div
        className={`max-w-5xl mx-auto flex flex-col gap-4 ${
          hasLinks ? "sm:flex-row items-center justify-between" : "items-center justify-center"
        }`}
      >
        {hasLinks && (
          <nav className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 items-center">
            {links.map((link) => (
              <FooterLinkItem
                key={link.id}
                label={link.label}
                href={link.href}
                isEditing={isEditing}
                onUpdate={(changes) => updateFooterLink(link.id, changes)}
                onDelete={() => deleteFooterLink(link.id)}
              />
            ))}
            {isEditing && (
              <button
                onClick={addFooterLink}
                className="inline-flex items-center gap-1 text-xs text-[#555] hover:text-[#888] transition-colors"
              >
                <Plus size={11} />
                Add link
              </button>
            )}
          </nav>
        )}

        <FooterText
          text={footerText}
          canEdit={canEditText}
          centered={!hasLinks}
          onChange={setFooterText}
        />
      </div>
    </footer>
  );
}

function FooterText({
  text,
  canEdit,
  centered,
  onChange,
}: {
  text: string;
  canEdit: boolean;
  centered: boolean;
  onChange: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const save = () => {
    onChange(draft.trim() || text);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(text);
    setEditing(false);
  };

  if (editing) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${centered ? "justify-center" : ""}`}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          className="bg-[#2d2d2d] border border-[#f77614] rounded px-2 py-0.5 text-xs text-[#e8e8e8] w-72 focus:outline-none"
          autoFocus
        />
        <button onClick={save} className="text-green-400 hover:text-green-300"><Check size={11} /></button>
        <button onClick={cancel} className="text-[#666] hover:text-[#aaa]"><X size={11} /></button>
      </span>
    );
  }

  return (
    <span
      className={`group/footertext inline-flex items-center gap-1 text-xs text-[#444] ${
        centered ? "text-center justify-center" : "text-center sm:text-right"
      }`}
    >
      {text}
      {canEdit && (
        <button
          onClick={() => { setDraft(text); setEditing(true); }}
          className="opacity-0 group-hover/footertext:opacity-100 transition-opacity text-[#555] hover:text-[#aaa]"
          title="Edit footer text"
        >
          <Pencil size={10} />
        </button>
      )}
    </span>
  );
}

function FooterLinkItem({
  label,
  href,
  isEditing,
  onUpdate,
  onDelete,
}: {
  label: string;
  href: string;
  isEditing: boolean;
  onUpdate: (changes: { label?: string; href?: string }) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);
  const [editHref, setEditHref] = useState(href);

  const save = () => {
    onUpdate({ label: editLabel.trim() || label, href: editHref.trim() || href });
    setEditing(false);
  };

  const cancel = () => {
    setEditLabel(label);
    setEditHref(href);
    setEditing(false);
  };

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1">
        <input
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          className="bg-[#2d2d2d] border border-[#f77614] rounded px-1.5 py-0.5 text-xs text-[#e8e8e8] w-24 focus:outline-none"
          autoFocus
        />
        <input
          value={editHref}
          onChange={(e) => setEditHref(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          className="bg-[#2d2d2d] border border-[#444] rounded px-1.5 py-0.5 text-xs font-mono text-[#e8e8e8] w-32 focus:outline-none"
          placeholder="https://..."
        />
        <button onClick={save} className="text-green-400 hover:text-green-300"><Check size={11} /></button>
        <button onClick={cancel} className="text-[#666] hover:text-[#aaa]"><X size={11} /></button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 group/link">
      <a href={href} className="text-xs text-[#555] hover:text-[#888] transition-colors">
        {label}
      </a>
      {isEditing && (
        <span className="opacity-0 group-hover/link:opacity-100 transition-opacity inline-flex items-center gap-0.5">
          <button
            onClick={() => { setEditLabel(label); setEditHref(href); setEditing(true); }}
            className="text-[#555] hover:text-[#aaa] transition-colors"
            title="Edit"
          >
            <Pencil size={10} />
          </button>
          <button
            onClick={onDelete}
            className="text-[#555] hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={10} />
          </button>
        </span>
      )}
    </span>
  );
}
