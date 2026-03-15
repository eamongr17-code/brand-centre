"use client";

import type { DocBlock } from "@/lib/types";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import ImageBlock from "./blocks/ImageBlock";
import DoDontBlock from "./blocks/DoDontBlock";
import ColourSwatchBlock from "./blocks/ColourSwatchBlock";
import AssetEmbedBlock from "./blocks/AssetEmbedBlock";
import CategoryEmbedBlock from "./blocks/CategoryEmbedBlock";
import ColourPaletteEmbedBlock from "./blocks/ColourPaletteEmbedBlock";
import DownloadCtaBlock from "./blocks/DownloadCtaBlock";
import DividerBlock from "./blocks/DividerBlock";
import CodeSnippetBlock from "./blocks/CodeSnippetBlock";
import TypographySampleBlock from "./blocks/TypographySampleBlock";

export default function DocBlockRenderer({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} />;
    case "paragraph":
      return <ParagraphBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "do-dont":
      return <DoDontBlock block={block} />;
    case "colour-swatch":
      return <ColourSwatchBlock block={block} />;
    case "asset-embed":
      return <AssetEmbedBlock block={block} />;
    case "category-embed":
      return <CategoryEmbedBlock block={block} />;
    case "colour-palette-embed":
      return <ColourPaletteEmbedBlock block={block} />;
    case "download-cta":
      return <DownloadCtaBlock block={block} />;
    case "divider":
      return <DividerBlock />;
    case "code-snippet":
      return <CodeSnippetBlock block={block} />;
    case "typography-sample":
      return <TypographySampleBlock block={block} />;
    default:
      return null;
  }
}
