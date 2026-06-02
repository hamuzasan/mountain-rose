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
  const title = embed.title || `Mountain Rose Journal ${index + 1}`;

  return (
    <article className="group min-h-[18rem] overflow-hidden border border-espresso/10 bg-bone md:min-h-[28rem]">
      <div className="flex h-12 items-center gap-2 border-b border-espresso/10 px-2 sm:h-14 sm:gap-3 sm:px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mutedRose/30 bg-warmIvory font-heading text-xs text-espresso sm:h-9 sm:w-9 sm:text-sm">
          MR
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-espresso sm:text-sm">
            {title}
          </div>
          <div className="text-[0.65rem] text-mutedBrown sm:text-xs">{handle}</div>
        </div>
      </div>

      {embedUrl ? (
        <>
          <Link
            href={embed.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-[18rem] flex-col justify-between overflow-hidden bg-warmIvory p-3 transition-colors hover:bg-bone md:hidden"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-mutedRose/20" />
            <div className="absolute bottom-8 left-5 h-px w-24 rotate-[-12deg] bg-antiqueGold/35" />
            <div className="relative">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mutedRose">
                Instagram
              </span>
              <h3 className="mt-3 line-clamp-3 font-heading text-xl leading-tight text-espresso">
                {title}
              </h3>
            </div>
            <div className="relative">
              {embed.caption ? (
                <p className="line-clamp-3 text-xs leading-5 text-mutedBrown">
                  {embed.caption}
                </p>
              ) : null}
              <span className="mt-4 inline-flex min-h-9 items-center rounded-full bg-espresso px-4 text-xs font-semibold text-warmIvory">
                Open Post
              </span>
            </div>
          </Link>
          <div className="hidden h-[32rem] overflow-hidden bg-warmIvory md:block">
            <iframe
              title={`${title} Instagram embed`}
              src={embedUrl}
              className="h-full w-full overflow-hidden border-0 bg-warmIvory"
              loading="lazy"
              scrolling="no"
              style={{ overflow: "hidden" }}
            />
          </div>
        </>
      ) : (
        <Link
          href={embed.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[18rem] flex-col items-center justify-center bg-warmIvory px-3 text-center transition-colors hover:bg-bone md:h-[32rem] md:px-6"
        >
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mutedRose sm:text-xs">
            Instagram Story
          </span>
          <span className="mt-3 font-heading text-xl leading-tight text-espresso sm:mt-4 sm:text-3xl">
            Open on Instagram
          </span>
          <span className="mt-4 hidden max-w-xs text-sm leading-6 text-mutedBrown sm:block">
            Stories and some private content cannot be embedded directly, but this card is ready for the link you add in CMS.
          </span>
        </Link>
      )}

      {embed.caption ? (
        <div className="hidden border-t border-espresso/10 px-4 py-4 text-sm leading-6 text-mutedBrown sm:block">
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
          <div className="grid grid-cols-2 gap-0 overflow-hidden border border-espresso/10 md:grid-cols-2 xl:grid-cols-3">
            {visibleEmbeds.map((embed, index) => (
              <InstagramFrame key={embed.id} embed={embed} index={index} handle={handle} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0 overflow-hidden border border-espresso/10 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Link
                key={index}
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[14rem] flex-col justify-between border border-espresso/10 bg-bone p-3 transition-colors hover:bg-warmIvory sm:min-h-[20rem] sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-mutedRose/30 bg-warmIvory font-heading text-xs text-espresso sm:h-9 sm:w-9 sm:text-sm">
                    MR
                  </div>
                  <div className="truncate text-xs font-semibold text-espresso sm:text-sm">{handle}</div>
                </div>
                <div>
                  <div className="font-heading text-xl leading-tight text-charcoal sm:text-3xl">
                    Editorial leather moments
                  </div>
                  <p className="mt-3 hidden text-sm leading-6 text-mutedBrown sm:block">
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
