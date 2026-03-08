import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="px-8 py-4 text-sm text-[#888] flex gap-2 items-center">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#e8e8e8] underline underline-offset-2 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#e8e8e8] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
