"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

export default function Footer() {
  const { editMode, getFooterLinks, addFooterLink, updateFooterLink, deleteFooterLink } = useEditStore();
  const { canEdit } = usePortal();
  const links = getFooterLinks();
  const isEditing = editMode && canEdit;

  return (
    <footer className="border-t border-[#1e1e1e] mt-auto py-7 px-8 w-full">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
        <p className="text-xs text-[#444] text-center sm:text-right">
          Have any issues?{" "}
          <a href="#" className="text-[#666] underline underline-offset-2 hover:text-[#888] transition-colors">
            Reach out to the brand team on Slack
          </a>
        </p>
      </div>
    </footer>
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
