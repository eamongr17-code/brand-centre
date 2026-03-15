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

// ── Dev seed data (used when NEXT_PUBLIC_DEV_MODE=true) ──────────────────────

export const devSeedData = {
  quickLinks: {} as Record<string, import("@/lib/types").QuickLink[]>,
  homeImage: "",
  brandImages: {} as Record<string, string>,
  customSections: [] as import("@/lib/types").BrandSection[],
  deletedSectionIds: [] as string[],
  sectionOverrides: {} as Record<string, { name?: string }>,
  mainSectionNames: {} as Record<string, string>,
  customCategories: [
    {
      id: "dev-cat-logos",
      brandId: "easygo",
      name: "Logos",
      slug: "logos",
      description: "Primary and secondary logo lockups for all use cases.",
      previewImage: "",
      downloadAllUrl: "",
      assetCount: 4,
      sortOrder: 1,
      categoryType: "assets" as const,
    },
    {
      id: "dev-cat-icons",
      brandId: "easygo",
      name: "Icons",
      slug: "icons",
      description: "App icons, favicons, and symbolic marks.",
      previewImage: "",
      downloadAllUrl: "",
      assetCount: 3,
      sortOrder: 2,
      categoryType: "assets" as const,
    },
    {
      id: "dev-cat-colours",
      brandId: "easygo",
      name: "Brand Colours",
      slug: "brand-colours",
      description: "Primary and secondary colour palette.",
      previewImage: "",
      downloadAllUrl: "",
      assetCount: 0,
      sortOrder: 3,
      categoryType: "colours" as const,
    },
    {
      id: "dev-cat-stake-logos",
      brandId: "stake",
      name: "Logos",
      slug: "logos",
      description: "Stake logo variations and lockups.",
      previewImage: "",
      downloadAllUrl: "",
      assetCount: 3,
      sortOrder: 1,
      categoryType: "assets" as const,
    },
    {
      id: "dev-cat-kick-logos",
      brandId: "kick",
      name: "Logos",
      slug: "logos",
      description: "KICK logo and streaming overlays.",
      previewImage: "",
      downloadAllUrl: "",
      assetCount: 2,
      sortOrder: 1,
      categoryType: "assets" as const,
    },
  ] as import("@/lib/types").Category[],
  deletedCategoryIds: [] as string[],
  categoryOverrides: {} as Record<string, Partial<import("@/lib/types").Category>>,
  assetOverrides: {} as Record<string, Partial<import("@/lib/types").Asset>>,
  customAssets: [
    {
      id: "dev-asset-1",
      categoryId: "dev-cat-logos",
      name: "Primary Logo",
      description: "Full colour primary logo on transparent background.",
      fileType: "SVG",
      fileSize: "24 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: true,
      sortOrder: 1,
      tags: ["logo", "primary", "full-colour"],
      rules: ["Maintain clear space equal to the height of the icon mark.", "Do not alter proportions or colours."],
    },
    {
      id: "dev-asset-2",
      categoryId: "dev-cat-logos",
      name: "Logo — White",
      description: "Single-colour white logo for dark backgrounds.",
      fileType: "PNG",
      fileSize: "86 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: false,
      sortOrder: 2,
      tags: ["logo", "white", "mono"],
    },
    {
      id: "dev-asset-3",
      categoryId: "dev-cat-logos",
      name: "Logo — Black",
      description: "Single-colour black logo for light backgrounds.",
      fileType: "PNG",
      fileSize: "82 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: false,
      sortOrder: 3,
      tags: ["logo", "black", "mono"],
    },
    {
      id: "dev-asset-4",
      categoryId: "dev-cat-logos",
      name: "Wordmark",
      description: "Text-only wordmark without icon.",
      fileType: "SVG",
      fileSize: "12 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: false,
      sortOrder: 4,
      tags: ["wordmark", "text"],
    },
    {
      id: "dev-asset-5",
      categoryId: "dev-cat-icons",
      name: "App Icon",
      description: "Square app icon for iOS and Android.",
      fileType: "PNG",
      fileSize: "148 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: true,
      sortOrder: 1,
      tags: ["icon", "app"],
    },
    {
      id: "dev-asset-6",
      categoryId: "dev-cat-icons",
      name: "Favicon",
      description: "Browser favicon in multiple sizes.",
      fileType: "ICO",
      fileSize: "15 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: false,
      sortOrder: 2,
      tags: ["favicon", "browser"],
    },
    {
      id: "dev-asset-7",
      categoryId: "dev-cat-icons",
      name: "Social Icon",
      description: "Circular icon for social media profiles.",
      fileType: "PNG",
      fileSize: "64 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: false,
      sortOrder: 3,
      tags: ["social", "profile"],
    },
    {
      id: "dev-asset-8",
      categoryId: "dev-cat-stake-logos",
      name: "Stake Logo — Green",
      description: "Primary Stake logo with signature green.",
      fileType: "SVG",
      fileSize: "18 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: true,
      sortOrder: 1,
      tags: ["logo", "green"],
    },
    {
      id: "dev-asset-9",
      categoryId: "dev-cat-stake-logos",
      name: "Stake Logo — White",
      description: "White variant for dark backgrounds.",
      fileType: "PNG",
      fileSize: "72 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: false,
      sortOrder: 2,
      tags: ["logo", "white"],
    },
    {
      id: "dev-asset-10",
      categoryId: "dev-cat-kick-logos",
      name: "KICK Logo",
      description: "Primary KICK logo with green accent.",
      fileType: "SVG",
      fileSize: "22 KB",
      downloadUrl: "#",
      previewImage: "",
      featured: true,
      sortOrder: 1,
      tags: ["logo", "primary"],
    },
  ] as import("@/lib/types").Asset[],
  deletedAssetIds: [] as string[],
  customColours: [
    { id: "dev-col-1", categoryId: "dev-cat-colours", name: "Easygo White", hex: "#FFFFFF" },
    { id: "dev-col-2", categoryId: "dev-cat-colours", name: "Easygo Black", hex: "#111111" },
    { id: "dev-col-3", categoryId: "dev-cat-colours", name: "Accent Orange", hex: "#F77614" },
    { id: "dev-col-4", categoryId: "dev-cat-colours", name: "Soft Grey", hex: "#8A8A8A" },
    { id: "dev-col-5", categoryId: "dev-cat-colours", name: "Deep Navy", hex: "#1A1A2E" },
    { id: "dev-col-6", categoryId: "dev-cat-colours", name: "Success Green", hex: "#22C55E" },
  ] as import("@/lib/types").BrandColourEntry[],
  deletedColourIds: [] as string[],
  colourOverrides: {} as Record<string, Partial<import("@/lib/types").BrandColour>>,
  footerLinks: null as import("@/lib/types").FooterLink[] | null,
  footerText: null as string | null,
  docPages: [] as import("@/lib/types").DocPage[],
  deletedDocPageIds: [] as string[],
};

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
