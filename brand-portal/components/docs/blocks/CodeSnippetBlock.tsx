"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CodeSnippetBlock as CodeSnippetBlockType } from "@/lib/types";

export default function CodeSnippetBlock({ block }: { block: CodeSnippetBlockType }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(block.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/[0.04]">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#444]">
          {block.language}
        </span>
        <button
          onClick={copyCode}
          className="text-[#484848] hover:text-[#ececec] transition-colors p-1"
          title="Copy code"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-sm font-mono text-[#b0b0b0] bg-[#0a0a0a] leading-relaxed">
        <code>{block.code || "// No code yet"}</code>
      </pre>
    </div>
  );
}
