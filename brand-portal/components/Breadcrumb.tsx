import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="px-8 py-4 text-sm text-[#686868] flex gap-2 items-center [animation:fade-in_0.3s_ease-out_forwards]">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-[#333]">/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#f0f0f0] transition-colors duration-200">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#f0f0f0] font-semibold">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
