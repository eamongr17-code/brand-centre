import type { Metadata } from "next";
import { Mozilla_Text } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css";

const mozillaText = Mozilla_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mozilla-text",
});

export const metadata: Metadata = {
  title: "Easygo Brand Portal",
  description: "Brand asset portal for Easygo and its brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mozillaText.variable}>
      <body className="antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
