import SectionHeading from "./SectionHeading";

const ITEMS = [
  {
    title: "Tahan untuk pemakaian harian",
    text: "Kulit sapi asli membantu tas tetap terasa kokoh, nyaman dipakai, dan siap menemani rutinitas.",
  },
  {
    title: "Tekstur alami yang berkarakter",
    text: "Setiap lembar kulit memiliki grain dan nuansa unik yang membuat tas terasa lebih personal.",
  },
  {
    title: "Semakin indah seiring waktu",
    text: "Dengan perawatan yang tepat, warna dan kilau kulit berkembang menjadi patina yang lebih kaya.",
  },
  {
    title: "Elegan tanpa berlebihan",
    text: "Kesan premium hadir lewat bentuk yang matang, detail rapi, dan warna hangat yang timeless.",
  },
];

export default function LeatherHighlight() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Material"
          title="Kulit Sapi Asli, Dipilih dengan Tenang"
          description="Kami memilih material untuk ketahanan dan karakter, bukan untuk kesan yang berlebihan."
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

