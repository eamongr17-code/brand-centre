"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader, FolderUp } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import { supabase } from "@/lib/supabase";
import { generateThumbnail } from "@/lib/thumbnails";
import { getMimeType } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = new Set([
  // Images
  "png", "jpg", "jpeg", "svg", "webp", "gif", "avif", "tiff", "tif", "bmp", "ico",
  // Vector / Design
  "ai", "eps", "psd", "indd", "sketch", "fig", "xd",
  // Documents
  "pdf",
  // Video
  "mp4", "mov", "webm", "avi", "mkv",
  // Audio
  "mp3", "wav", "aac", "ogg", "flac", "m4a",
  // Fonts
  "otf", "ttf", "woff", "woff2",
  // Archives
  "zip", "rar",
]);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface BulkUploaderProps {
  categoryId: string;
}

export default function BulkUploader({ categoryId }: BulkUploaderProps) {
  const { addAssetBulk } = useEditStore();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = useCallback(async (files: File[]) => {
    const filtered = files.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      return ACCEPTED_EXTENSIONS.has(ext);
    });
    if (filtered.length === 0) return;

    setUploading(true);
    setProgress({ done: 0, total: filtered.length });

    const concurrency = 3;
    const assets: Array<{
      name: string;
      description: string;
      fileType: string;
      fileSize: string;
      downloadUrl: string;
      previewImage: string;
      featured: boolean;
      sortOrder: number;
      lastEditedAt: string;
      tags: string[];
    }> = [];

    let done = 0;

    const processFile = async (file: File) => {
      const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
      const key = `${Date.now()}-${safeName}`;
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

      try {
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(key, file, { contentType: getMimeType(file) });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("assets").getPublicUrl(key);
        const downloadUrl = urlData.publicUrl;

        // Generate thumbnail
        let previewImage = "";
        try {
          const thumbBlob = await generateThumbnail(file);
          if (thumbBlob) {
            const thumbKey = `thumb-${Date.now()}-${safeName.replace(/\.[^.]+$/, "")}.webp`;
            const { error: thumbError } = await supabase.storage
              .from("assets")
              .upload(thumbKey, thumbBlob, { contentType: "image/webp" });
            if (!thumbError) {
              const { data: thumbUrl } = supabase.storage.from("assets").getPublicUrl(thumbKey);
              previewImage = thumbUrl.publicUrl;
            }
          }
        } catch {}

        const displayName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        assets.push({
          name: displayName,
          description: "",
          fileType: ext.toUpperCase(),
          fileSize: formatBytes(file.size),
          downloadUrl,
          previewImage,
          featured: false,
          sortOrder: 999 + done,
          lastEditedAt: new Date().toISOString(),
          tags: [],
        });
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }

      done++;
      setProgress({ done, total: filtered.length });
    };

    // Process with concurrency limit
    const queue = [...filtered];
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (file) await processFile(file);
      }
    });
    await Promise.all(workers);

    if (assets.length > 0) {
      addAssetBulk(categoryId, assets);
    }

    setUploading(false);
  }, [categoryId, addAssetBulk]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files: File[] = [];
    const items = e.dataTransfer.items;

    if (items) {
      const entries: FileSystemEntry[] = [];
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) entries.push(entry);
      }

      const readEntry = async (entry: FileSystemEntry): Promise<File[]> => {
        if (entry.isFile) {
          return new Promise((resolve) => {
            (entry as FileSystemFileEntry).file((f) => resolve([f]), () => resolve([]));
          });
        } else if (entry.isDirectory) {
          const dirReader = (entry as FileSystemDirectoryEntry).createReader();
          const entries = await new Promise<FileSystemEntry[]>((resolve) => {
            dirReader.readEntries((e) => resolve(e), () => resolve([]));
          });
          const nested = await Promise.all(entries.map(readEntry));
          return nested.flat();
        }
        return [];
      };

      const nested = await Promise.all(entries.map(readEntry));
      files.push(...nested.flat());
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    }

    processFiles(files);
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  }, [processFiles]);

  if (uploading) {
    return (
      <div className="mb-6 border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center">
        <Loader size={20} className="animate-spin mx-auto mb-2 text-[#f77614]" />
        <p className="text-sm text-[#ececec] font-semibold">
          Uploading {progress.done} / {progress.total}
        </p>
        <div className="mt-3 w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#f77614] h-full rounded-full transition-all duration-300"
            style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        dragOver
          ? "border-[#f77614] bg-[#f77614]/[0.04]"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <Upload size={24} className="mx-auto mb-2 text-[#484848]" />
      <p className="text-sm text-[#787878] mb-3">
        Drop files or folders here, or choose below
      </p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-all duration-200"
        >
          <Upload size={12} />
          Choose files
        </button>
        <button
          onClick={() => folderInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-all duration-200"
        >
          <FolderUp size={12} />
          Choose folder
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.eps,.ai,.psd,.indd,.svg,.mp4,.mov,.mp3,.wav,.aac,.webm,.otf,.ttf,.woff,.woff2,.zip,.rar,.sketch,.fig,.xd"
        className="hidden"
        onChange={handleFileInput}
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is not in types
        webkitdirectory=""
        multiple
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
