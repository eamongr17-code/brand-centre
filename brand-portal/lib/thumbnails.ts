const MAX_WIDTH = 640;
const MAX_HEIGHT = 360; // 16:9
const ASPECT = 16 / 9;

export async function generateThumbnail(file: File): Promise<Blob | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "bmp", "ico", "tiff", "tif"].includes(ext)) {
    return imageToThumbnail(file);
  }

  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext)) {
    return videoToThumbnail(file);
  }

  // No thumbnail for audio, fonts, documents, design files, archives
  return null;
}

function cropTo16x9(ctx: CanvasRenderingContext2D, source: CanvasImageSource, srcW: number, srcH: number) {
  const srcAspect = srcW / srcH;
  let sx = 0, sy = 0, sw = srcW, sh = srcH;
  if (srcAspect > ASPECT) {
    // Source is wider — crop sides
    sw = srcH * ASPECT;
    sx = (srcW - sw) / 2;
  } else {
    // Source is taller — crop top/bottom
    sh = srcW / ASPECT;
    sy = (srcH - sh) / 2;
  }
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, MAX_WIDTH, MAX_HEIGHT);
}

function imageToThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = MAX_WIDTH;
      canvas.height = MAX_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      cropTo16x9(ctx, img, img.width, img.height);
      canvas.toBlob((blob) => resolve(blob), "image/webp", 0.8);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => { resolve(null); URL.revokeObjectURL(img.src); };
    img.src = URL.createObjectURL(file);
  });
}

function videoToThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = MAX_WIDTH;
      canvas.height = MAX_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      cropTo16x9(ctx, video, video.videoWidth, video.videoHeight);
      canvas.toBlob((blob) => resolve(blob), "image/webp", 0.8);
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => { resolve(null); URL.revokeObjectURL(video.src); };
    video.src = URL.createObjectURL(file);
  });
}
