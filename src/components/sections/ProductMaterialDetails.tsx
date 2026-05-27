import type { Product } from "@/types/product";

type ProductMaterialDetailsProps = {
  product: Pick<Product, "leatherType" | "color" | "category">;
};

export default function ProductMaterialDetails({
  product,
}: ProductMaterialDetailsProps) {
  const leather = product.leatherType || "Kulit sapi asli";
  const color = product.color || "nuansa hangat";

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Material Details
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso">
              Kulit yang Berkarakter, Detail yang Tenang
            </h2>
            <p className="mt-4 text-sm leading-7 text-mutedBrown">
              Setiap bagian dirancang untuk terasa nyaman dipakai, rapi dipandang,
              dan layak menemani perjalanan panjang.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Material
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Dibuat dari <span className="font-semibold text-espresso">{leather}</span>, dipilih untuk ketahanan dan struktur yang matang.
                </div>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Texture
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Tekstur grain alami memberi karakter unik pada setiap tas, dengan warna <span className="font-semibold text-espresso">{color}</span>.
                </div>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Durability
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Kulit sapi asli dapat menua dengan indah. Dengan pemakaian wajar, tas tetap kokoh dan semakin terasa personal.
                </div>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Care
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Simpan di tempat kering, bersihkan lembut, dan gunakan conditioner kulit seperlunya agar patina berkembang dengan halus.
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
              Category: {product.category || "Koleksi"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

