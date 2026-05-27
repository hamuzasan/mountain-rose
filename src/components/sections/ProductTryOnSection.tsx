"use client";

import { useState } from "react";

type ProductTryOnSectionProps = {
  productSlug: string;
  isEnabled: boolean;
};

export default function ProductTryOnSection({
  productSlug,
  isEnabled,
}: ProductTryOnSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>(
    isEnabled ? "" : "Fitur preview AI sedang disiapkan.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEnabled) {
      setStatus("Fitur preview AI sedang disiapkan.");
      return;
    }
    if (!file) {
      setStatus("Pilih foto terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("productSlug", productSlug);
    formData.append("image", file);

    setIsSubmitting(true);
    setStatus("Mempersiapkan preview...");

    try {
      const response = await fetch("/api/ai/try-on", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      setStatus(
        result.ok
          ? "Preview berhasil dibuat."
          : result.message || result.error || "Preview belum bisa dibuat saat ini.",
      );
    } catch {
      setStatus("Preview belum bisa dibuat saat ini.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 rounded-soft border border-espresso/10 bg-warmIvory p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              AI Preview
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso">
              Coba Tas Ini
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-mutedBrown sm:text-base">
              Unggah foto untuk melihat gambaran visual tas ini secara personal.
              Preview AI bersifat ilustratif dan tidak menyimpan foto secara
              permanen.
            </p>
          </div>

          <form className="lg:col-span-5" onSubmit={handleSubmit}>
            <label
              htmlFor="try-on-image"
              className="block text-xs font-semibold uppercase text-mutedRose"
            >
              Foto pribadi
            </label>
            <input
              id="try-on-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={!isEnabled || isSubmitting}
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-soft border border-espresso/15 bg-bone px-3 py-2 text-sm text-mutedBrown file:mr-4 file:rounded-soft file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-sm file:font-semibold file:text-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!isEnabled || isSubmitting}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-soft border border-brass/40 bg-espresso px-5 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70 disabled:cursor-not-allowed disabled:bg-mutedBrown disabled:text-bone"
            >
              {isSubmitting ? "Membuat Preview" : "Buat Preview"}
            </button>
            {status ? (
              <p className="mt-3 text-sm leading-6 text-mutedBrown" role="status">
                {status}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
