"use client";

import { useState, useEffect } from "react";
import { Download, Eye, Pencil, Trash2, Check, X, Lock, Info, Share2, GripVertical } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import ImageUploader from "@/components/ImageUploader";
import FadeImg from "@/components/FadeImg";
import { publicPath } from "@/lib/public-path";
import { timeAgo } from "@/lib/utils";
import type { Asset } from "@/lib/types";

interface AssetCardProps {
  asset: Asset;
  brandSlug?: string;
  categorySlug?: string;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export default function AssetCard({ asset, brandSlug, categorySlug, onDragStart, onDragOver, onDragEnd }: AssetCardProps) {
  const { editMode, updateAsset, deleteAsset } = useEditStore();
  const { canEdit, showInternal, portalPath } = usePortal();
  const [editing, setEditing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [name, setName] = useState(asset.name);
  const [description, setDescription] = useState(asset.description);
  const [fileType, setFileType] = useState(asset.fileType);
  const [fileSize, setFileSize] = useState(asset.fileSize);
  const [previewImage, setPreviewImage] = useState(asset.previewImage);
  const [downloadUrl, setDownloadUrl] = useState(asset.downloadUrl);
  const [actionType, setActionType] = useState<"download" | "view">(
    asset.actionType ?? "download"
  );
  const [visibility, setVisibility] = useState<"public" | "internal">(
    asset.visibility ?? "public"
  );
  const [rulesLines, setRulesLines] = useState<string[]>([...(asset.rules ?? []), ""]);
  const [tagsInput, setTagsInput] = useState((asset.tags ?? []).join(", "));
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!editing) {
      setName(asset.name);
      setDescription(asset.description);
      setFileType(asset.fileType);
      setFileSize(asset.fileSize);
      setPreviewImage(asset.previewImage);
      setDownloadUrl(asset.downloadUrl);
      setActionType(asset.actionType ?? "download");
      setVisibility(asset.visibility ?? "public");
      setRulesLines([...(asset.rules ?? []), ""]);
      setTagsInput((asset.tags ?? []).join(", "));
    }
  }, [asset, editing]);

  const save = () => {
    updateAsset(asset.id, {
      name,
      description,
      fileType,
      fileSize,
      previewImage,
      downloadUrl,
      actionType,
      visibility,
      rules: rulesLines.filter(Boolean),
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  const cancel = () => {
    setName(asset.name);
    setDescription(asset.description);
    setFileType(asset.fileType);
    setFileSize(asset.fileSize);
    setPreviewImage(asset.previewImage);
    setDownloadUrl(asset.downloadUrl);
    setActionType(asset.actionType ?? "download");
    setVisibility(asset.visibility ?? "public");
    setRulesLines([...(asset.rules ?? []), ""]);
    setTagsInput((asset.tags ?? []).join(", "));
    setEditing(false);
  };

  const isView = (asset.actionType ?? "download") === "view";
  const isInternal = (asset.visibility ?? "public") === "internal";

  if (editing) {
    return (
      <div className="border border-[#f77614] rounded-xl bg-[#1a1a1a] flex flex-col overflow-hidden [animation:fade-up_0.3s_ease-out_forwards]">
        <div className="bg-white/[0.02] h-36 shrink-0 rounded-t-xl overflow-hidden">
          <FadeImg src={previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4 space-y-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="Asset name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs resize-none text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
            rows={2}
            placeholder="Description"
          />
          <input
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="File type (e.g. SVG + PNG)"
          />
          <div className="space-y-1.5">
            {rulesLines.map((rule, i) => (
              <div key={i} className="flex gap-1 items-center">
                <input
                  value={rule}
                  onChange={(e) => {
                    const next = [...rulesLines];
                    next[i] = e.target.value;
                    if (i === rulesLines.length - 1 && e.target.value) next.push("");
                    setRulesLines(next);
                  }}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
                  placeholder={i === rulesLines.length - 1 ? (i === 0 ? "e.g. Use on dark backgrounds only" : "Add another rule...") : ""}
                />
                {rule !== "" && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = rulesLines.filter((_, j) => j !== i);
                      const withTrailing = next[next.length - 1] !== "" ? [...next, ""] : next;
                      setRulesLines(withTrailing.length ? withTrailing : [""]);
                    }}
                    className="text-[#444] hover:text-red-400 transition-colors"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] placeholder-[#505050] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="Tags (comma-separated)"
          />
          <ImageUploader
            value={previewImage}
            onChange={setPreviewImage}
            placeholder="Preview image URL (https://...)"
          />
          <ImageUploader
            value={downloadUrl}
            onChange={setDownloadUrl}
            placeholder="Asset URL (https://...)"
            accept="*/*"
          />

          {/* Action type toggle */}
          <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActionType("download")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all duration-200 ${
                actionType === "download"
                  ? "bg-white/[0.08] text-[#f0f0f0] font-semibold"
                  : "text-[#555] hover:text-[#888]"
              }`}
            >
              <Download size={11} />
              Download
            </button>
            <button
              type="button"
              onClick={() => setActionType("view")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all duration-200 ${
                actionType === "view"
                  ? "bg-white/[0.08] text-[#f0f0f0] font-semibold"
                  : "text-[#555] hover:text-[#888]"
              }`}
            >
              <Eye size={11} />
              View
            </button>
          </div>

          {/* Visibility toggle */}
          {canEdit && (
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all duration-200 ${
                  visibility === "public"
                    ? "bg-white/[0.08] text-[#f0f0f0] font-semibold"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setVisibility("internal")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all duration-200 ${
                  visibility === "internal"
                    ? "bg-blue-900/60 text-blue-300 font-semibold"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                <Lock size={10} />
                Internal only
              </button>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#f0f0f0] px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (!brandSlug || !categorySlug) return;
    const url = `${window.location.origin}${portalPath(`/${brandSlug}/${categorySlug}/${asset.id}`)}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1500);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(asset.downloadUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = asset.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(asset.downloadUrl, "_blank");
    }
  };

  return (
    <div
      className="glass-card rounded-2xl relative overflow-hidden aspect-[16/12] group [animation:fade-up_0.3s_ease-out_forwards]"
      draggable={editMode && !!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, asset.id) : undefined}
      onDragOver={onDragOver ? (e) => onDragOver(e, asset.id) : undefined}
      onDragEnd={onDragEnd}
    >
      {/* Layer 1 — Image */}
      <div className="absolute inset-0 bg-white/[0.02]">
        <FadeImg src={asset.previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt={asset.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>

      {/* Layer 2 — Edit overlays */}
      {/* Grip OR internal badge — top-left */}
      <div className="absolute top-3 left-3 z-10">
        {editMode && onDragStart ? (
          <div className="cursor-grab active:cursor-grabbing text-[#555] hover:text-[#888] transition-colors">
            <GripVertical size={14} />
          </div>
        ) : isInternal && showInternal ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-blue-900/70 text-blue-300 border border-blue-800/50 backdrop-blur-sm">
            <Lock size={9} />
            Internal
          </span>
        ) : null}
      </div>

      {/* Edit/delete buttons — top-right */}
      {editMode && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setInfoOpen(false); setEditing(true); }}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl p-1.5 hover:bg-white/[0.08] transition-colors"
            title="Edit"
          >
            <Pencil size={12} className="text-[#f0f0f0]" />
          </button>
          <button
            onClick={() => deleteAsset(asset.id)}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl p-1.5 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Layer 3 — Dark panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-white/[0.07] rounded-t-xl flex flex-col overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          infoOpen ? "h-[calc(100%-48px)]" : "h-[88px]"
        }`}
      >
        {/* Info section — visible when expanded */}
        <div className={`flex flex-col gap-3 transition-opacity duration-200 ${
          infoOpen ? "flex-1 overflow-y-auto px-5 pt-2 pb-2 opacity-100 delay-200" : "h-0 overflow-hidden opacity-0 pointer-events-none"
        }`}>
          <div className="flex items-end justify-end">
            <button onClick={() => setInfoOpen(false)} className="shrink-0 text-[#555] hover:text-[#999] transition-colors">
              <X size={14} />
            </button>
          </div>
          {description && <p className="text-xs text-[#8a8a8a] leading-relaxed">{description}</p>}
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {asset.tags.map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.04] text-[#686868] font-medium">{tag}</span>
              ))}
            </div>
          )}
          {asset.rules && asset.rules.length > 0 && (
            <ul className="space-y-1.5">
              {asset.rules.map((rule, i) => (
                <li key={i} className="flex gap-1.5 text-[11px] text-[#8a8a8a] leading-snug">
                  <span className="shrink-0 text-[#444]">—</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Divider — only when info is open */}
        {infoOpen && <div className="mx-5 border-t border-white/[0.07] shrink-0" />}

        {/* Footer bar — always visible */}
        <div className="mt-auto px-5 pt-3 pb-3 shrink-0">
          <span className="font-semibold text-sm text-[#f0f0f0] truncate block">{name}</span>
          <div className="flex items-end justify-between gap-2 mt-1">
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-xs text-[#636363]">{fileType}{fileSize ? ` · ${fileSize}` : ""}</span>
              {asset.lastEditedAt && <span className="text-[10px] text-[#555]">{timeAgo(asset.lastEditedAt)}</span>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Info button */}
              <button
                onClick={() => setInfoOpen(v => !v)}
                className={`w-8 h-8 inline-flex items-center justify-center rounded-xl border transition-colors ${
                  infoOpen ? "border-white/20 text-[#f0f0f0]" : "border-white/[0.1] text-[#555] hover:text-[#f0f0f0] hover:border-white/20"
                }`}
              >
                <Info size={13} />
              </button>
              {/* Share button */}
              {brandSlug && categorySlug && (
                <button
                  onClick={handleShare}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-xl border border-white/[0.1] text-[#555] hover:text-[#f0f0f0] hover:border-white/20 transition-colors"
                >
                  {shareCopied ? <Check size={13} className="text-green-400" /> : <Share2 size={13} />}
                </button>
              )}
              {/* Download/View button */}
              {isView ? (
                <a href={asset.downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 inline-flex items-center justify-center bg-white text-[#111] rounded-xl hover:bg-white/90 active:scale-95 transition-all">
                  <Eye size={16} />
                </a>
              ) : (
                <button onClick={handleDownload}
                  className="w-10 h-10 inline-flex items-center justify-center bg-white text-[#111] rounded-xl hover:bg-white/90 active:scale-95 transition-all">
                  <Download size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
