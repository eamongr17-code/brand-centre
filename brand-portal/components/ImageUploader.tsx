"use client";

import { useRef, useState } from "react";
import { Upload, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getMimeType } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
}

export default function ImageUploader({
  value,
  onChange,
  placeholder = "Image URL (https://...)",
  accept = "image/*,video/*,audio/*,.pdf,.eps,.ai,.psd,.svg,.mp4,.mov,.mp3,.wav,.aac,.webm,.gif,.webp,.avif,.tiff,.bmp,.indd",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
      const key = `${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(key, file, { contentType: getMimeType(file) });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("assets").getPublicUrl(key);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs font-mono text-[#e8e8e8] placeholder-[#666] min-w-0"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-2 py-1 bg-[#2d2d2d] border border-[#444] rounded text-[#888] hover:text-[#e8e8e8] hover:border-[#666] transition-colors disabled:opacity-50"
          title="Upload file"
        >
          {uploading ? <Loader size={12} className="animate-spin" /> : <Upload size={12} />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
