"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type SiteSettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];
type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function siteSettingsPayload(formData: FormData): SiteSettingsInsert {
  return {
    brand_name: text(formData, "brandName") || "Mountain Rose",
    tagline: nullableText(formData, "tagline"),
    whatsapp_number: nullableText(formData, "whatsappNumber"),
    instagram_url: nullableText(formData, "instagramUrl"),
    email: nullableText(formData, "email"),
    address: nullableText(formData, "address"),
    logo_url: nullableText(formData, "logoUrl"),
  };
}

export async function saveSiteSettingsAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) throw new Error("This account is not active as a CMS admin.");

  const { client } = getSupabaseAdminClient();
  if (!client) throw new Error("Supabase admin client is not configured.");

  const settingsId = text(formData, "settingsId");
  const payload = siteSettingsPayload(formData);

  if (settingsId) {
    const updatePayload: SiteSettingsUpdate = payload;
    const { error } = await client.from("site_settings").update(updatePayload).eq("id", settingsId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await client.from("site_settings").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
