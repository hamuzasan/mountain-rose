const INSTAGRAM_POST_TYPES = new Set(["p", "reel", "tv"]);

type InstagramPostInfo = {
  type: string;
  code: string;
};

export function getInstagramPostInfo(url: string): InstagramPostInfo | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("instagram.com")) return null;

    const [type, code] = parsed.pathname.split("/").filter(Boolean);
    if (!type || !code || !INSTAGRAM_POST_TYPES.has(type)) return null;

    return { type, code };
  } catch {
    return null;
  }
}

export function getInstagramMediaImageUrl(url: string) {
  const post = getInstagramPostInfo(url);
  if (!post) return null;

  return `https://www.instagram.com/${post.type}/${post.code}/media/?size=l`;
}

function decodeInstagramImageUrl(value: string) {
  try {
    return (JSON.parse(`"${value.replace(/"/g, '\\"')}"`) as string).replaceAll(
      "&amp;",
      "&",
    );
  } catch {
    return value
      .replaceAll("\\/", "/")
      .replaceAll("\\u0026", "&")
      .replaceAll("&amp;", "&");
  }
}

function extractInstagramImageUrl(html: string) {
  const patterns = [
    /"display_url":"([^"]+)"/,
    /"thumbnail_src":"([^"]+)"/,
    /property="og:image"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+property="og:image"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeInstagramImageUrl(match[1]);
  }

  return null;
}

export async function getInstagramThumbnailUrl(url: string) {
  const post = getInstagramPostInfo(url);
  const mediaUrl = getInstagramMediaImageUrl(url);
  if (!post) return null;

  try {
    const response = await fetch(`https://www.instagram.com/${post.type}/${post.code}/embed`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MountainRoseBot/1.0; +https://mountain-rose.vercel.app)",
      },
    });

    if (!response.ok) return mediaUrl;

    const html = await response.text();
    return extractInstagramImageUrl(html) || mediaUrl;
  } catch {
    return mediaUrl;
  }
}
