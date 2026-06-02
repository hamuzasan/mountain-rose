import type { Product } from "@/types/product";

type ProductMaterialDetailsProps = {
  product: Pick<Product, "leatherType" | "color" | "category">;
};

const DETAILS = ["Material", "Texture", "Durability", "Care"];

function DetailMark({ index }: { index: number }) {
  return (
    <div className="relative h-12 w-12 rounded-full border border-antiqueGold/30 bg-warmIvory sm:h-14 sm:w-14">
      <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-espresso/20" />
      <div
        className={[
          "absolute bg-mutedRose/70",
          index % 2 === 0
            ? "left-2 top-1/2 h-px w-8 -translate-y-1/2"
            : "left-1/2 top-2 h-8 w-px -translate-x-1/2",
        ].join(" ")}
      />
    </div>
  );
}

export default function ProductMaterialDetails({
  product,
}: ProductMaterialDetailsProps) {
  const leather = product.leatherType || "genuine cow leather";
  const color = product.color || "warm tone";

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Material Details
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso">
              Characterful Leather, Quiet Details
            </h2>
            <p className="mt-4 text-sm leading-7 text-mutedBrown">
              {leather} · {color}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {DETAILS.map((detail, index) => (
                <div
                  key={detail}
                  className="relative overflow-hidden rounded-soft border border-espresso/10 bg-bone p-4 sm:p-5"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-antiqueGold/20" />
                  <DetailMark index={index} />
                  <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-mutedRose">
                    0{index + 1}
                  </div>
                  <div className="mt-2 font-heading text-lg leading-snug text-espresso">
                    {detail}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
              Category: {product.category || "Collection"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
