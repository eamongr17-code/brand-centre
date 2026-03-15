"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { QuickLink, Asset, Category, BrandColour, BrandColourEntry, BrandSection, FooterLink, DocPage, DocBlock } from "./types";
import {
  brands,
  quickLinks as mockQuickLinks,
  getAssetsForCategory as getMockAssets,
  getCategoriesForBrand as getMockBrandCategories,
  getCategoriesForSubBrand as getMockSubBrandCategories,
  getSubBrandsForBrand as getMockSubBrands,
  getColoursForCategory as getMockColours,
} from "@/data/mock-data";
import { supabase } from "./supabase";

interface EditStoreContextType {
  editMode: boolean;
  toggleEditMode: () => void;
  // Quick links
  getQuickLinks: (brandId: string) => QuickLink[];
  addQuickLink: (brandId: string) => void;
  updateQuickLink: (id: string, changes: { label?: string; url?: string }) => void;
  deleteQuickLink: (id: string) => void;
  // Home + Brand images
  getHomeImage: () => string;
  setHomeImage: (url: string) => void;
  getBrandImage: (brandId: string) => string;
  setBrandImage: (brandId: string, url: string) => void;
  // Sections
  getSections: (brandId: string) => BrandSection[];
  addSection: (brandId: string) => void;
  updateSection: (id: string, changes: { name?: string }) => void;
  deleteSection: (id: string) => void;
  getMainSectionName: (brandId: string) => string;
  updateMainSectionName: (brandId: string, name: string) => void;
  // Categories
  getCategories: (brandId: string, subBrandId?: string) => Category[];
  getCategoryBySlug: (brandId: string, slug: string) => Category | undefined;
  addCategory: (brandId: string, subBrandId?: string, categoryType?: "assets" | "colours") => void;
  updateCategory: (id: string, changes: Partial<Pick<Category, "name" | "description" | "previewImage" | "downloadAllUrl" | "actionType" | "lastEditedAt">>) => void;
  deleteCategory: (id: string) => void;
  // Assets
  getAssets: (categoryId: string) => Asset[];
  addAsset: (categoryId: string) => string;
  addAssetBulk: (categoryId: string, assets: Omit<Asset, "id" | "categoryId">[]) => void;
  updateAsset: (id: string, changes: Partial<Pick<Asset, "name" | "description" | "fileType" | "fileSize" | "downloadUrl" | "previewImage" | "actionType" | "visibility" | "rules" | "lastEditedAt" | "tags">>) => void;
  deleteAsset: (id: string) => void;
  reorderAssets: (categoryId: string, orderedIds: string[]) => void;
  reorderCategories: (brandId: string, subBrandId: string | undefined, orderedIds: string[]) => void;
  // Colours
  getColours: (categoryId: string) => BrandColour[];
  addColour: (categoryId: string) => void;
  updateColour: (id: string, changes: Partial<Pick<BrandColour, "name" | "hex" | "rgbOverride" | "hslOverride" | "cmykOverride">>) => void;
  deleteColour: (id: string) => void;
  // Footer links
  getFooterLinks: () => FooterLink[];
  addFooterLink: () => void;
  updateFooterLink: (id: string, changes: Partial<Pick<FooterLink, "label" | "href">>) => void;
  deleteFooterLink: (id: string) => void;
  // Footer text
  getFooterText: () => string;
  setFooterText: (text: string) => void;
  // Doc pages
  getDocPages: (brandId: string) => DocPage[];
  getDocPageBySlug: (brandId: string, slug: string) => DocPage | undefined;
  addDocPage: (brandId: string) => void;
  updateDocPage: (id: string, changes: Partial<Pick<DocPage, "title" | "slug" | "description" | "coverImage" | "visibility">>) => void;
  deleteDocPage: (id: string) => void;
  addDocBlock: (docPageId: string, blockType: DocBlock["type"]) => void;
  updateDocBlock: (docPageId: string, blockId: string, changes: Partial<DocBlock>) => void;
  deleteDocBlock: (docPageId: string, blockId: string) => void;
  reorderDocBlocks: (docPageId: string, orderedIds: string[]) => void;
  getAssetById: (assetId: string) => Asset | undefined;
}

