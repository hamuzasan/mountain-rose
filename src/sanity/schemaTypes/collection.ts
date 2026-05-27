import { defineField, defineType } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Nama koleksi yang tampil di Studio dan halaman koleksi.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Slug URL koleksi. Contoh: tote-bag.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description:
        "Deskripsi editorial singkat tentang karakter koleksi dan jenis produk di dalamnya.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "imageWithAlt",
      description: "Gambar utama koleksi untuk tampilan editorial jika dibutuhkan.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "coverImage",
    },
  },
});
