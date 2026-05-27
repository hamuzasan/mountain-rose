import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      description: "Judul utama homepage. Buat singkat, elegan, dan jelas.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 3,
      description: "Subjudul hero yang menjelaskan karakter Mountain Rose.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
      description: "Gambar editorial utama homepage. Gunakan foto tas/kulit yang premium.",
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured products",
      type: "array",
      description: "Pilih produk yang ingin ditampilkan di homepage.",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    }),
    defineField({
      name: "storySectionTitle",
      title: "Story section title",
      type: "string",
      description: "Judul singkat untuk preview brand story di homepage.",
    }),
    defineField({
      name: "storySectionText",
      title: "Story section text",
      type: "blockContent",
      description: "Copy pendek tentang material, craftsmanship, dan filosofi brand.",
    }),
    defineField({
      name: "ctaTitle",
      title: "CTA title",
      type: "string",
      description: "Judul call-to-action homepage.",
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "text",
      rows: 3,
      description: "Teks pendukung untuk CTA konsultasi atau koleksi.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage",
      };
    },
  },
});
