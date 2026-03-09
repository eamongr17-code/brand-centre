import Navbar from "@/components/Navbar";
import { PortalProvider } from "@/lib/portal-context";
import { brands } from "@/data/mock-data";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export default async function PublicBrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;

  return (
    <PortalProvider mode="public" brandScope={brandSlug}>
      <Navbar />
      {children}
    </PortalProvider>
  );
}
