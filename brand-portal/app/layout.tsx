import type { Metadata } from "next";
import { Mozilla_Text } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const mozillaText = Mozilla_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mozilla-text",
});

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
    <html lang="en" className={mozillaText.variable}>
      <body className="antialiased overflow-x-hidden">
        {/* Navbar is rendered inside each portal layout so it can read PortalContext */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
