import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Letters — Bring back the art of letter writing",
  description:
    "Write and send beautifully themed digital letters via email. Vintage, royal, love letter, and notebook styles — rediscover the art of letter writing.",
  metadataBase: new URL("https://www.write-letters.com"),
  openGraph: {
    title: "Letters — Bring back the art of letter writing",
    description:
      "Write and send beautifully themed digital letters via email.",
    url: "https://www.write-letters.com",
    siteName: "Letters",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Letters — Bring back the art of letter writing",
    description:
      "Write and send beautifully themed digital letters via email.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;600&family=Yellowtail&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
