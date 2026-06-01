export const siteConfig = {
  name: "Mountain Rose",
  description:
    "Premium genuine cow leather bags with timeless rose-inspired elegance.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mountainrose.id",
  ogImage: "/og-image.jpg",
  locale: "id_ID",
  keywords: [
    "cow leather bags",
    "genuine leather bags",
    "premium leather bags",
    "women leather bags",
    "handmade bags",
    "Mountain Rose",
  ],
};

export function absoluteUrl(path = "") {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
