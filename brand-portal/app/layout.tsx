import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Preloader from "@/components/Preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas Brand Centre",
  description: "Brand asset portal for Atlas and its brands.",
  icons: { icon: "/atlas-wordmark.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <Providers>
          <Preloader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
