"use client";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  placeholder = "Image URL (https://...)",
}: ImageUploaderProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#2d2d2d] border border-[#444] rounded px-2 py-1 text-xs font-mono text-[#e8e8e8] placeholder-[#666]"
      placeholder={placeholder}
    />
  );
}
