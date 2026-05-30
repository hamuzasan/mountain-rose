import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Collection } from "@/types/product";

export async function getAllCollections(): Promise<Collection[]> {
  const { client } = getSupabaseServerClient();
  if (!client) return [];

  const { data } = await client
    .from("collections")
    .select("id,title,slug,description,cover_image_url")
    .order("title", { ascending: true });

  return (data || []).map((c) => ({
    _id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description ?? undefined,
    coverImage: c.cover_image_url ? { alt: `${c.title} cover` } : undefined,
  }));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const { client } = getSupabaseServerClient();
  if (!client) return null;

  const { data } = await client
    .from("collections")
    .select("id,title,slug,description,cover_image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  return {
    _id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description ?? undefined,
    coverImage: data.cover_image_url ? { alt: `${data.title} cover` } : undefined,
  };
}
