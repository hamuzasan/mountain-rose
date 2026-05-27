import "server-only";

import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, hasSanityConfig, projectId } from "../env";

let cachedClient: SanityClient | null = null;

export function getSanityWriteClient(): {
  client: SanityClient | null;
  error?: string;
} {
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!hasSanityConfig || !projectId || !dataset) {
    return {
      client: null,
      error: "Sanity project ID or dataset is not configured.",
    };
  }

  if (!token) {
    return {
      client: null,
      error: "SANITY_WRITE_TOKEN is not configured.",
    };
  }

  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });
  }

  return { client: cachedClient };
}
