"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Eye, Pencil, Trash2, Check, X, Lock, HelpCircle } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { usePortal } from "@/lib/portal-context";
import ImageUploader from "@/components/ImageUploader";
import FadeImg from "@/components/FadeImg";
import { publicPath } from "@/lib/public-path";
import type { Asset } from "@/lib/types";

export default function AssetCard({ asset }: { asset: Asset }) {
  const { editMode, updateAsset, deleteAsset } = useEditStore();
  const { canEdit, showInternal } = usePortal();
  const [editing, setEditing] = useState(false);
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
  const [rulesOpen, setRulesOpen] = useState(false);
  const rulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rulesOpen) return;
    const handler = (e: MouseEvent) => {
      if (rulesRef.current && !rulesRef.current.contains(e.target as Node)) {
        setRulesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [rulesOpen]);

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
    setEditing(false);
  };

  const isView = (asset.actionType ?? "download") === "view";
  const isInternal = (asset.visibility ?? "public") === "internal";

  if (editing) {
    return (
      <div className="border border-[#f77614] rounded-xl bg-[#161616] flex flex-col overflow-hidden [animation:fade-up_0.3s_ease-out_forwards]">
        <div className="bg-white/[0.02] h-36 shrink-0 rounded-t-xl overflow-hidden">
          <FadeImg src={previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4 space-y-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="Asset name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs resize-none text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
            rows={2}
            placeholder="Description"
          />
          <input
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
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
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
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
                  ? "bg-white/[0.08] text-[#ececec] font-semibold"
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
                  ? "bg-white/[0.08] text-[#ececec] font-semibold"
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
                    ? "bg-white/[0.08] text-[#ececec] font-semibold"
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
              className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl relative group flex flex-col [animation:fade-up_0.3s_ease-out_forwards]">
      <div className="bg-white/[0.02] h-36 shrink-0 rounded-t-xl overflow-hidden">
        <FadeImg src={asset.previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt={asset.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>

      {/* Internal badge */}
      {isInternal && showInternal && (
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-900/70 text-blue-300 border border-blue-800/50 backdrop-blur-sm">
            <Lock size={9} />
            Internal
          </span>
        </div>
      )}

      {editMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1.5 hover:bg-white/[0.08] transition-colors"
            title="Edit"
          >
            <Pencil size={12} className="text-[#ececec]" />
          </button>
          <button
            onClick={() => deleteAsset(asset.id)}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1.5 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-sm text-[#ececec]">{name}</h3>
        <p className="text-xs text-[#787878] flex-1 leading-relaxed">{description}</p>
        {asset.rules && asset.rules.length > 0 && (
          <div className="relative" ref={rulesRef}>
            <button
              onClick={() => setRulesOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] text-[#484848] hover:text-[#888] transition-colors"
            >
              <HelpCircle size={11} />
              Usage rules
            </button>
            {rulesOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#161616]/95 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-3 z-50">
                <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.15em] mb-2">Usage rules</p>
                <ul className="space-y-1.5">
                  {asset.rules.map((rule, i) => (
                    <li key={i} className="flex gap-1.5 text-[11px] text-[#787878] leading-snug">
                      <span className="shrink-0 text-[#444]">—</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-xs text-[#555]">
            {fileType}{fileSize ? ` · ${fileSize}` : ""}
          </span>
          {isView ? (
            <a
              href={asset.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
              title="View"
            >
              <Eye size={12} />
            </a>
          ) : (
            <button
              onClick={async () => {
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
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
              title="Download"
            >
              <Download size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
