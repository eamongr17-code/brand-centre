"use client";

const QUICK_LINKS = [
  { label: "Brand Guidelines", href: "#" },
  { label: "Asset Request", href: "#" },
  { label: "Style Guide", href: "#" },
  { label: "Slack Channel", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] mt-auto py-7 px-8 w-full">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-[#555] hover:text-[#888] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-[#444] text-center sm:text-right">
          Have any issues?{" "}
          <a href="#" className="text-[#666] underline underline-offset-2 hover:text-[#888] transition-colors">
            Reach out to the brand team on Slack
          </a>
        </p>
      </div>
    </footer>
  );
}
