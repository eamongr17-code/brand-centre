import { brands } from "@/data/mock-data";

/**
 * Extract the brand slug from a Next.js pathname that may be prefixed
 * with a portal segment ("owner" or "internal").
 */
export function parseBrandSlug(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const slug =
    segments[0] === "owner" || segments[0] === "internal"
      ? segments[1]
      : segments[0];
  return brands.find((b) => b.slug === slug)?.slug ?? null;
}
