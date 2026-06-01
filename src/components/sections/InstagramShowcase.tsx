import Link from "next/link";

import type { InstagramEmbed, SiteSettings } from "@/types/site";

type InstagramShowcaseProps = {
  embeds: InstagramEmbed[];
  siteSettings: Pick<SiteSettings, "instagramUrl" | "brandName">;
};

function getInstagramEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("instagram.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    const type = parts[0];
    const code = parts[1];

    if (!code || !["p", "reel", "tv"].includes(type)) return null;

    return `https://www.instagram.com/${type}/${code}/embed`;
  } catch {
    return null;
  }
}

function getInstagramHandle(profileUrl: string) {
  try {
    const parsed = new URL(profileUrl);
    const handle = parsed.pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : "@mountainrose";
  } catch {
    return "@mountainrose";
  }
}

function InstagramFrame({
  embed,
  index,
  handle,
}: {
  embed: InstagramEmbed;
  index: number;
  handle: string;
}) {
  const embedUrl = getInstagramEmbedUrl(embed.instagramUrl);

  return (
    <article className="group min-h-[28rem] border border-espresso/10 bg-bone">
      <div className="flex h-14 items-center gap-3 border-b border-espresso/10 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-mutedRose/30 bg-warmIvory font-heading text-sm text-espresso">
          MR
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-espresso">
            {embed.title || `Mountain Rose Journal ${index + 1}`}
          </div>
          <div className="text-xs text-mutedBrown">{handle}</div>
        </div>
      </div>

      {embedUrl ? (
        <iframe
          title={embed.title || `Mountain Rose Instagram embed ${index + 1}`}
          src={embedUrl}
          className="h-[32rem] w-full bg-warmIvory"
          loading="lazy"
        />
      ) : (
        <Link
          href={embed.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[32rem] flex-col items-center justify-center bg-warmIvory px-6 text-center transition-colors hover:bg-bone"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mutedRose">
            Instagram Story
          </span>
          <span className="mt-4 font-heading text-3xl leading-tight text-espresso">
            Open on Instagram
          </span>
          <span className="mt-4 max-w-xs text-sm leading-6 text-mutedBrown">
            Stories and some private content cannot be embedded directly, but this card is ready for the link you add in CMS.
          </span>
        </Link>
      )}

      {embed.caption ? (
        <div className="border-t border-espresso/10 px-4 py-4 text-sm leading-6 text-mutedBrown">
          {embed.caption}
        </div>
      ) : null}
    </article>
  );
}

export default function InstagramShowcase({ embeds, siteSettings }: InstagramShowcaseProps) {
  const visibleEmbeds = embeds.slice(0, 6);
  const handle = getInstagramHandle(siteSettings.instagramUrl);

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-espresso/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mutedRose">
              Social Journal
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-charcoal md:text-5xl">
              Follow Our Instagram
            </h2>
          </div>
          <Link
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            Visit Instagram
          </Link>
        </div>

        {visibleEmbeds.length ? (
          <div className="grid gap-0 overflow-hidden border border-espresso/10 md:grid-cols-2 xl:grid-cols-3">
            {visibleEmbeds.map((embed, index) => (
              <InstagramFrame key={embed.id} embed={embed} index={index} handle={handle} />
            ))}
          </div>
        ) : (
          <div className="grid gap-0 overflow-hidden border border-espresso/10 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Link
                key={index}
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[20rem] flex-col justify-between border border-espresso/10 bg-bone p-5 transition-colors hover:bg-warmIvory"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-mutedRose/30 bg-warmIvory font-heading text-sm text-espresso">
                    MR
                  </div>
                  <div className="text-sm font-semibold text-espresso">{handle}</div>
                </div>
                <div>
                  <div className="font-heading text-3xl text-charcoal">
                    Editorial leather moments
                  </div>
                  <p className="mt-3 text-sm leading-6 text-mutedBrown">
                    Add Instagram links in CMS to turn this space into a live social gallery.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
