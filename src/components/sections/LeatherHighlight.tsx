import SectionHeading from "./SectionHeading";

const ITEMS = [
  {
    title: "High-quality genuine cowhide",
    text: "Selected for structure, durability, and the natural grain that gives every bag a mature character.",
    icon: "grain",
  },
  {
    title: "Handmade by local craftsmen",
    text: "Handmade production keeps the stitching, finishing, and proportions careful and personal.",
    icon: "hand",
  },
  {
    title: "Exclusive and durable design",
    text: "Timeless silhouettes are shaped for daily rhythm, travel, and years of refined use.",
    icon: "shield",
  },
  {
    title: "Quality and after-sales support",
    text: "A calm ownership experience, supported by trusted quality and thoughtful service.",
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
          description="Genuine cowhide, handmade production, and respect for local craftsmanship form the foundation of every Mountain Rose bag."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-soft border border-espresso/10 bg-bone p-5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-antiqueGold/25 bg-warmIvory">
                <MaterialIcon type={item.icon} />
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-mutedRose">
                Material Note
              </div>
              <div className="mt-3 font-heading text-lg leading-snug text-espresso">
                {item.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-mutedBrown">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