const EditStoreContext = createContext<EditStoreContextType | null>(null);

export function useEditStore() {
  const ctx = useContext(EditStoreContext);
  if (!ctx) throw new Error("useEditStore must be used within EditStoreProvider");
  return ctx;
}

interface PersistedData {
  quickLinks: Record<string, QuickLink[]>;
  homeImage: string;
  brandImages: Record<string, string>;
  // Sections
  customSections: BrandSection[];
  deletedSectionIds: string[];
  sectionOverrides: Record<string, { name?: string }>;
  mainSectionNames: Record<string, string>;
  // Categories
  customCategories: Category[];
  deletedCategoryIds: string[];
  categoryOverrides: Record<string, Partial<Category>>;
  assetOverrides: Record<string, Partial<Asset>>;
  customAssets: Asset[];
  deletedAssetIds: string[];
  customColours: BrandColourEntry[];
  deletedColourIds: string[];
  colourOverrides: Record<string, Partial<BrandColour>>;
  footerLinks: FooterLink[] | null;
  footerText: string | null;
  docPages: DocPage[];
  deletedDocPageIds: string[];
}

const EMPTY: PersistedData = {
  quickLinks: {},
  homeImage: "",
  brandImages: {},
  customSections: [],
  deletedSectionIds: [],
  sectionOverrides: {},
  mainSectionNames: {},
  customCategories: [],
  deletedCategoryIds: [],
  categoryOverrides: {},
  assetOverrides: {},
  customAssets: [],
  deletedAssetIds: [],
  customColours: [],
  deletedColourIds: [],
  colourOverrides: {},
  footerLinks: null,
  footerText: null,
  docPages: [],
  deletedDocPageIds: [],
};

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function resolveLinks(brandId: string, stored: Record<string, QuickLink[]>): QuickLink[] {
  return stored[brandId] ?? mockQuickLinks.filter((l) => l.brandId === brandId);
}

function findLinkBrand(id: string, stored: Record<string, QuickLink[]>): string | undefined {
  for (const [brandId, links] of Object.entries(stored)) {
    if (links.some((l) => l.id === id)) return brandId;
  }
  return mockQuickLinks.find((l) => l.id === id)?.brandId;
}

