"use client";

import { useMemo, useState } from "react";

import type { SiteSettings } from "@/types/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type ContactFormSectionProps = {
  siteSettings: Pick<SiteSettings, "whatsappNumber">;
};

type FormState = {
  name: string;
  waNumber: string;
  productInterest: string;
  message: string;
};

export default function ContactFormSection({ siteSettings }: ContactFormSectionProps) {
  const [state, setState] = useState<FormState>({
    name: "",
    waNumber: "",
    productInterest: "",
    message: "",
  });

  const composedMessage = useMemo(() => {
    const parts = [
      "Halo Mountain Rose, saya ingin konsultasi.",
      "",
      "Nama:",
      state.name || "-",
      "",
      "Nomor WhatsApp:",
      state.waNumber || "-",
      "",
      "Produk yang diminati:",
      state.productInterest || "-",
      "",
      "Pesan:",
      state.message || "-",
    ];
    return parts.join("\n");
  }, [state]);

  const href = buildWhatsAppLink(siteSettings.whatsappNumber, composedMessage);

  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Pertanyaan
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso">
              Form Konsultasi Singkat
            </h2>
            <p className="mt-4 text-sm leading-7 text-mutedBrown sm:text-base">
              Isi beberapa detail agar kami bisa memberi rekomendasi yang lebih tepat. Form ini akan membuka WhatsApp dan tidak menyimpan data.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form
              className="rounded-soft border border-espresso/10 bg-warmIvory p-6"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(href, "_blank", "noopener,noreferrer");
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase text-mutedRose"
                  >
                    Nama
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={state.name}
                    onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                    className="mt-2 h-10 w-full rounded-soft border border-espresso/15 bg-bone px-3 text-sm text-espresso outline-none transition-colors focus:border-antiqueGold/70"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-wa"
                    className="block text-xs font-semibold uppercase text-mutedRose"
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    id="contact-wa"
                    type="tel"
                    value={state.waNumber}
                    onChange={(e) => setState((s) => ({ ...s, waNumber: e.target.value }))}
                    className="mt-2 h-10 w-full rounded-soft border border-espresso/15 bg-bone px-3 text-sm text-espresso outline-none transition-colors focus:border-antiqueGold/70"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="contact-interest"
                  className="block text-xs font-semibold uppercase text-mutedRose"
                >
                  Produk yang diminati
                </label>
                <input
                  id="contact-interest"
                  type="text"
                  value={state.productInterest}
                  onChange={(e) =>
                    setState((s) => ({ ...s, productInterest: e.target.value }))
                  }
                  className="mt-2 h-10 w-full rounded-soft border border-espresso/15 bg-bone px-3 text-sm text-espresso outline-none transition-colors focus:border-antiqueGold/70"
                  placeholder="Mis. Tote untuk kerja, sling untuk harian"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase text-mutedRose"
                >
                  Pesan
                </label>
                <textarea
                  id="contact-message"
                  value={state.message}
                  onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                  className="mt-2 w-full rounded-soft border border-espresso/15 bg-bone px-3 py-2 text-sm leading-7 text-espresso outline-none transition-colors focus:border-antiqueGold/70"
                  rows={5}
                  placeholder="Ceritakan kebutuhanmu: ukuran, warna, dan penggunaan harian."
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-soft border border-brass/40 bg-espresso px-5 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  Kirim via WhatsApp
                </button>
                <div className="text-xs font-semibold uppercase text-mutedBrown">
                  Data tidak disimpan
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
