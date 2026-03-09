import type { Brand, SubBrand, Category, Asset, QuickLink, BrandColourEntry } from "@/lib/types";

export const brands: Brand[] = [
  {
    id: "easygo",
    name: "Easygo",
    slug: "easygo",
    color: "#FFFFFF",
    description: "Parent brand assets including corporate identity and shared resources.",
    heroImageUrl: "",
  },
  {
    id: "stake",
    name: "Stake",
    slug: "stake",
    color: "#00E701",
    description: "Stake brand assets — logos, icons, and marketing materials.",
    heroImageUrl: "",
  },
  {
    id: "kick",
    name: "KICK",
    slug: "kick",
    color: "#53FC18",
    description: "KICK brand assets — logos, overlays, and streaming graphics.",
    heroImageUrl: "",
  },
  {
    id: "moon",
    name: "Moon",
    slug: "moon",
    color: "#8B5CF6",
    description: "Moon brand assets — logos and promotional materials.",
    heroImageUrl: "",
  },
];

export const subBrands: SubBrand[] = [
  {
    id: "stake-originals",
    parentBrandId: "stake",
    name: "Stake Originals",
    slug: "stake-originals",
    color: "#00E701",
    description: "Exclusive Stake Originals game brand assets.",
    sortOrder: 1,
  },
  {
    id: "stake-sports",
    parentBrandId: "stake",
    name: "Stake Sports",
    slug: "stake-sports",
    color: "#00C2FF",
    description: "Stake Sports betting brand assets.",
    sortOrder: 2,
  },
];

export const categories: Category[] = [
  // Easygo
  {
    id: "easygo-logos",
    brandId: "easygo",
    name: "Logos",
    slug: "logos",
    description: "Primary and alternate Easygo logo files in all formats.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 8,
    sortOrder: 1,
  },
  {
    id: "easygo-brand-guidelines",
    brandId: "easygo",
    name: "Brand Guidelines",
    slug: "brand-guidelines",
    description: "Official Easygo brand usage guidelines and colour palette.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 3,
    sortOrder: 2,
  },
  {
    id: "easygo-colours",
    brandId: "easygo",
    name: "Brand Colours",
    slug: "brand-colours",
    categoryType: "colours",
    description: "Official Easygo brand colour palette.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 3,
    sortOrder: 99,
  },

  // Stake
  {
    id: "stake-logos",
    brandId: "stake",
    name: "Logos",
    slug: "logos",
    description: "Primary and alternate Stake logo files in all formats.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 12,
    sortOrder: 1,
  },
  {
    id: "stake-icons",
    brandId: "stake",
    name: "Icons",
    slug: "icons",
    description: "App icons and favicon sets.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 6,
    sortOrder: 2,
  },
  {
    id: "stake-marketing",
    brandId: "stake",
    name: "Marketing",
    slug: "marketing",
    description: "Banners, social templates, and promotional graphics.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 20,
    sortOrder: 3,
  },
  {
    id: "stake-colours",
    brandId: "stake",
    name: "Brand Colours",
    slug: "brand-colours",
    categoryType: "colours",
    description: "Official Stake brand colour palette.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 3,
    sortOrder: 99,
  },

  // Stake Originals (sub-brand)
  {
    id: "stake-originals-logos",
    brandId: "stake",
    subBrandId: "stake-originals",
    name: "Logos",
    slug: "logos",
    description: "Stake Originals logo lockups and variants.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 5,
    sortOrder: 1,
  },

  // Stake Sports (sub-brand)
  {
    id: "stake-sports-logos",
    brandId: "stake",
    subBrandId: "stake-sports",
    name: "Logos",
    slug: "logos",
    description: "Stake Sports logo lockups and variants.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 4,
    sortOrder: 1,
  },

  // KICK
  {
    id: "kick-logos",
    brandId: "kick",
    name: "Logos",
    slug: "logos",
    description: "Primary and alternate KICK logo files in all formats.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 10,
    sortOrder: 1,
  },
  {
    id: "kick-overlays",
    brandId: "kick",
    name: "Stream Overlays",
    slug: "stream-overlays",
    description: "Ready-to-use streaming overlays and alerts.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 15,
    sortOrder: 2,
  },
  {
    id: "kick-colours",
    brandId: "kick",
    name: "Brand Colours",
    slug: "brand-colours",
    categoryType: "colours",
    description: "Official KICK brand colour palette.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 3,
    sortOrder: 99,
  },

  // Moon
  {
    id: "moon-logos",
    brandId: "moon",
    name: "Logos",
    slug: "logos",
    description: "Primary and alternate Moon logo files in all formats.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 7,
    sortOrder: 1,
  },
  {
    id: "moon-marketing",
    brandId: "moon",
    name: "Marketing",
    slug: "marketing",
    description: "Promotional and marketing materials for Moon.",
    previewImage: "",
    downloadAllUrl: "#",
    assetCount: 9,
    sortOrder: 2,
  },
];

