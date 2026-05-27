import { defineField, defineType } from "sanity";

export const brandStory = defineType({
  name: "brandStory",
  title: "Brand Story",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Judul utama halaman Story.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      description: "Subjudul pendek tentang inspirasi dan positioning Mountain Rose.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      description:
        "Konten brand story umum. Field section di bawah dapat digunakan untuk halaman Story.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      description: "Gambar editorial pendukung halaman Story.",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 4,
      description: "Paragraf pembuka halaman Story.",
    }),
    defineField({
      name: "craftsmanshipTitle",
      title: "Craftsmanship title",
      type: "string",
      description: "Judul bagian craftsmanship.",
    }),
    defineField({
      name: "craftsmanshipText",
      title: "Craftsmanship text",
      type: "text",
      rows: 4,
      description:
        "Teks tentang detail pembuatan, struktur, jahitan, finishing, dan kegunaan.",
    }),
    defineField({
      name: "leatherTitle",
      title: "Leather title",
      type: "string",
      description: "Judul bagian material kulit.",
    }),
    defineField({
      name: "leatherText",
      title: "Leather text",
      type: "text",
      rows: 4,
      description:
        "Teks tentang kulit sapi asli, tekstur alami, ketahanan, dan patina.",
    }),
    defineField({
      name: "roseTitle",
      title: "Rose title",
      type: "string",
      description: "Judul bagian filosofi mawar.",
    }),
    defineField({
      name: "roseText",
      title: "Rose text",
      type: "text",
      rows: 4,
      description:
        "Teks tentang inspirasi mawar sebagai simbol elegansi, kelembutan, dan karakter.",
    }),
    defineField({
      name: "ctaTitle",
      title: "CTA title",
      type: "string",
      description: "Judul CTA di akhir halaman Story.",
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "text",
      rows: 3,
      description: "Teks CTA untuk mengarahkan pengunjung ke koleksi.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "image",
    },
  },
});
