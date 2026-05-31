import SectionHeading from "./SectionHeading";

export default function RoseEditorialSection() {
  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Rose"
              title="Mawar sebagai Simbol, Bukan Dekorasi"
              description="Di Mountain Rose, mawar hadir sebagai isyarat elegansi: halus, matang, dan penuh karakter."
            />
            <p className="mt-6 max-w-2xl text-sm leading-7 text-mutedBrown sm:text-base">
              Sentuhan rose tidak dimaksudkan untuk menjadi warna dominan. Ia hadir sebagai aksen yang terukur,
              menyeimbangkan kekuatan kulit sapi asli dengan nuansa lembut yang tetap premium.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-espresso/10 bg-warmIvory p-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Catatan Editorial
                </div>
                <div className="h-2 w-20 rounded-full bg-antiqueGold/40" />
              </div>
              <div className="mt-4 font-heading text-2xl leading-snug text-espresso">
                Halus, hangat, dan tidak lekang waktu.
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-soft border border-espresso/10 bg-bone px-4 py-3">
                  <div className="text-sm font-medium text-espresso">Elegansi</div>
                  <div className="mt-1 text-sm text-mutedBrown">
                    Siluet bersih dan proporsi yang seimbang.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-bone px-4 py-3">
                  <div className="text-sm font-medium text-espresso">Kelembutan</div>
                  <div className="mt-1 text-sm text-mutedBrown">
                    Aksen rose yang tidak mencolok, tetapi terasa.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-bone px-4 py-3">
                  <div className="text-sm font-medium text-espresso">Karakter</div>
                  <div className="mt-1 text-sm text-mutedBrown">
                    Kulit yang semakin hidup seiring waktu.
                  </div>
                </div>
              </div>
              <div className="mt-6 h-px w-full bg-espresso/10" />
              <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                Aksen muted rose secukupnya
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
