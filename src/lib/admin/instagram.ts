import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { InstagramEmbed } from "@/types/site";

type InstagramEmbedRow = {
  id: string;
  title: string | null;
  instagram_url: string;
  caption: string | null;
  sort_order: number | null;
  status: string | null;
};

function mapRow(row: InstagramEmbedRow): InstagramEmbed {
  return {
    id: row.id,
    title: row.title,
    instagramUrl: row.instagram_url,
    caption: row.caption,
    sortOrder: row.sort_order ?? 0,
    status: row.status || "published",
  };
}

export async function getAdminInstagramEmbeds() {
  const { client, error } = getSupabaseAdminClient();
  if (!client) {
    return { embeds: [] as InstagramEmbed[], error: error || "Supabase admin is not configured." };
  }

  const { data, error: queryError } = await client
    .from("instagram_embeds")
    .select("id,title,instagram_url,caption,sort_order,status")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    embeds: ((data || []) as InstagramEmbedRow[]).map(mapRow),
    error: queryError?.message,
  };
}
