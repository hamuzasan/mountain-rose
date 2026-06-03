import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminProducts } from "@/lib/admin/products";
import { formatProductPrice } from "@/lib/format";
import { getOrderedProductImages, getProductImageUrl } from "@/lib/product-images";
import type { Product } from "@/types/product";

import { saveProductAction, setProductStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product CMS",
  description: "Manage the Mountain Rose product catalogue.",
};

type AdminProduct = Product & { status?: string | null };

type PageProps = {
  searchParams?: Promise<{
    edit?: string;
    saved?: string;
    status?: string;
    error?: string;
  }>;
};

function fieldValue(value?: string | number | null) {
  return value == null ? "" : String(value);
}

function ProductThumb({ product }: { product: AdminProduct }) {
  const image = getOrderedProductImages(product.images)[0];
  const imageUrl = getProductImageUrl(image);

  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-soft border border-espresso/10 bg-sand/25">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={image?.alt || `${product.name} image`}
          fill
          sizes="64px"
          className="object-contain p-1"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[0.6rem] font-semibold uppercase text-mutedBrown">
          MR
        </div>
      )}
    </div>
  );
}

function TextInput({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={fieldValue(defaultValue)}
        className="mt-2 min-h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | unknown[] | null;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        className="mt-2 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 py-3 text-sm leading-6 text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      />
    </label>
  );
}

