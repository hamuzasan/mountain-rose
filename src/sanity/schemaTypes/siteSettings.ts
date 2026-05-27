import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Brand name",
      type: "string",
      initialValue: "Mountain Rose",
      description: "Nama brand yang tampil di navbar, footer, dan metadata.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Tagline singkat brand. Contoh: Tas kulit sapi asli dengan sentuhan elegan yang terinspirasi dari mawar.",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      description:
        "Nomor WhatsApp format internasional tanpa spasi. Contoh: 628123456789.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      description: "URL Instagram resmi Mountain Rose.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
      description: "Email kontak resmi untuk pertanyaan pelanggan.",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Alamat atau area operasional bisnis.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "imageWithAlt",
      description: "Logo brand untuk kebutuhan CMS dan metadata visual.",
    }),
  ],
  preview: {
    select: {
      title: "brandName",
      subtitle: "tagline",
      media: "logo",
    },
  },
});