export const mockColours: BrandColourEntry[] = [
  // Easygo
  { id: "easygo-white", categoryId: "easygo-colours", name: "Brand White", hex: "#FFFFFF" },
  { id: "easygo-dark", categoryId: "easygo-colours", name: "Brand Dark", hex: "#1A1A1A" },
  { id: "easygo-grey", categoryId: "easygo-colours", name: "Brand Grey", hex: "#8A8A8A" },
  // Stake
  { id: "stake-green", categoryId: "stake-colours", name: "Stake Green", hex: "#00E701" },
  { id: "stake-black", categoryId: "stake-colours", name: "Stake Black", hex: "#0B0B0B" },
  { id: "stake-white", categoryId: "stake-colours", name: "Stake White", hex: "#FFFFFF" },
  // KICK
  { id: "kick-green", categoryId: "kick-colours", name: "KICK Green", hex: "#53FC18" },
  { id: "kick-black", categoryId: "kick-colours", name: "KICK Black", hex: "#0A0E0A" },
  { id: "kick-white", categoryId: "kick-colours", name: "KICK White", hex: "#FFFFFF" },
];

export const assets: Asset[] = [
  // Stake logos
  {
    id: "stake-logo-primary-dark",
    categoryId: "stake-logos",
    name: "Primary Logo — Dark",
    description: "Full colour logo on dark background.",
    fileType: "SVG + PNG",
    fileSize: "248 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "stake-logo-primary-light",
    categoryId: "stake-logos",
    name: "Primary Logo — Light",
    description: "Full colour logo on light background.",
    fileType: "SVG + PNG",
    fileSize: "248 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "stake-logo-wordmark",
    categoryId: "stake-logos",
    name: "Wordmark",
    description: "Text-only wordmark lockup.",
    fileType: "SVG + PNG",
    fileSize: "124 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: false,
    sortOrder: 3,
    visibility: "internal",
  },
  {
    id: "stake-logo-icon",
    categoryId: "stake-logos",
    name: "Icon Mark",
    description: "Standalone icon / bug.",
    fileType: "SVG + PNG",
    fileSize: "88 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: false,
    sortOrder: 4,
    visibility: "internal",
  },

  // KICK logos
  {
    id: "kick-logo-primary",
    categoryId: "kick-logos",
    name: "Primary Logo — Green",
    description: "KICK primary logo on dark background.",
    fileType: "SVG + PNG",
    fileSize: "312 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "kick-logo-white",
    categoryId: "kick-logos",
    name: "Logo — White",
    description: "White version for dark backgrounds.",
    fileType: "SVG + PNG",
    fileSize: "298 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: false,
    sortOrder: 2,
  },

  // Easygo logos
  {
    id: "easygo-logo-primary",
    categoryId: "easygo-logos",
    name: "Primary Logo",
    description: "Easygo master logo lockup.",
    fileType: "SVG + PNG",
    fileSize: "200 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: true,
    sortOrder: 1,
  },

  // Moon logos
  {
    id: "moon-logo-primary",
    categoryId: "moon-logos",
    name: "Primary Logo",
    description: "Moon primary logo.",
    fileType: "SVG + PNG",
    fileSize: "180 KB",
    downloadUrl: "#",
    previewImage: "",
    featured: true,
    sortOrder: 1,
  },
];

export const quickLinks: QuickLink[] = [
  // Easygo
  { id: "ql-easygo-1", brandId: "easygo", label: "Easygo.io", url: "https://easygo.io", sortOrder: 1 },
  { id: "ql-easygo-2", brandId: "easygo", label: "Press Kit", url: "https://easygo.io/press", sortOrder: 2 },

  // Stake
  { id: "ql-stake-1", brandId: "stake", label: "Stake.com", url: "https://stake.com", sortOrder: 1 },
  { id: "ql-stake-2", brandId: "stake", label: "Stake Sports", url: "https://sports.stake.com", sortOrder: 2 },
  { id: "ql-stake-3", brandId: "stake", label: "Stake on X", url: "https://x.com/stake", sortOrder: 3 },
  { id: "ql-stake-4", brandId: "stake", label: "Stake Instagram", url: "https://instagram.com/stake", sortOrder: 4 },

  // KICK
  { id: "ql-kick-1", brandId: "kick", label: "Kick.com", url: "https://kick.com", sortOrder: 1 },
  { id: "ql-kick-2", brandId: "kick", label: "KICK on X", url: "https://x.com/kickstreaming", sortOrder: 2 },
  { id: "ql-kick-3", brandId: "kick", label: "KICK Instagram", url: "https://instagram.com/kick", sortOrder: 3 },

  // Moon
  { id: "ql-moon-1", brandId: "moon", label: "Moon Casino", url: "https://moon.com", sortOrder: 1 },
  { id: "ql-moon-2", brandId: "moon", label: "Moon on X", url: "https://x.com/moon", sortOrder: 2 },
];

// Helpers
export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getCategoriesForBrand(brandId: string): Category[] {
  return categories
    .filter((c) => c.brandId === brandId && !c.subBrandId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getSubBrandsForBrand(brandId: string): SubBrand[] {
  return subBrands
    .filter((s) => s.parentBrandId === brandId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoriesForSubBrand(subBrandId: string): Category[] {
  return categories
    .filter((c) => c.subBrandId === subBrandId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryBySlug(
  brandId: string,
  slug: string
): Category | undefined {
  return categories.find((c) => c.brandId === brandId && c.slug === slug);
}

export function getQuickLinksForBrand(brandId: string): QuickLink[] {
  return quickLinks
    .filter((l) => l.brandId === brandId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAssetsForCategory(categoryId: string): Asset[] {
  return assets
    .filter((a) => a.categoryId === categoryId)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.sortOrder - b.sortOrder;
    });
}

export function getColoursForCategory(categoryId: string): BrandColourEntry[] {
  return mockColours.filter((c) => c.categoryId === categoryId);
}