function ProductForm({ product }: { product?: AdminProduct }) {
  return (
    <form action={saveProductAction} className="space-y-5">
      <input type="hidden" name="productId" value={product?._id || ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Product name" name="name" defaultValue={product?.name} required />
        <TextInput label="Slug URL" name="slug" defaultValue={product?.slug} required />
        <TextInput label="Category" name="category" defaultValue={product?.category} required />
        <TextInput label="Material" name="material" defaultValue={product?.material} />
        <TextInput label="Leather type" name="leatherType" defaultValue={product?.leatherType} />
        <TextInput label="Color" name="color" defaultValue={product?.color} />
        <TextInput label="Size" name="size" defaultValue={product?.size} />
        <TextInput
          label="IDR price"
          name="price"
          type="number"
          defaultValue={product?.price}
        />
        <TextInput
          label="Catalogue price"
          name="priceAmount"
          type="number"
          defaultValue={product?.priceAmount}
        />
        <TextInput
          label="Currency"
          name="priceCurrency"
          defaultValue={product?.priceCurrency || "USD"}
        />
        <TextInput
          label="PDF page"
          name="sourcePdfPage"
          type="number"
          defaultValue={product?.sourcePdfPage}
        />
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
            Status
          </span>
          <select
            name="status"
            defaultValue={product?.status === "published" ? "published" : "draft"}
            className="mt-2 min-h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <TextArea
        label="Short description"
        name="shortDescription"
        defaultValue={product?.shortDescription}
        rows={3}
      />
      <TextArea label="Full description" name="description" defaultValue={product?.description} />
      <TextArea label="Price note" name="priceNote" defaultValue={product?.priceNote} rows={2} />
      <TextArea
        label="Product WhatsApp message"
        name="whatsAppMessage"
        defaultValue={product?.whatsAppMessage}
        rows={2}
      />

      <div className="grid gap-3 rounded-soft border border-espresso/10 bg-bone p-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm font-semibold text-espresso">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={Boolean(product?.isFeatured)}
            className="h-4 w-4 accent-deepRose"
          />
          Show as featured
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-espresso">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={product?.isAvailable !== false}
            className="h-4 w-4 accent-deepRose"
          />
          Product available
        </label>
      </div>

      <label className="block rounded-soft border border-dashed border-espresso/25 bg-bone p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
          Upload product images
        </span>
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="mt-3 block w-full text-sm text-mutedBrown file:mr-4 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-sm file:font-semibold file:text-warmIvory"
        />
        <span className="mt-2 block text-xs leading-5 text-mutedBrown">
          Images will be saved to Supabase Storage: product-images/products/[slug]/.
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-7 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather md:w-auto"
      >
        Save Product
      </button>
    </form>
  );
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const [session, rawParams] = await Promise.all([
    requireAdmin(),
    searchParams ? searchParams : Promise.resolve({}),
  ]);
  const params = rawParams as { edit?: string; saved?: string; status?: string; error?: string };
  const { products, error } = await getAdminProducts();
  const activeProduct = params.edit
    ? (products.find((product) => product.slug === params.edit) as AdminProduct | undefined)
    : undefined;

  if (!session.profile) {
    return (
      <div className="bg-warmIvory px-5 py-16">
        <div className="mx-auto max-w-2xl border border-mutedRose/25 bg-bone p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
            Admin inactive
          </p>
          <h1 className="mt-4 font-heading text-4xl text-charcoal">
            This account is not listed in admin_profiles
          </h1>
          <p className="mt-4 leading-7 text-mutedBrown">
            Create the user in Supabase Auth, then add the user ID and email to the
            admin_profiles table. After that, the product CMS page can be used.
          </p>
          <Link
            href="/admin/logout"
            prefetch={false}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-warmIvory"
          >
            Sign Out
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warmIvory px-5 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-espresso/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
              Mountain Rose CMS
            </p>
            <h1 className="mt-3 font-heading text-4xl text-charcoal sm:text-5xl">
              Product Catalogue
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mutedBrown">
              Add, edit, upload images, and publish catalogue products. WhatsApp AI CMS
              writes to the same data, so AI results stay easy to review here.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/leather-care"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Leather Care
            </Link>
            <Link
              href="/admin/settings"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Site Settings
            </Link>
            <Link
              href="/admin/instagram"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Instagram Cards
            </Link>
            <Link
              href="/admin/whatsapp-debug"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Debug WhatsApp
            </Link>
            <Link
              href="/collections"
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              View Catalogue
            </Link>
            <Link
              href="/admin/logout"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full bg-espresso px-5 text-sm font-semibold text-warmIvory"
            >
              Sign Out
            </Link>
          </div>
        </div>

        {params.saved ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Product saved successfully.
          </div>
        ) : null}
        {params.status ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Product status changed to{" "}
            <strong>{params.status === "published" ? "Published" : "Draft"}</strong>.
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
            {params.error}
          </div>
        ) : null}
        {error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-charcoal">Product List</h2>
              <Link
                href="/admin/products"
                prefetch={false}
                className="text-sm font-semibold text-mutedRose hover:text-deepRose"
              >
                New Product
              </Link>
            </div>

            <div className="overflow-hidden border border-espresso/10 bg-bone shadow-soft">
              {products.length ? (
                <div className="divide-y divide-espresso/10">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="grid gap-4 p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
                    >
                      <ProductThumb product={product as AdminProduct} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-xl text-espresso">{product.name}</h3>
                          <span className="rounded-full border border-espresso/10 bg-warmIvory px-2 py-1 text-[0.65rem] font-semibold uppercase text-mutedBrown">
                            {(product as AdminProduct).status || "draft"}
                          </span>
                          {product.isFeatured ? (
                            <span className="rounded-full border border-antiqueGold/30 bg-antiqueGold/10 px-2 py-1 text-[0.65rem] font-semibold uppercase text-espresso">
                              Featured
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-mutedBrown">
                          {product.category || "-"} - {formatProductPrice(product)}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-mutedBrown">
                          {product.shortDescription || "No short description yet."}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <Link
                          href={`/admin/products?edit=${product.slug}`}
                          prefetch={false}
                          className="inline-flex min-h-10 items-center rounded-full border border-espresso/15 bg-warmIvory px-4 text-sm font-semibold text-espresso"
                        >
                          Edit
                        </Link>
                        <form action={setProductStatusAction}>
                          <input type="hidden" name="productId" value={product._id} />
                          <input
                            type="hidden"
                            name="status"
                            value={
                              (product as AdminProduct).status === "published"
                                ? "draft"
                                : "published"
                            }
                          />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-warmIvory"
                          >
                            {(product as AdminProduct).status === "published"
                              ? "Draft"
                              : "Publish"}
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-sm text-mutedBrown">
                  No products yet. Use the form beside this list or send ADD_PRODUCT via WhatsApp.
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="border border-espresso/10 bg-bone p-5 shadow-soft">
              <h2 className="font-heading text-2xl text-charcoal">
                {activeProduct ? "Edit Product" : "New Product"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-mutedBrown">
                This form is the main CMS for the catalogue. All fields are also used by WhatsApp AI.
              </p>
              <div className="mt-5">
                <ProductForm product={activeProduct} />
              </div>
            </section>

            <section className="border border-espresso/10 bg-espresso p-5 text-warmIvory shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-antiqueGold">
                WhatsApp AI CMS
              </p>
              <h2 className="mt-3 font-heading text-2xl">Ready for Fonnte</h2>
              <p className="mt-3 text-sm leading-6 text-bone/80">
                Set the webhook to /api/webhooks/whatsapp/fonnte, fill FONNTE_TOKEN,
                ADMIN_WHATSAPP_NUMBERS, and enable WHATSAPP_AI_CMS_ENABLED=true.
              </p>
              <Link
                href="/admin/whatsapp-debug"
                prefetch={false}
                className="mt-4 inline-flex min-h-11 items-center rounded-full border border-antiqueGold/30 bg-warmIvory/10 px-5 text-sm font-semibold text-warmIvory"
              >
                View webhook debug
              </Link>
              <pre className="mt-4 overflow-x-auto rounded-soft bg-darkLeather p-4 text-xs leading-5 text-bone">
{`ADD_PRODUCT
Name: Sundaland Beauty Rose
Price: USD 75
Category: Clutch & Sling Bag
Color: Black
Material: Genuine Cow Leather
Short description: Genuine cow leather bag with a refined rose detail.`}
              </pre>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
