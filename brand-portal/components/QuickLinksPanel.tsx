"use client";

import { useState } from "react";
import { ExternalLink, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";

export default function QuickLinksPanel({ brandId }: { brandId: string }) {
  const { editMode, getQuickLinks, addQuickLink, updateQuickLink, deleteQuickLink } =
    useEditStore();
  const { canEdit } = usePortal();
  const links = getQuickLinks(brandId);
  const canEditLinks = editMode && canEdit;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  const startEdit = (id: string, label: string, url: string) => {
    setEditingId(id);
    setDraftLabel(label);
    setDraftUrl(url);
  };

  const saveEdit = () => {
    if (editingId) {
      updateQuickLink(editingId, { label: draftLabel, url: draftUrl });
      setEditingId(null);
    }
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <aside className="w-full lg:w-56 shrink-0 lg:self-start lg:border-l lg:border-white/[0.04] lg:pl-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#555]">
          Quick Links
        </h3>
        {canEditLinks && (
          <button
            onClick={() => addQuickLink(brandId)}
            className="text-[#484848] hover:text-[#888] transition-colors"
            title="Add link"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {links.length === 0 && !canEditLinks && (
        <p className="text-xs text-[#484848]">No quick links yet.</p>
      )}

      <ul className="space-y-1">
        {links.map((link) =>
          canEditLinks && editingId === link.id ? (
            <li key={link.id} className="space-y-1 bg-white/[0.02] border border-white/[0.06] rounded-lg p-2">
              <input
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
                placeholder="Label"
              />
              <input
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-xs font-mono text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
                placeholder="https://"
              />
              <div className="flex gap-1 pt-0.5">
                <button
                  onClick={saveEdit}
                  className="inline-flex items-center gap-1 text-xs bg-white text-black px-2 py-1 rounded-lg font-semibold"
                >
                  <Check size={10} /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-2 py-1 rounded-lg"
                >
                  <X size={10} /> Cancel
                </button>
              </div>
            </li>
          ) : (
            <li key={link.id} className="group flex items-center gap-1">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#787878] hover:text-[#ececec] flex-1 min-w-0 transition-colors duration-200"
              >
                <ExternalLink size={12} className="shrink-0 text-[#484848]" />
                <span className="truncate">{link.label}</span>
              </a>
              {canEditLinks && (
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => startEdit(link.id, link.label, link.url)}
                    className="p-1 rounded-lg hover:bg-white/[0.04] text-[#686868]"
                    title="Edit"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={() => deleteQuickLink(link.id)}
                    className="p-1 rounded-lg hover:bg-red-500/20 text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </li>
          )
        )}
      </ul>
    </aside>
  );
}
