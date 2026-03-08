"use client";

import { useState } from "react";
import { X, Check, Github } from "lucide-react";
import { useEditStore } from "@/lib/edit-store";
import type { GitHubConfig } from "@/lib/types";

interface GitHubSettingsModalProps {
  onClose: () => void;
}

export default function GitHubSettingsModal({ onClose }: GitHubSettingsModalProps) {
  const { getGitHubConfig, setGitHubConfig } = useEditStore();
  const existing = getGitHubConfig();

  const [owner, setOwner] = useState(existing?.owner ?? "");
  const [repo, setRepo] = useState(existing?.repo ?? "");
  const [branch, setBranch] = useState(existing?.branch ?? "main");
  const [token, setToken] = useState(existing?.token ?? "");
  const [imagePath, setImagePath] = useState(existing?.imagePath ?? "public/images");

  const save = () => {
    if (!owner.trim() || !repo.trim() || !token.trim()) return;
    const config: GitHubConfig = {
      owner: owner.trim(),
      repo: repo.trim(),
      branch: branch.trim() || "main",
      token: token.trim(),
      imagePath: imagePath.trim() || "public/images",
    };
    setGitHubConfig(config);
    onClose();
  };

  const disconnect = () => {
    setGitHubConfig(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-[#e8e8e8] font-semibold">
            <Github size={18} />
            GitHub Image Storage
          </div>
          <button onClick={onClose} className="text-[#666] hover:text-[#aaa] transition-colors">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-[#888] mb-5 leading-relaxed">
          Images uploaded in edit mode will be committed to your GitHub repo and served via
          raw.githubusercontent.com. Create a Personal Access Token with{" "}
          <strong className="text-[#aaa]">repo</strong> scope.
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#888] mb-1">Owner / Org</label>
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="your-username"
                className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#555]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Repository</label>
              <input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="brand-centre"
                className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#555]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#888] mb-1">Branch</label>
              <input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#555]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Image folder</label>
              <input
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                placeholder="public/images"
                className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#555]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#888] mb-1">Personal Access Token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              placeholder="ghp_••••••••••••••••••••"
              className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-sm font-mono text-[#e8e8e8] placeholder-[#555]"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={save}
            disabled={!owner.trim() || !repo.trim() || !token.trim()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-white text-black px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={14} />
            Save settings
          </button>
          {existing && (
            <button
              onClick={disconnect}
              className="text-sm border border-[#444] text-red-400 px-4 py-2 rounded hover:bg-[#2d1515] transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>

        {existing && (
          <p className="text-xs text-green-500 mt-3 text-center">
            Connected to {existing.owner}/{existing.repo} ({existing.branch})
          </p>
        )}
      </div>
    </div>
  );
}
