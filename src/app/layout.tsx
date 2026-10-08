import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { confessionConfig } from "@/config/confession";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFF8F2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const crushName = confessionConfig.crushName || "Ambar";
const crushNickname = confessionConfig.crushNickname || "Si Paling Imut";
const senderName = confessionConfig.senderName || "Wisnu";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foryou.primawisnu.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Khusus Buat ${crushName} (${crushNickname}) 💌`,
  description: `Peringatan: Dokumen rahasia ini bukan virus atau tagihan paylater, cuma pesan jujur dari ${senderName} yang groginya kayak habis dikejar beruang 🐻💨`,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: `Khusus Buat ${crushName} (${crushNickname}) 💌`,
    description: `Peringatan: Dokumen rahasia ini bukan virus atau tagihan paylater, cuma pesan jujur dari ${senderName} yang groginya kayak habis dikejar beruang 🐻💨`,
    url: siteUrl,
    siteName: "Pesan Khusus Untukmu",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: `Favicon Khusus Buat ${crushName}`,
        type: "image/png",
      },
      {
        url: "/apple-touch-icon.png",
        width: 180,
        height: 180,
        alt: `Favicon Khusus Buat ${crushName}`,
        type: "image/png",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Khusus Buat ${crushName} (${crushNickname}) 💌`,
    description: `Peringatan: Bukan link pinjol atau virus, cuma pesan jujur yang dibikin khusus buat kamu! 🐻✨`,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${caveat.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
