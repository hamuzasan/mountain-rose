import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { absoluteUrl, siteConfig } from "@/config/site";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getSiteSettings } from "@/data-access/siteSettings";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - premium genuine cow leather bags`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cmsSiteSettings = await getSiteSettings();
  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  return (
    <html lang="id" className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <Navbar siteSettings={siteSettings} />
        <main className="flex-1">{children}</main>
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  );
}
