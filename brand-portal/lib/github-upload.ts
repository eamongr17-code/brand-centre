import type { GitHubConfig } from "./types";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/png;base64,")
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadToGitHub(
  file: File,
  config: GitHubConfig
): Promise<string> {
  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
  const filename = `${Date.now()}-${safeName}`;
  const repoPath = `${config.imagePath}/${filename}`.replace(/\/+/g, "/").replace(/^\//, "");
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${repoPath}`;
  const base64 = await fileToBase64(file);

  // Fetch existing SHA if file already exists (required to update)
  let sha: string | undefined;
  try {
    const existing = await fetch(apiUrl, {
      headers: { Authorization: `token ${config.token}` },
    });
    if (existing.ok) {
      const existingData = await existing.json();
      sha = existingData.sha;
    }
  } catch {
    // File doesn't exist yet — that's fine
  }

  const body: Record<string, string> = {
    message: `Upload image: ${filename}`,
    content: base64,
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      `GitHub upload failed (${res.status}): ${errData.message ?? res.statusText}`
    );
  }

  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${repoPath}`;
}
