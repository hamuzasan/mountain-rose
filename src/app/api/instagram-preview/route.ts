import { NextResponse } from "next/server";

import { getInstagramMediaImageUrl, getInstagramPostInfo } from "@/lib/instagram";

export const dynamic = "force-dynamic";

const IMAGE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
};

function createFallbackSvg(title: string) {
  const safeTitle = title
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${safeTitle}">
    <rect width="800" height="1000" fill="#F7F1E8"/>
    <path d="M170 770C250 690 360 690 455 755C545 815 620 795 690 735" fill="none" stroke="#B08D57" stroke-width="10" stroke-linecap="round" opacity=".38"/>
    <circle cx="400" cy="430" r="150" fill="#FAF7F1" stroke="#D8C3A5" stroke-width="3"/>
    <text x="400" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#2B1A12">Mountain</text>
    <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#2B1A12">Rose</text>
    <text x="400" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="5" fill="#A35D6A">INSTAGRAM</text>
  </svg>`;
}

async function fetchInstagramImage(url: string) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: "https://www.instagram.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    },
  });

  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) return null;

  const body = await response.arrayBuffer();
  return { body, contentType };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instagramUrl = searchParams.get("url") || "";
  const title = searchParams.get("title") || "Mountain Rose Instagram";
  const post = getInstagramPostInfo(instagramUrl);
  const mediaUrl = getInstagramMediaImageUrl(instagramUrl);

  if (post && mediaUrl) {
    try {
      const image = await fetchInstagramImage(mediaUrl);
      if (image) {
        return new NextResponse(image.body, {
          headers: {
            ...IMAGE_HEADERS,
            "Content-Type": image.contentType,
          },
        });
      }
    } catch {
      // Fall through to the branded SVG fallback.
    }
  }

  return new NextResponse(createFallbackSvg(title), {
    headers: {
      ...IMAGE_HEADERS,
      "Content-Type": "image/svg+xml",
    },
  });
}
