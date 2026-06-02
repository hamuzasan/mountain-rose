"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type InstagramInsert = Database["public"]["Tables"]["instagram_embeds"]["Insert"];
type InstagramUpdate = Database["public"]["Tables"]["instagram_embeds"]["Update"];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function numberValue(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function instagramPayload(formData: FormData): InstagramInsert {
  const instagramUrl = text(formData, "instagramUrl");
  if (!instagramUrl) throw new Error("Instagram URL is required.");

  return {
    title: nullableText(formData, "title"),
    instagram_url: instagramUrl,
    caption: nullableText(formData, "caption"),
    sort_order: numberValue(formData, "sortOrder"),
    status: text(formData, "status") === "draft" ? "draft" : "published",
  };
}

function adminInstagramErrorUrl(message: string) {
  const params = new URLSearchParams({ error: message });
  return `/admin/instagram?${params.toString()}`;
}

function messageFromError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Instagram card action failed.";
}

export async function saveInstagramEmbedAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) {
    redirect(adminInstagramErrorUrl("This account is not active as a CMS admin."));
  }

  const { client } = getSupabaseAdminClient();
  if (!client) {
    redirect(adminInstagramErrorUrl("Supabase admin client is not configured."));
  }

  try {
    const embedId = text(formData, "embedId");
    const payload = instagramPayload(formData);

    if (embedId) {
      const updatePayload: InstagramUpdate = payload;
      const { error } = await client.from("instagram_embeds").update(updatePayload).eq("id", embedId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client.from("instagram_embeds").insert(payload);
      if (error) throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin/instagram");
  } catch (error) {
    redirect(adminInstagramErrorUrl(messageFromError(error)));
  }

  redirect("/admin/instagram?saved=1");
}

export async function deleteInstagramEmbedAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) {
    redirect(adminInstagramErrorUrl("This account is not active as a CMS admin."));
  }

  const { client } = getSupabaseAdminClient();
  if (!client) {
    redirect(adminInstagramErrorUrl("Supabase admin client is not configured."));
  }

  try {
    const embedId = text(formData, "embedId");
    if (!embedId) throw new Error("Instagram embed ID is missing.");

    const { error } = await client.from("instagram_embeds").delete().eq("id", embedId);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/instagram");
  } catch (error) {
    redirect(adminInstagramErrorUrl(messageFromError(error)));
  }

  redirect("/admin/instagram?deleted=1");
}
