"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { QuickLink, Asset, Category, GitHubConfig, BrandColour, BrandColourEntry, BrandSection } from "./types";
import {
  quickLinks as mockQuickLinks,
  getAssetsForCategory as getMockAssets,
  getCategoriesForBrand as getMockBrandCategories,
  getCategoriesForSubBrand as getMockSubBrandCategories,
  getSubBrandsForBrand as getMockSubBrands,
  getColoursForCategory as getMockColours,
} from "@/data/mock-data";

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
  updateCategory: (id: string, changes: Partial<Pick<Category, "name" | "description" | "previewImage" | "downloadAllUrl">>) => void;
  deleteCategory: (id: string) => void;
  // Assets
  getAssets: (categoryId: string) => Asset[];
  addAsset: (categoryId: string) => string;
  updateAsset: (id: string, changes: Partial<Pick<Asset, "name" | "description" | "fileType" | "fileSize" | "downloadUrl" | "previewImage" | "actionType" | "visibility">>) => void;
  deleteAsset: (id: string) => void;
  // Colours
  getColours: (categoryId: string) => BrandColour[];
  addColour: (categoryId: string) => void;
  updateColour: (id: string, changes: Partial<Pick<BrandColour, "name" | "hex">>) => void;
  deleteColour: (id: string) => void;
  // GitHub config
  getGitHubConfig: () => GitHubConfig | null;
  setGitHubConfig: (config: GitHubConfig | null) => void;
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
  githubConfig: GitHubConfig | null;
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
  githubConfig: null,
};

const STORAGE_KEY = "bap-edit";

function readStorage(): PersistedData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as PersistedData) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function genId() {
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
    setData(readStorage());
  }, []);

  const persist = useCallback((updater: (prev: PersistedData) => PersistedData) => {
    setData((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
      };
      persist((prev) => ({
        ...prev,
        customCategories: [...prev.customCategories, newCategory],
      }));
    },
    [persist]
  );

  const updateCategory = useCallback(
    (id: string, changes: Partial<Pick<Category, "name" | "description" | "previewImage" | "downloadAllUrl">>) => {
      persist((prev) => {
        if (prev.customCategories.some((c) => c.id === id)) {
          return {
            ...prev,
            customCategories: prev.customCategories.map((c) =>
              c.id === id ? { ...c, ...changes } : c
            ),
          };
        }
        return {
          ...prev,
          categoryOverrides: {
            ...prev.categoryOverrides,
            [id]: { ...(prev.categoryOverrides[id] ?? {}), ...changes },
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
      };
      persist((prev) => ({ ...prev, customAssets: [...prev.customAssets, newAsset] }));
      return id;
    },
    [persist]
  );

  const updateAsset = useCallback(
    (id: string, changes: Partial<Pick<Asset, "name" | "description" | "fileType" | "fileSize" | "downloadUrl" | "previewImage" | "actionType">>) => {
      persist((prev) => {
        if (prev.customAssets.some((a) => a.id === id)) {
          return {
            ...prev,
            customAssets: prev.customAssets.map((a) =>
              a.id === id ? { ...a, ...changes } : a
            ),
          };
        }
        return {
          ...prev,
          assetOverrides: {
            ...prev.assetOverrides,
            [id]: { ...(prev.assetOverrides[id] ?? {}), ...changes },
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
    (id: string, changes: Partial<Pick<BrandColour, "name" | "hex">>) => {
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

  // ── GitHub config ─────────────────────────────────────────────────────────

  const getGitHubConfig = useCallback(() => data.githubConfig ?? null, [data.githubConfig]);

  const setGitHubConfig = useCallback(
    (config: GitHubConfig | null) => {
      persist((prev) => ({ ...prev, githubConfig: config }));
    },
    [persist]
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
        updateAsset,
        deleteAsset,
        getColours,
        addColour,
        updateColour,
        deleteColour,
        getGitHubConfig,
        setGitHubConfig,
      }}
    >
      {children}
    </EditStoreContext.Provider>
  );
}
