import AssetDetailView from "@/components/AssetDetailView";

export default async function InternalAssetPage({
  params,
}: {
  params: Promise<{ brand: string; category: string; asset: string }>;
}) {
  const { brand: brandSlug, category: categorySlug, asset: assetId } = await params;
  return <AssetDetailView brandSlug={brandSlug} categorySlug={categorySlug} assetId={assetId} />;
}
