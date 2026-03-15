import DocPageClient from "@/components/docs/DocPageClient";
import { brands } from "@/data/mock-data";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug, slug: "placeholder" }));
}

export default async function OwnerDocPage({
  params,
}: {
  params: Promise<{ brand: string; slug: string }>;
}) {
  const { brand: brandSlug, slug } = await params;
  return <DocPageClient brandSlug={brandSlug} docSlug={slug} />;
}
