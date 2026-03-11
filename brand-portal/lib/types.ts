export interface BrandColour {
  id: string;
  name: string;
  hex: string;
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
  visibility?: "public" | "internal";
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
}
