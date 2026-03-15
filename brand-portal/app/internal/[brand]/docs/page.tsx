import DocListClient from "@/components/docs/DocListClient";
import { brands } from "@/data/mock-data";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export default async function InternalDocsPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;
  return <DocListClient brandSlug={brandSlug} />;
}
