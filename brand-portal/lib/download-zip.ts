import { zipSync } from "fflate";
import type { Asset } from "./types";

export async function downloadAssetsAsZip(
  assets: Asset[],
  zipName: string
): Promise<void> {
  const files: Record<string, Uint8Array> = {};
  const seen = new Set<string>();

  await Promise.all(
    assets
      .filter((a) => a.downloadUrl && a.downloadUrl !== "#")
      .map(async (a) => {
        try {
          const res = await fetch(a.downloadUrl);
          const buf = new Uint8Array(await res.arrayBuffer());
          const ext =
            a.downloadUrl.split(".").pop()?.split("?")[0] || "bin";
          let name = (a.name || "asset").replace(/[^a-z0-9.\-_ ]/gi, "_");
          if (!name.includes(".")) name = `${name}.${ext}`;
          while (seen.has(name)) name = `_${name}`;
          seen.add(name);
          files[name] = buf;
        } catch {}
      })
  );

  if (Object.keys(files).length === 0) return;

  const zipped = zipSync(files, { level: 0 });
  const blob = new Blob([zipped.buffer as ArrayBuffer], {
    type: "application/zip",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
