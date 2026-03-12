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

export const categories: Category[] = [];

export const mockColours: BrandColourEntry[] = [];

export const assets: Asset[] = [];

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
