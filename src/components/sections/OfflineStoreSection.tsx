import type { SiteSettings } from "@/types/site";

type OfflineStoreSectionProps = {
  siteSettings: Pick<SiteSettings, "address" | "brandName">;
};

const STORE_BACKGROUND_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDPLCh8fOE9Za9DbCW6_trUBggspO7OeTwB1j_kT0hK7ir4qmODi6RccuzLNkCTJsp31ElJoXja-YMP6wanQ0TMelIMNMhrlD6q4MQcTC2h7-dYsvTPSrN7H5LTQMGxs7f2mKcgQgLkoVAg6Khmhnr_Q1MgaVxiPeuhkmJaK40wtPzc7adWnKVXFpE8qQTjstVEsnfmaGK5-otAV2KquvL2auUFdLutFoB1T5VAQeTU6MFEp4Wsh0k1NN8EeeNNyTabB170go8A6qY";

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2.5a7 7 0 0 0-7 7c0 5.25 7 12 7 12s7-6.75 7-12a7 7 0 0 0-7-7Zm0 9.75a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5Zm.8 9.2 3.05 1.75-.8 1.35-3.8-2.2V7.2h1.55v4.75Z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="m8.3 5.3 7.4-2.45a2 2 0 0 1 2.63 1.9v14.4l-6.63 2.2-7.4-2.45A2 2 0 0 1 3 17V3.65l5.3 1.65Zm1.4 1.2v12.15l2.6.85V7.35l-2.6-.85Zm-2-.25L4.8 5.3v11.7a.2.2 0 0 0 .13.2l2.77.9V6.25Zm7 13.2 3.5-1.17V4.75a.2.2 0 0 0-.27-.2L14.7 5.63v13.82Z" />
    </svg>
  );
}

export default function OfflineStoreSection({ siteSettings }: OfflineStoreSectionProps) {
  const address = siteSettings.address || "Lagoon Avenue Mall GF 54 Bekasi";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  return (
    <section className="relative overflow-hidden bg-espresso text-warmIvory">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-60 saturate-[0.85]"
        style={{ backgroundImage: `url(${STORE_BACKGROUND_IMAGE})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-espresso/45" />
      <div aria-hidden="true" className="absolute inset-0 bg-warmIvory/15 mix-blend-screen" />

      <div className="relative z-10 mx-auto flex min-h-[34rem] w-full max-w-6xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6 lg:min-h-[42rem]">
        <p className="rounded-full border border-warmIvory/20 bg-espresso/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur">
          Offline Store
        </p>
        <h2 className="mt-6 max-w-3xl font-heading text-4xl leading-tight text-warmIvory drop-shadow sm:text-5xl">
          Visit the Mountain Rose Offline Store
        </h2>

        <div className="mt-8 w-full max-w-xl border border-warmIvory/20 bg-warmIvory/15 p-5 text-left shadow-soft backdrop-blur-md">
          <div className="flex gap-3 text-bone">
            <LocationIcon />
            <p className="text-sm leading-6 sm:text-base">{address}</p>
          </div>
          <div className="mt-4 flex gap-3 text-bone/85">
            <ClockIcon />
            <p className="text-sm leading-6 sm:text-base">Monday - Sunday, 10:00 AM - 8:00 PM WIB</p>
          </div>
        </div>

        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center gap-3 bg-warmIvory px-7 text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/80"
        >
          <MapIcon />
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
