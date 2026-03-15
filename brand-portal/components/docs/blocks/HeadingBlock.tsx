"use client";

import type { HeadingBlock as HeadingBlockType } from "@/lib/types";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function HeadingBlock({ block }: { block: HeadingBlockType }) {
  const Tag = block.level;
  const styles = {
    h1: "text-3xl font-bold text-[#f0f0f0]",
    h2: "text-2xl font-bold text-[#f0f0f0]",
    h3: "text-xl font-semibold text-[#d0d0d0]",
  };
  const id = slugify(block.text);

  return (
    <Tag id={id} className={`${styles[block.level]} scroll-mt-24`}>
      {block.text}
    </Tag>
  );
}
