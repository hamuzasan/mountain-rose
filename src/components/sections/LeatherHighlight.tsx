import SectionHeading from "./SectionHeading";

const ITEMS = [
  {
    title: "High quality genuine cowhide",
    text: "Material kulit sapi asli dipilih untuk struktur, ketahanan, dan karakter alami yang terasa matang.",
  },
  {
    title: "Handmade by local craftsmen",
    text: "Proses handmade menjaga detail jahitan, finishing, dan proporsi tas agar terasa lebih personal.",
  },
  {
    title: "Exclusive and durable design",
    text: "Siluet dibuat timeless, tidak mengikuti tren sesaat, dan tetap relevan untuk rutinitas maupun perjalanan.",
  },
  {
    title: "Quality and after-sales support",
    text: "Mountain Rose membangun hubungan jangka panjang melalui kualitas produk dan layanan yang dapat dipercaya.",
  },
];

export default function LeatherHighlight() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Material"
          title="Material yang Kuat, Proses yang Manusiawi"
          description="Dari company profile Mountain Rose: genuine cowhide, proses handmade, dan produksi yang menghargai pengrajin lokal menjadi fondasi setiap produk."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-soft border border-espresso/10 bg-bone p-5"
            >
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Highlight
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
