import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getInstagramThumbnailUrl } from "@/lib/instagram";
import type { InstagramEmbed } from "@/types/site";

type InstagramEmbedRow = {
  id: string;
  title: string | null;
  instagram_url: string;
  caption: string | null;
  sort_order: number | null;
  status: string | null;
};

function mapInstagramEmbed(row: InstagramEmbedRow): InstagramEmbed {
  return {
    id: row.id,
    title: row.title,
    instagramUrl: row.instagram_url,
    caption: row.caption,
    sortOrder: row.sort_order ?? 0,
    status: row.status || "published",
  };
}

export async function getInstagramEmbeds(): Promise<InstagramEmbed[]> {
  const { client } = getSupabaseServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("instagram_embeds")
    .select("id,title,instagram_url,caption,sort_order,status")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !data) return [];

  const embeds = (data as InstagramEmbedRow[]).map(mapInstagramEmbed);

  return Promise.all(
    embeds.map(async (embed) => ({
      ...embed,
      thumbnailUrl: await getInstagramThumbnailUrl(embed.instagramUrl),
    })),
  );
}
