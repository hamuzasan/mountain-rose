import { defineField, defineType } from "sanity";

export const leatherCareArticle = defineType({
  name: "leatherCareArticle",
  title: "Leather Care Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Judul artikel perawatan kulit.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Slug URL artikel. Contoh: cara-merawat-tas-kulit-sapi.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Ringkasan artikel untuk card, SEO, dan preview.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      description: "Isi artikel perawatan. Gunakan bahasa yang praktis, tenang, dan terpercaya.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "imageWithAlt",
      description: "Gambar cover artikel dengan nuansa editorial atau detail kulit.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: "Tanggal publikasi artikel.",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.warning("Tambahkan tanggal publikasi untuk urutan artikel."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage",
    },
  },
});
