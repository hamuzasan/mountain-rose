import type { Product } from "@/types/product";

type ProductMaterialDetailsProps = {
  product: Pick<Product, "leatherType" | "color" | "category">;
};

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
              Every part is shaped to feel comfortable, look refined, and stay ready for years of daily movement.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Material
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Made from <span className="font-semibold text-espresso">{leather}</span>, selected for durability, structure, and mature character.
                </div>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Texture
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Natural grain gives every bag a distinct character, supported by a <span className="font-semibold text-espresso">{color}</span> finish.
                </div>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Durability
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Genuine cow leather can age beautifully. With mindful use, the bag stays strong and becomes more personal over time.
                </div>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Care
                </div>
                <div className="mt-3 text-sm leading-7 text-mutedBrown">
                  Store in a dry place, wipe gently, and use leather conditioner sparingly so the patina develops with care.
                </div>
              </div>
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
