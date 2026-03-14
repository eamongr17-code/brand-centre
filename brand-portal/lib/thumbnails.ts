const MAX_SIZE = 400;

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

function imageToThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob), "image/webp", 0.8);
    };
    img.onerror = () => resolve(null);
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
      const scale = Math.min(MAX_SIZE / video.videoWidth, MAX_SIZE / video.videoHeight, 1);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob), "image/webp", 0.8);
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => { resolve(null); URL.revokeObjectURL(video.src); };
    video.src = URL.createObjectURL(file);
  });
}
