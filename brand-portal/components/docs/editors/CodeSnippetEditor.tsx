"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { CodeSnippetBlock, DocBlock } from "@/lib/types";

export default function CodeSnippetEditor({ block, onSave, onCancel }: { block: CodeSnippetBlock; onSave: (c: Partial<DocBlock>) => void; onCancel: () => void }) {
  const [language, setLanguage] = useState(block.language);
  const [code, setCode] = useState(block.code);

  return (
    <div className="space-y-2">
      <input
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15]"
        placeholder="Language (e.g. html, css, javascript)"
      />
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm font-mono text-[#b0b0b0] placeholder-[#444] focus:outline-none focus:border-white/[0.15] resize-none"
        rows={8}
        placeholder="Paste code here..."
        autoFocus
      />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ language, code })} className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90">
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}
