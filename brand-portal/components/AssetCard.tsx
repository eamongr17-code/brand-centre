"use client";

import { useState, useEffect } from "react";
import { Download, Eye, Pencil, Trash2, Check, X } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import ImageUploader from "@/components/ImageUploader";
import type { Asset } from "@/lib/types";

export default function AssetCard({ asset }: { asset: Asset }) {
  const { editMode, updateAsset, deleteAsset } = useEditStore();
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
    setEditing(false);
  };

  const isView = (asset.actionType ?? "download") === "view";

  if (editing) {
    return (
      <div className="border border-amber-500 rounded-lg bg-[#242424] flex flex-col overflow-hidden">
        <div className="bg-[#2d2d2d] h-36 flex items-center justify-center text-[#666] text-xs shrink-0 rounded-t-lg overflow-hidden">
          {previewImage ? (
            <img src={previewImage} alt="" className="h-full w-full object-contain" />
          ) : (
            <span>No preview image</span>
          )}
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
          <div className="flex gap-2">
            <input
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="flex-1 bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs text-[#e8e8e8] placeholder-[#666]"
              placeholder="File type (e.g. SVG + PNG)"
            />
            <input
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              className="flex-1 bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs text-[#e8e8e8] placeholder-[#666]"
              placeholder="File size"
            />
          </div>
          <ImageUploader
            value={previewImage}
            onChange={setPreviewImage}
            placeholder="Preview image URL (https://...)"
          />
          <input
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs font-mono text-[#e8e8e8] placeholder-[#666]"
            placeholder="URL (https://...)"
          />

          {/* Action type toggle */}
          <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded text-xs">
            <button
              type="button"
              onClick={() => setActionType("download")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors ${
                actionType === "download"
                  ? "bg-[#3a3a3a] text-[#e8e8e8]"
                  : "text-[#555] hover:text-[#888]"
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
                  : "text-[#555] hover:text-[#888]"
              }`}
            >
              <Eye size={11} />
              View
            </button>
          </div>

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
    <div className="border border-[#333] rounded-lg bg-[#242424] hover:border-[#444] transition-colors relative group flex flex-col">
      <div className="bg-[#2d2d2d] h-36 flex items-center justify-center text-[#555] text-xs shrink-0 rounded-t-lg overflow-hidden">
        {asset.previewImage ? (
          <img src={asset.previewImage} alt={asset.name} className="h-full w-full object-contain" />
        ) : (
          <span>No preview</span>
        )}
      </div>
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
