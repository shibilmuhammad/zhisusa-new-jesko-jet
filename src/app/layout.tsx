import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zhisusa — Premium Nature Retreats & Immersive Workations",
  description:
    "Luxury nature retreats, immersive workspaces, premium eco stays, wellness escapes, and curated workation experiences. Escape the routine. Reconnect with nature.",
  keywords: [
    "luxury nature retreat",
    "immersive workspace",
    "premium eco stay",
    "wellness escape",
    "workation experience",
    "nature-first living",
    "private villas",
    "tree house retreat",
    "outdoor workspace",
    "slow living",
  ],
  openGraph: {
    title: "Zhisusa — Premium Nature Retreats & Immersive Workations",
    description:
      "Escape the routine. Work, stay, and experience nature like never before.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${inter.variable} font-sans bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