export function EditStoreProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<PersistedData>(EMPTY);

  useEffect(() => {
    // Initial load
    supabase
      .from("brand_data")
      .select("data")
      .eq("id", "global")
      .single()
      .then(({ data: row }) => {
        if (row?.data) {
          setData({ ...EMPTY, ...(row.data as PersistedData) });
        }
      });

    // Real-time subscription
    const channel = supabase
      .channel("brand_data_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "brand_data", filter: "id=eq.global" },
        (payload) => {
          if (payload.new?.data) {
            setData({ ...EMPTY, ...(payload.new.data as PersistedData) });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const persist = useCallback((updater: (prev: PersistedData) => PersistedData) => {
    setData((prev) => {
      const next = updater(prev);
      supabase
        .from("brand_data")
        .upsert({ id: "global", data: next })
        .then(({ error }) => {
          if (error) console.error("Failed to persist:", error.message);
        });
      return next;
    });
  }, []);

  const toggleEditMode = useCallback(() => setEditMode((v) => !v), []);

  // ── Quick links ──────────────────────────────────────────────────────────

  const getQuickLinks = useCallback(
    (brandId: string) => resolveLinks(brandId, data.quickLinks),
    [data.quickLinks]
  );

  const addQuickLink = useCallback(
    (brandId: string) => {
      const newLink: QuickLink = {
        id: `ql-${genId()}`,
        brandId,
        label: "New link",
        url: "https://",
        sortOrder: 999,
      };
      persist((prev) => ({
        ...prev,
        quickLinks: {
          ...prev.quickLinks,
          [brandId]: [...resolveLinks(brandId, prev.quickLinks), newLink],
        },
      }));
    },
    [persist]
  );

  const updateQuickLink = useCallback(
    (id: string, changes: { label?: string; url?: string }) => {
      persist((prev) => {
        const brandId = findLinkBrand(id, prev.quickLinks);
        if (!brandId) return prev;
        const links = resolveLinks(brandId, prev.quickLinks);
        return {
          ...prev,
          quickLinks: {
            ...prev.quickLinks,
            [brandId]: links.map((l) => (l.id === id ? { ...l, ...changes } : l)),
          },
        };
      });
    },
    [persist]
  );

  const deleteQuickLink = useCallback(
    (id: string) => {
      persist((prev) => {
        const brandId = findLinkBrand(id, prev.quickLinks);
        if (!brandId) return prev;
        const links = resolveLinks(brandId, prev.quickLinks);
        return {
          ...prev,
          quickLinks: {
            ...prev.quickLinks,
            [brandId]: links.filter((l) => l.id !== id),
          },
        };
      });
    },
    [persist]
  );

  // ── Home + Brand images ───────────────────────────────────────────────────

  const getHomeImage = useCallback(() => data.homeImage ?? "", [data.homeImage]);

  const setHomeImage = useCallback(
    (url: string) => {
      persist((prev) => ({ ...prev, homeImage: url }));
    },
    [persist]
  );

  const getBrandImage = useCallback(
    (brandId: string) => data.brandImages[brandId] ?? "",
    [data.brandImages]
  );

  const setBrandImage = useCallback(
    (brandId: string, url: string) => {
      persist((prev) => ({
        ...prev,
        brandImages: { ...prev.brandImages, [brandId]: url },
      }));
    },
    [persist]
  );

  // ── Sections ─────────────────────────────────────────────────────────────

  const getSections = useCallback(
    (brandId: string): BrandSection[] => {
      const subBrandSections = getMockSubBrands(brandId)
        .filter((sb) => !data.deletedSectionIds.includes(sb.id))
        .map((sb) => ({
          id: sb.id,
          brandId,
          name: data.sectionOverrides[sb.id]?.name ?? sb.name,
          sortOrder: sb.sortOrder,
          isSubBrandBacked: true,
          subBrandId: sb.id,
        }));
      const custom = data.customSections.filter((s) => s.brandId === brandId);
      return [...subBrandSections, ...custom].sort((a, b) => a.sortOrder - b.sortOrder);
    },
    [data]
  );

  const addSection = useCallback(
    (brandId: string) => {
      const id = `section-${genId()}`;
      const newSection: BrandSection = {
        id,
        brandId,
        name: "New section",
        sortOrder: 999,
      };
      persist((prev) => ({
        ...prev,
        customSections: [...prev.customSections, newSection],
      }));
    },
    [persist]
  );

  const updateSection = useCallback(
    (id: string, changes: { name?: string }) => {
      persist((prev) => {
        if (prev.customSections.some((s) => s.id === id)) {
          return {
            ...prev,
            customSections: prev.customSections.map((s) =>
              s.id === id ? { ...s, ...changes } : s
            ),
          };
        }
        return {
          ...prev,
          sectionOverrides: {
            ...prev.sectionOverrides,
            [id]: { ...(prev.sectionOverrides[id] ?? {}), ...changes },
          },
        };
      });
    },
    [persist]
  );

  const deleteSection = useCallback(
    (id: string) => {
      persist((prev) => {
        const isCustomSection = prev.customSections.some((s) => s.id === id);
        if (isCustomSection) {
          return {
            ...prev,
            customSections: prev.customSections.filter((s) => s.id !== id),
            customCategories: prev.customCategories.filter((c) => c.subBrandId !== id),
          };
        }
        // Sub-brand backed section — also delete its mock categories
        const mockCatIds = getMockSubBrandCategories(id).map((c) => c.id);
        return {
          ...prev,
          deletedSectionIds: [...prev.deletedSectionIds, id],
          deletedCategoryIds: [
            ...prev.deletedCategoryIds,
            ...mockCatIds.filter((cid) => !prev.deletedCategoryIds.includes(cid)),
          ],
          customCategories: prev.customCategories.filter((c) => c.subBrandId !== id),
        };
      });
    },
    [persist]
  );

  const getMainSectionName = useCallback(
    (brandId: string) => data.mainSectionNames[brandId] ?? "",
    [data.mainSectionNames]
  );

  const updateMainSectionName = useCallback(
    (brandId: string, name: string) => {
      persist((prev) => ({
        ...prev,
        mainSectionNames: { ...prev.mainSectionNames, [brandId]: name },
      }));
    },
    [persist]
  );

  // ── Categories ───────────────────────────────────────────────────────────

  const getCategories = useCallback(
    (brandId: string, subBrandId?: string): Category[] => {
      const base = subBrandId
        ? getMockSubBrandCategories(subBrandId)
        : getMockBrandCategories(brandId);
      const processed = base
        .filter((c) => !data.deletedCategoryIds.includes(c.id))
        .map((c) =>
          data.categoryOverrides[c.id] ? { ...c, ...data.categoryOverrides[c.id] } : c
        );
      const custom = data.customCategories.filter(
        (c) => c.brandId === brandId && c.subBrandId === subBrandId
      );
      return [...processed, ...custom].sort((a, b) => a.sortOrder - b.sortOrder);
    },
    [data]
  );

  const getCategoryBySlug = useCallback(
    (brandId: string, slug: string): Category | undefined => {
      // Search mock categories (main brand + all sub-brands)
      const subBrands = getMockSubBrands(brandId);
      const allMock = [
        ...getMockBrandCategories(brandId),
        ...subBrands.flatMap((sb) => getMockSubBrandCategories(sb.id)),
      ];
      const mockMatch = allMock
        .filter((c) => !data.deletedCategoryIds.includes(c.id))
        .find((c) => c.slug === slug);
      if (mockMatch) {
        return data.categoryOverrides[mockMatch.id]
          ? { ...mockMatch, ...data.categoryOverrides[mockMatch.id] }
          : mockMatch;
      }
      // Search custom categories
      return data.customCategories.find((c) => c.brandId === brandId && c.slug === slug);
    },
    [data]
  );

  const addCategory = useCallback(
    (brandId: string, subBrandId?: string, categoryType?: "assets" | "colours") => {
      const id = `cat-${genId()}`;
      const slug = `category-${genId()}`;
      const newCategory: Category = {
        id,
        brandId,
        subBrandId,
        name: categoryType === "colours" ? "New colour palette" : "New category",
        slug,
        description: "",
        previewImage: "",
        downloadAllUrl: "#",
        assetCount: 0,
        sortOrder: 999,
        categoryType,
        lastEditedAt: new Date().toISOString(),
      };
      persist((prev) => ({
        ...prev,
        customCategories: [...prev.customCategories, newCategory],
      }));
    },
    [persist]
  );

  const updateCategory = useCallback(
    (id: string, changes: Partial<Pick<Category, "name" | "description" | "previewImage" | "downloadAllUrl" | "actionType" | "lastEditedAt">>) => {
      const stamped = { ...changes, lastEditedAt: new Date().toISOString() };
      persist((prev) => {
        if (prev.customCategories.some((c) => c.id === id)) {
          return {
            ...prev,
            customCategories: prev.customCategories.map((c) =>
              c.id === id ? { ...c, ...stamped } : c
            ),
          };
        }
        return {
          ...prev,
          categoryOverrides: {
            ...prev.categoryOverrides,
            [id]: { ...(prev.categoryOverrides[id] ?? {}), ...stamped },
          },
        };
      });
    },
    [persist]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      persist((prev) => {
        if (prev.customCategories.some((c) => c.id === id)) {
          return {
            ...prev,
            customCategories: prev.customCategories.filter((c) => c.id !== id),
          };
        }
        return { ...prev, deletedCategoryIds: [...prev.deletedCategoryIds, id] };
      });
    },
    [persist]
  );

  // ── Assets ───────────────────────────────────────────────────────────────

  const getAssets = useCallback(
    (categoryId: string): Asset[] => {
      const base = getMockAssets(categoryId)
        .filter((a) => !data.deletedAssetIds.includes(a.id))
        .map((a) =>
          data.assetOverrides[a.id] ? { ...a, ...data.assetOverrides[a.id] } : a
        );
      const custom = data.customAssets.filter((a) => a.categoryId === categoryId);
      return [...base, ...custom].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.sortOrder - b.sortOrder;
      });
    },
    [data]
  );

  const addAsset = useCallback(
    (categoryId: string): string => {
      const id = `custom-${genId()}`;
      const newAsset: Asset = {
        id,
        categoryId,
        name: "New asset",
        description: "",
        fileType: "SVG + PNG",
        fileSize: "",
        downloadUrl: "#",
        previewImage: "",
        featured: false,
        sortOrder: 999,
        lastEditedAt: new Date().toISOString(),
        tags: [],
      };
      persist((prev) => ({ ...prev, customAssets: [...prev.customAssets, newAsset] }));
      return id;
    },
    [persist]
  );

  const updateAsset = useCallback(
    (id: string, changes: Partial<Pick<Asset, "name" | "description" | "fileType" | "fileSize" | "downloadUrl" | "previewImage" | "actionType" | "visibility" | "rules" | "lastEditedAt" | "tags">>) => {
      const stamped = { ...changes, lastEditedAt: new Date().toISOString() };
      persist((prev) => {
        if (prev.customAssets.some((a) => a.id === id)) {
          return {
            ...prev,
            customAssets: prev.customAssets.map((a) =>
              a.id === id ? { ...a, ...stamped } : a
            ),
          };
        }
        return {
          ...prev,
          assetOverrides: {
            ...prev.assetOverrides,
            [id]: { ...(prev.assetOverrides[id] ?? {}), ...stamped },
          },
        };
      });
    },
    [persist]
  );

  const deleteAsset = useCallback(
    (id: string) => {
      persist((prev) => {
        if (prev.customAssets.some((a) => a.id === id)) {
          return { ...prev, customAssets: prev.customAssets.filter((a) => a.id !== id) };
        }
        return { ...prev, deletedAssetIds: [...prev.deletedAssetIds, id] };
      });
    },
    [persist]
  );

  const addAssetBulk = useCallback(
    (categoryId: string, assets: Omit<Asset, "id" | "categoryId">[]) => {
      persist((prev) => ({
        ...prev,
        customAssets: [
          ...prev.customAssets,
          ...assets.map((a, i) => ({
            ...a,
            id: `custom-${genId()}${i}`,
            categoryId,
          })),
        ],
      }));
    },
    [persist]
  );

  const reorderAssets = useCallback(
    (categoryId: string, orderedIds: string[]) => {
      persist((prev) => {
        const nextOverrides = { ...prev.assetOverrides };
        const nextCustom = [...prev.customAssets];
        orderedIds.forEach((id, index) => {
          const customIdx = nextCustom.findIndex((a) => a.id === id);
          if (customIdx !== -1) {
            nextCustom[customIdx] = { ...nextCustom[customIdx], sortOrder: index };
          } else {
            nextOverrides[id] = { ...(nextOverrides[id] ?? {}), sortOrder: index };
          }
        });
        return { ...prev, assetOverrides: nextOverrides, customAssets: nextCustom };
      });
    },
    [persist]
  );

  const reorderCategories = useCallback(
    (brandId: string, subBrandId: string | undefined, orderedIds: string[]) => {
      persist((prev) => {
        const nextOverrides = { ...prev.categoryOverrides };
        const nextCustom = [...prev.customCategories];
        orderedIds.forEach((id, index) => {
          const customIdx = nextCustom.findIndex((c) => c.id === id);
          if (customIdx !== -1) {
            nextCustom[customIdx] = { ...nextCustom[customIdx], sortOrder: index };
          } else {
            nextOverrides[id] = { ...(nextOverrides[id] ?? {}), sortOrder: index };
          }
        });
        return { ...prev, categoryOverrides: nextOverrides, customCategories: nextCustom };
      });
    },
    [persist]
  );

  // ── Colours ───────────────────────────────────────────────────────────────

  const getColours = useCallback(
    (categoryId: string): BrandColour[] => {
      const base = getMockColours(categoryId)
        .filter((c) => !data.deletedColourIds.includes(c.id))
        .map((c) =>
          data.colourOverrides[c.id] ? { ...c, ...data.colourOverrides[c.id] } : c
        );
      const custom = data.customColours.filter((c) => c.categoryId === categoryId);
      return [...base, ...custom];
    },
    [data]
  );

  const addColour = useCallback(
    (categoryId: string) => {
      const id = `colour-${genId()}`;
      const newColour: BrandColourEntry = {
        id,
        categoryId,
        name: "New colour",
        hex: "#000000",
      };
      persist((prev) => ({
        ...prev,
        customColours: [...prev.customColours, newColour],
      }));
    },
    [persist]
  );

  const updateColour = useCallback(
    (id: string, changes: Partial<Pick<BrandColour, "name" | "hex" | "rgbOverride" | "hslOverride" | "cmykOverride">>) => {
      persist((prev) => {
        if (prev.customColours.some((c) => c.id === id)) {
          return {
            ...prev,
            customColours: prev.customColours.map((c) =>
              c.id === id ? { ...c, ...changes } : c
            ),
          };
        }
        return {
          ...prev,
          colourOverrides: {
            ...prev.colourOverrides,
            [id]: { ...(prev.colourOverrides[id] ?? {}), ...changes },
          },
        };
      });
    },
    [persist]
  );

  const deleteColour = useCallback(
    (id: string) => {
      persist((prev) => {
        if (prev.customColours.some((c) => c.id === id)) {
          return {
            ...prev,
            customColours: prev.customColours.filter((c) => c.id !== id),
          };
        }
        return { ...prev, deletedColourIds: [...prev.deletedColourIds, id] };
      });
    },
    [persist]
  );

  // ── Footer links ─────────────────────────────────────────────────────────

  const DEFAULT_FOOTER_LINKS: FooterLink[] = [
    { id: "fl-1", label: "Brand Guidelines", href: "#" },
    { id: "fl-2", label: "Asset Request", href: "#" },
    { id: "fl-3", label: "Style Guide", href: "#" },
    { id: "fl-4", label: "Slack Channel", href: "#" },
  ];

  const getFooterLinks = useCallback(
    () => data.footerLinks ?? DEFAULT_FOOTER_LINKS,
    [data.footerLinks]
  );

  const addFooterLink = useCallback(() => {
    const newLink: FooterLink = { id: `fl-${genId()}`, label: "New link", href: "#" };
    persist((prev) => ({
      ...prev,
      footerLinks: [...(prev.footerLinks ?? DEFAULT_FOOTER_LINKS), newLink],
    }));
  }, [persist]);

  const updateFooterLink = useCallback(
    (id: string, changes: Partial<Pick<FooterLink, "label" | "href">>) => {
      persist((prev) => ({
        ...prev,
        footerLinks: (prev.footerLinks ?? DEFAULT_FOOTER_LINKS).map((l) =>
          l.id === id ? { ...l, ...changes } : l
        ),
      }));
    },
    [persist]
  );

  const deleteFooterLink = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        footerLinks: (prev.footerLinks ?? DEFAULT_FOOTER_LINKS).filter((l) => l.id !== id),
      }));
    },
    [persist]
  );

  // ── Footer text ───────────────────────────────────────────────────────────

  const DEFAULT_FOOTER_TEXT = "Have any issues? Reach out to the brand team on Slack";

  const getFooterText = useCallback(
    () => data.footerText ?? DEFAULT_FOOTER_TEXT,
    [data.footerText]
  );

  const setFooterText = useCallback(
    (text: string) => {
      persist((prev) => ({ ...prev, footerText: text }));
    },
    [persist]
  );

  // ── Doc pages ────────────────────────────────────────────────────────────


  const getDocPages = useCallback(
    (brandId: string): DocPage[] =>
      data.docPages
        .filter((d) => d.brandId === brandId && !data.deletedDocPageIds.includes(d.id))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [data]
  );

  const getDocPageBySlug = useCallback(
    (brandId: string, slug: string): DocPage | undefined =>
      data.docPages.find(
        (d) => d.brandId === brandId && d.slug === slug && !data.deletedDocPageIds.includes(d.id)
      ),
    [data]
  );

  const addDocPage = useCallback(
    (brandId: string) => {
      const id = `doc-${genId()}`;
      const slug = `doc-${genId()}`;
      const newPage: DocPage = {
        id,
        brandId,
        title: "New page",
        slug,
        description: "",
        blocks: [],
        sortOrder: 999,
        lastEditedAt: new Date().toISOString(),
      };
      persist((prev) => ({ ...prev, docPages: [...prev.docPages, newPage] }));
    },
    [persist]
  );

  const updateDocPage = useCallback(
    (id: string, changes: Partial<Pick<DocPage, "title" | "slug" | "description" | "coverImage" | "visibility">>) => {
      persist((prev) => ({
        ...prev,
        docPages: prev.docPages.map((d) =>
          d.id === id ? { ...d, ...changes, lastEditedAt: new Date().toISOString() } : d
        ),
      }));
    },
    [persist]
  );

  const deleteDocPage = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        docPages: prev.docPages.filter((d) => d.id !== id),
        deletedDocPageIds: [...prev.deletedDocPageIds, id],
      }));
    },
    [persist]
  );

  const addDocBlock = useCallback(
    (docPageId: string, blockType: DocBlock["type"]) => {
      const blockId = `block-${genId()}`;
      const baseBlock = { id: blockId, sortOrder: 999 };
      let newBlock: DocBlock;
      switch (blockType) {
        case "heading":
          newBlock = { ...baseBlock, type: "heading", text: "New heading", level: "h2" };
          break;
        case "paragraph":
          newBlock = { ...baseBlock, type: "paragraph", text: "Enter text here..." };
          break;
        case "image":
          newBlock = { ...baseBlock, type: "image", url: "", alt: "", caption: "" };
          break;
        case "do-dont":
          newBlock = { ...baseBlock, type: "do-dont", doImage: "", doCaption: "Do", dontImage: "", dontCaption: "Don't" };
          break;
        case "colour-swatch":
          newBlock = { ...baseBlock, type: "colour-swatch", colours: [{ name: "Primary", hex: "#000000" }] };
          break;
        case "asset-embed":
          newBlock = { ...baseBlock, type: "asset-embed", assetId: "" };
          break;
        case "category-embed":
          newBlock = { ...baseBlock, type: "category-embed", categoryId: "", brandId: "" };
          break;
        case "colour-palette-embed":
          newBlock = { ...baseBlock, type: "colour-palette-embed", categoryId: "", brandId: "" };
          break;
        case "download-cta":
          newBlock = { ...baseBlock, type: "download-cta", label: "Download", url: "", description: "" };
          break;
        case "divider":
          newBlock = { ...baseBlock, type: "divider" };
          break;
        case "code-snippet":
          newBlock = { ...baseBlock, type: "code-snippet", language: "html", code: "" };
          break;
        case "typography-sample":
          newBlock = { ...baseBlock, type: "typography-sample", fontFamily: "Inter", weights: ["400", "700"], sampleText: "The quick brown fox jumps over the lazy dog" };
          break;
      }
      persist((prev) => ({
        ...prev,
        docPages: prev.docPages.map((d) =>
          d.id === docPageId
            ? { ...d, blocks: [...d.blocks, newBlock], lastEditedAt: new Date().toISOString() }
            : d
        ),
      }));
    },
    [persist]
  );

  const updateDocBlock = useCallback(
    (docPageId: string, blockId: string, changes: Partial<DocBlock>) => {
      persist((prev) => ({
        ...prev,
        docPages: prev.docPages.map((d) =>
          d.id === docPageId
            ? {
                ...d,
                blocks: d.blocks.map((b) => (b.id === blockId ? { ...b, ...changes } as DocBlock : b)),
                lastEditedAt: new Date().toISOString(),
              }
            : d
        ),
      }));
    },
    [persist]
  );

  const deleteDocBlock = useCallback(
    (docPageId: string, blockId: string) => {
      persist((prev) => ({
        ...prev,
        docPages: prev.docPages.map((d) =>
          d.id === docPageId
            ? { ...d, blocks: d.blocks.filter((b) => b.id !== blockId), lastEditedAt: new Date().toISOString() }
            : d
        ),
      }));
    },
    [persist]
  );

  const reorderDocBlocks = useCallback(
    (docPageId: string, orderedIds: string[]) => {
      persist((prev) => ({
        ...prev,
        docPages: prev.docPages.map((d) =>
          d.id === docPageId
            ? {
                ...d,
                blocks: d.blocks
                  .map((b) => ({ ...b, sortOrder: orderedIds.indexOf(b.id) }))
                  .sort((a, b) => a.sortOrder - b.sortOrder),
                lastEditedAt: new Date().toISOString(),
              }
            : d
        ),
      }));
    },
    [persist]
  );

  const getAssetById = useCallback(
    (assetId: string): Asset | undefined => {
      const custom = data.customAssets.find((a) => a.id === assetId);
      if (custom) return custom;
      const allMockCategories = brands.flatMap((b) => getMockBrandCategories(b.id));
      for (const cat of allMockCategories) {
        const asset = getMockAssets(cat.id).find((a) => a.id === assetId);
        if (asset) {
          return data.assetOverrides[assetId] ? { ...asset, ...data.assetOverrides[assetId] } : asset;
        }
      }
      return undefined;
    },
    [data]
  );

  return (
    <EditStoreContext.Provider
      value={{
        editMode,
        toggleEditMode,
        getQuickLinks,
        addQuickLink,
        updateQuickLink,
        deleteQuickLink,
        getHomeImage,
        setHomeImage,
        getBrandImage,
        setBrandImage,
        getSections,
        addSection,
        updateSection,
        deleteSection,
        getMainSectionName,
        updateMainSectionName,
        getCategories,
        getCategoryBySlug,
        addCategory,
        updateCategory,
        deleteCategory,
        getAssets,
        addAsset,
        addAssetBulk,
        updateAsset,
        deleteAsset,
        reorderAssets,
        reorderCategories,
        getColours,
        addColour,
        updateColour,
        deleteColour,
        getFooterLinks,
        addFooterLink,
        updateFooterLink,
        deleteFooterLink,
        getFooterText,
        setFooterText,
        getDocPages,
        getDocPageBySlug,
        addDocPage,
        updateDocPage,
        deleteDocPage,
        addDocBlock,
        updateDocBlock,
        deleteDocBlock,
        reorderDocBlocks,
        getAssetById,
      }}
    >
      {children}
    </EditStoreContext.Provider>
  );
}
