"use client";

import { useState } from "react";
import { Trash2, GripVertical, Pencil, Check, X } from "lucide-react";
import DocBlockRenderer from "./DocBlockRenderer";
import { useEditStore } from "@/lib/edit-store";
import type { DocBlock } from "@/lib/types";

// Editors
import HeadingEditor from "./editors/HeadingEditor";
import ParagraphEditor from "./editors/ParagraphEditor";
import ImageEditor from "./editors/ImageEditor";
import DoDontEditor from "./editors/DoDontEditor";
import ColourSwatchEditor from "./editors/ColourSwatchEditor";
import AssetEmbedEditor from "./editors/AssetEmbedEditor";
import CategoryEmbedEditor from "./editors/CategoryEmbedEditor";
import ColourPaletteEmbedEditor from "./editors/ColourPaletteEmbedEditor";
import DownloadCtaEditor from "./editors/DownloadCtaEditor";
import CodeSnippetEditor from "./editors/CodeSnippetEditor";
import TypographySampleEditor from "./editors/TypographySampleEditor";

interface DocBlockEditorProps {
  block: DocBlock;
  docPageId: string;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onDragOver: (e: React.DragEvent, targetId: string) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
}

function BlockEditorForm({ block, docPageId, onDone }: { block: DocBlock; docPageId: string; onDone: () => void }) {
  const { updateDocBlock } = useEditStore();

  const save = (changes: Partial<DocBlock>) => {
    updateDocBlock(docPageId, block.id, changes);
    onDone();
  };

  switch (block.type) {
    case "heading":
      return <HeadingEditor block={block} onSave={save} onCancel={onDone} />;
    case "paragraph":
      return <ParagraphEditor block={block} onSave={save} onCancel={onDone} />;
    case "image":
      return <ImageEditor block={block} onSave={save} onCancel={onDone} />;
    case "do-dont":
      return <DoDontEditor block={block} onSave={save} onCancel={onDone} />;
    case "colour-swatch":
      return <ColourSwatchEditor block={block} onSave={save} onCancel={onDone} />;
    case "asset-embed":
      return <AssetEmbedEditor block={block} onSave={save} onCancel={onDone} />;
    case "category-embed":
      return <CategoryEmbedEditor block={block} onSave={save} onCancel={onDone} />;
    case "colour-palette-embed":
      return <ColourPaletteEmbedEditor block={block} onSave={save} onCancel={onDone} />;
    case "download-cta":
      return <DownloadCtaEditor block={block} onSave={save} onCancel={onDone} />;
    case "code-snippet":
      return <CodeSnippetEditor block={block} onSave={save} onCancel={onDone} />;
    case "typography-sample":
      return <TypographySampleEditor block={block} onSave={save} onCancel={onDone} />;
    case "divider":
      onDone();
      return null;
    default:
      return null;
  }
}

const BLOCK_LABELS: Record<string, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  "do-dont": "Do / Don't",
  "colour-swatch": "Colour Swatch",
  "asset-embed": "Asset Embed",
  "category-embed": "Category Embed",
  "colour-palette-embed": "Colour Palette Embed",
  "download-cta": "Download CTA",
  divider: "Divider",
  "code-snippet": "Code Snippet",
  "typography-sample": "Typography",
};

export default function DocBlockEditor({ block, docPageId, onDragStart, onDragOver, onDrop }: DocBlockEditorProps) {
  const { deleteDocBlock } = useEditStore();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="border border-[#f77614] rounded-xl bg-[#1a1a1a] p-4 [animation:fade-up_0.15s_ease-out_forwards]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f77614]">
            {BLOCK_LABELS[block.type] ?? block.type}
          </span>
        </div>
        <BlockEditorForm block={block} docPageId={docPageId} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div
      className="group/block relative"
      draggable
      onDragStart={(e) => onDragStart(e, block.id)}
      onDragOver={(e) => onDragOver(e, block.id)}
      onDrop={(e) => onDrop(e, block.id)}
    >
      {/* Hover toolbar */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <button className="cursor-grab active:cursor-grabbing text-[#333] hover:text-[#888] transition-colors" title="Drag to reorder">
          <GripVertical size={14} />
        </button>
      </div>
      <div className="absolute -right-8 top-0 flex flex-col gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1 hover:bg-white/[0.08] text-[#686868] hover:text-[#f0f0f0] transition-colors"
          title="Edit block"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={() => deleteDocBlock(docPageId, block.id)}
          className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1 hover:bg-red-500/20 text-[#686868] hover:text-red-400 transition-colors"
          title="Delete block"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Block content */}
      <div className="rounded-xl border border-transparent hover:border-white/[0.05] p-2 -m-2 transition-colors">
        <DocBlockRenderer block={block} />
      </div>
    </div>
  );
}
