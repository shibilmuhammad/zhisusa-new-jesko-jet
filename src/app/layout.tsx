import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Poppins } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zhisusa.com"),
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
      "Escape the routine. Work, live, and experience nature like never before.",
    type: "website",
    locale: "en_US",
    siteName: "Zhisusa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zhisusa — Premium Nature Retreats & Immersive Workations",
    description:
      "Escape the routine. Work, live, and experience nature like never before.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F4EE",
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
        className={`${bodoni.variable} ${poppins.variable} font-sans bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
