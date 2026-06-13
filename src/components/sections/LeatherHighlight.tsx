import SectionHeading from "./SectionHeading";

const ITEMS = [
  {
    title: "High-quality genuine cow leather",
    icon: "grain",
  },
  {
    title: "Handmade by local craftsmen",
    icon: "hand",
  },
  {
    title: "Exclusive and durable design",
    icon: "shield",
  },
  {
    title: "Quality and after-sales support",
    icon: "care",
  },
];

function MaterialIcon({ type }: { type: string }) {
  const common = "h-8 w-8 text-espresso";

  if (type === "hand") {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={common} aria-hidden="true">
        <path d="M10 16V9a2 2 0 1 1 4 0v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 15V7a2 2 0 1 1 4 0v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 15V9a2 2 0 1 1 4 0v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 17l-2-2a2 2 0 0 0-3 2l5 8a8 8 0 0 0 14-5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={common} aria-hidden="true">
        <path d="M16 4l10 4v7c0 7-4.5 11-10 13C10.5 26 6 22 6 15V8l10-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 16l3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "care") {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={common} aria-hidden="true">
        <path d="M16 27s-9-5.4-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7.6-9 13-9 13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 15h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" className={common} aria-hidden="true">
      <path d="M6 22c6-9 14-9 20-16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 26c6-8 13-8 19-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 17c4 0 6 2 8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function LeatherHighlight() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Material"
          title="Crafted from Material with Character"
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ITEMS.map((item, index) => (
            <div
              key={item.title}
              className="relative min-h-[10rem] overflow-hidden rounded-soft border border-espresso/10 bg-bone p-4 transition-colors hover:border-antiqueGold/40 sm:min-h-[12rem] sm:p-5"
            >
              <div className="pointer-events-none absolute -right-7 -top-7 text-espresso opacity-[0.06]">
                <div className="scale-[2.4]">
                  <MaterialIcon type={item.icon} />
                </div>
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-antiqueGold/25 bg-warmIvory sm:h-16 sm:w-16">
                <MaterialIcon type={item.icon} />
              </div>
              <div className="relative mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-mutedRose sm:text-xs">
                0{index + 1}
              </div>
              <div className="relative mt-2 font-heading text-base leading-snug text-espresso sm:text-lg">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
