"use client";

import { useState, useEffect } from "react";
import { Download, Eye, Pencil, Trash2, Check, X, Lock, HelpCircle, ChevronDown } from "lucide-react";
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
  const [showRules, setShowRules] = useState(false);

  // Re-sync local state when prop changes (e.g. after store update)
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
      <div className="border border-[#f77614] rounded-lg bg-[#242424] flex flex-col overflow-hidden [animation:fade-up_0.3s_ease-out_forwards]">
        <div className="bg-[#2d2d2d] h-36 shrink-0 rounded-t-lg overflow-hidden">
          <FadeImg src={previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4 space-y-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-sm font-semibold text-[#e8e8e8] placeholder-[#666]"
            placeholder="Asset name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs resize-none text-[#e8e8e8] placeholder-[#666]"
            rows={2}
            placeholder="Description"
          />
          <input
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs text-[#e8e8e8] placeholder-[#666]"
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
                  className="flex-1 bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs text-[#e8e8e8] placeholder-[#666]"
                  placeholder={i === rulesLines.length - 1 ? (i === 0 ? "e.g. Use on dark backgrounds only" : "Add another rule…") : ""}
                />
                {rule !== "" && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = rulesLines.filter((_, j) => j !== i);
                      const withTrailing = next[next.length - 1] !== "" ? [...next, ""] : next;
                      setRulesLines(withTrailing.length ? withTrailing : [""]);
                    }}
                    className="text-[#555] hover:text-red-400 transition-colors"
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
          <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded text-xs">
            <button
              type="button"
              onClick={() => setActionType("download")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors ${
                actionType === "download"
                  ? "bg-[#3a3a3a] text-[#e8e8e8]"
                  : "text-[#666] hover:text-[#888]"
              }`}
            >
              <Download size={11} />
              Download
            </button>
            <button
              type="button"
              onClick={() => setActionType("view")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors ${
                actionType === "view"
                  ? "bg-[#3a3a3a] text-[#e8e8e8]"
                  : "text-[#666] hover:text-[#888]"
              }`}
            >
              <Eye size={11} />
              View
            </button>
          </div>

          {/* Visibility toggle — owner only */}
          {canEdit && (
            <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded text-xs">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors ${
                  visibility === "public"
                    ? "bg-[#3a3a3a] text-[#e8e8e8]"
                    : "text-[#666] hover:text-[#888]"
                }`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setVisibility("internal")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors ${
                  visibility === "internal"
                    ? "bg-blue-900/60 text-blue-300"
                    : "text-[#666] hover:text-[#888]"
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
              className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded font-medium"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 text-xs border border-[#444] text-[#e8e8e8] px-3 py-1.5 rounded"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#333] rounded-lg bg-[#242424] hover:border-[#444] transition-colors relative group flex flex-col [animation:fade-up_0.3s_ease-out_forwards]">
      <div className="bg-[#2d2d2d] h-36 shrink-0 rounded-t-lg overflow-hidden">
        <FadeImg src={asset.previewImage || publicPath("/placeholder-asset.png")} fallbackSrc={publicPath("/placeholder-asset.png")} alt={asset.name} className="h-full w-full object-cover" />
      </div>

      {/* Internal badge — visible in owner/internal portals */}
      {isInternal && showInternal && (
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-900/70 text-blue-300 border border-blue-800/50">
            <Lock size={9} />
            Internal
          </span>
        </div>
      )}

      {editMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="bg-[#1a1a1a] border border-[#444] rounded p-1 hover:bg-[#2d2d2d]"
            title="Edit"
          >
            <Pencil size={12} className="text-[#e8e8e8]" />
          </button>
          <button
            onClick={() => deleteAsset(asset.id)}
            className="bg-[#1a1a1a] border border-[#444] rounded p-1 hover:bg-[#3a1a1a] text-red-400"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-sm text-[#e8e8e8]">{name}</h3>
        <p className="text-xs text-[#a0a0a0] flex-1">{description}</p>
        {asset.rules && asset.rules.length > 0 && (
          <div>
            <button
              onClick={() => setShowRules((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] text-[#555] hover:text-[#888] transition-colors"
            >
              <HelpCircle size={11} />
              Usage rules
              <ChevronDown size={10} className={`transition-transform ${showRules ? "rotate-180" : ""}`} />
            </button>
            {showRules && (
              <ul className="mt-1.5 space-y-1">
                {asset.rules.map((rule, i) => (
                  <li key={i} className="flex gap-1.5 text-[11px] text-[#888] leading-snug">
                    <span className="mt-0.5 shrink-0 text-[#555]">—</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-xs text-[#666]">
            {fileType}{fileSize ? ` · ${fileSize}` : ""}
          </span>
          {isView ? (
            <a
              href={asset.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black px-3 py-1.5 rounded hover:opacity-80 active:scale-95 transition-all duration-150"
              title="View"
            >
              <Eye size={12} />
            </a>
          ) : (
            <a
              href={asset.downloadUrl}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black px-3 py-1.5 rounded hover:opacity-80 active:scale-95 transition-all duration-150"
              title="Download"
            >
              <Download size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
