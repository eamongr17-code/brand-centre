const MIME_MAP: Record<string, string> = {
  // Images
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", svg: "image/svg+xml", avif: "image/avif",
  tiff: "image/tiff", tif: "image/tiff", bmp: "image/bmp", ico: "image/x-icon",
  // Vector / Design
  eps: "application/postscript", ai: "application/postscript",
  psd: "image/vnd.adobe.photoshop", indd: "application/x-indesign",
  sketch: "application/zip", fig: "application/zip", xd: "application/zip",
  // Documents
  pdf: "application/pdf",
  // Video
  mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm",
  avi: "video/x-msvideo", mkv: "video/x-matroska",
  // Audio
  mp3: "audio/mpeg", wav: "audio/wav", aac: "audio/aac",
  ogg: "audio/ogg", flac: "audio/flac", m4a: "audio/mp4",
  // Fonts
  otf: "font/otf", ttf: "font/ttf", woff: "font/woff", woff2: "font/woff2",
  // Archives
  zip: "application/zip", rar: "application/x-rar-compressed",
};

/** Resolve a reliable MIME type from the file extension, falling back to the browser's type. */
export function getMimeType(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return MIME_MAP[ext] || file.type || "application/octet-stream";
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
