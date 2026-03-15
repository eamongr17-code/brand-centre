export interface BrandColour {
  id: string;
  name: string;
  hex: string;
  /** Manual overrides – when set these are displayed instead of auto-computed values */
  rgbOverride?: string;
  hslOverride?: string;
  cmykOverride?: string;
}

export interface BrandColourEntry extends BrandColour {
  categoryId: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  heroImageUrl: string;
}

export interface SubBrand {
  id: string;
  parentBrandId: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  brandId: string;
  subBrandId?: string;
  name: string;
  slug: string;
  description: string;
  previewImage: string;
  downloadAllUrl: string;
  assetCount: number;
  sortOrder: number;
  categoryType?: "assets" | "colours";
  actionType?: "download" | "view";
  visibility?: "public" | "internal";
  lastEditedAt?: string;
}

export interface BrandSection {
  id: string;
  brandId: string;
  name: string;
  sortOrder: number;
  /** True if this section is backed by a real SubBrand from mock-data */
  isSubBrandBacked?: boolean;
  /** The SubBrand id this section represents (only set when isSubBrandBacked=true) */
  subBrandId?: string;
}

export interface QuickLink {
  id: string;
  brandId: string;
  label: string;
  url: string;
  sortOrder: number;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface Asset {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  previewImage: string;
  featured: boolean;
  sortOrder: number;
  actionType?: "download" | "view";
  visibility?: "public" | "internal";
  rules?: string[];
  lastEditedAt?: string;
  tags?: string[];
}

// ── Documentation types ──────────────────────────────────────────────────

export type DocBlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "do-dont"
  | "colour-swatch"
  | "asset-embed"
  | "category-embed"
  | "colour-palette-embed"
  | "download-cta"
  | "divider"
  | "code-snippet"
  | "typography-sample";

export interface DocBlockBase {
  id: string;
  type: DocBlockType;
  sortOrder: number;
}

export interface HeadingBlock extends DocBlockBase {
  type: "heading";
  text: string;
  level: "h1" | "h2" | "h3";
}

export interface ParagraphBlock extends DocBlockBase {
  type: "paragraph";
  text: string;
}

export interface ImageBlock extends DocBlockBase {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
  fullWidth?: boolean;
}

export interface DoDontBlock extends DocBlockBase {
  type: "do-dont";
  doImage: string;
  doCaption: string;
  dontImage: string;
  dontCaption: string;
}

export interface ColourSwatchBlock extends DocBlockBase {
  type: "colour-swatch";
  colours: { name: string; hex: string }[];
}

export interface AssetEmbedBlock extends DocBlockBase {
  type: "asset-embed";
  assetId: string;
  displayMode?: "compact" | "full";
}

export interface CategoryEmbedBlock extends DocBlockBase {
  type: "category-embed";
  categoryId: string;
  brandId: string;
}

export interface ColourPaletteEmbedBlock extends DocBlockBase {
  type: "colour-palette-embed";
  categoryId: string;
  brandId: string;
}

export interface DownloadCtaBlock extends DocBlockBase {
  type: "download-cta";
  label: string;
  url: string;
  description?: string;
}

export interface DividerBlock extends DocBlockBase {
  type: "divider";
}

export interface CodeSnippetBlock extends DocBlockBase {
  type: "code-snippet";
  language: string;
  code: string;
}

export interface TypographySampleBlock extends DocBlockBase {
  type: "typography-sample";
  fontFamily: string;
  weights: string[];
  sampleText: string;
}

export type DocBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | DoDontBlock
  | ColourSwatchBlock
  | AssetEmbedBlock
  | CategoryEmbedBlock
  | ColourPaletteEmbedBlock
  | DownloadCtaBlock
  | DividerBlock
  | CodeSnippetBlock
  | TypographySampleBlock;

export interface DocPage {
  id: string;
  brandId: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  blocks: DocBlock[];
  sortOrder: number;
  visibility?: "public" | "internal";
  lastEditedAt?: string;
}
