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
const crushNickname = confessionConfig.crushNickname || "Si Imut";
const senderName = confessionConfig.senderName || "Wisnu";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mycrush.primawisnu.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Khusus Buat ${crushName} (${crushNickname}) 💌`,
  description: `Peringatan: Dokumen rahasia ini bukan virus atau tagihan paylater, cuma pesan jujur dari ${senderName} yang groginya kayak habis dikejar beruang 🐻💨`,
  applicationName: "Pesan Khusus Untukmu",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: `Khusus Buat ${crushName} (${crushNickname}) 💌`,
    description: `Peringatan: Dokumen rahasia ini bukan virus atau tagihan paylater, cuma pesan jujur dari ${senderName} yang groginya kayak habis dikejar beruang 🐻💨`,
    url: siteUrl,
    siteName: "Pesan Khusus Untukmu",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        secureUrl: `${siteUrl}/og-image.png`,
        width: 600,
        height: 600,
        alt: `Favicon Khusus Buat ${crushName}`,
        type: "image/png",
      },
      {
        url: `${siteUrl}/apple-touch-icon.png`,
        secureUrl: `${siteUrl}/apple-touch-icon.png`,
        width: 180,
        height: 180,
        alt: `Favicon Khusus Buat ${crushName}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `Khusus Buat ${crushName} (${crushNickname}) 💌`,
    description: `Peringatan: Bukan link pinjol atau virus, cuma pesan jujur yang dibikin khusus buat kamu! 🐻✨`,
    images: [`${siteUrl}/og-image.png`],
  },
  other: {
    "image_src": `${siteUrl}/og-image.png`,
    "og:image:secure_url": `${siteUrl}/og-image.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${caveat.variable}`}>
      <head>
        <link rel="image_src" href={`${siteUrl}/og-image.png`} />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
