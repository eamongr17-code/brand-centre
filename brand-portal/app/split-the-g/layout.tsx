import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split the G — Guinness Challenge",
  description:
    "Snap a photo of your Guinness pint and see how well you split the G. Score 0–100.",
};

export default function SplitTheGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
