import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Deskripsikan gambar dengan jelas untuk aksesibilitas dan SEO. Contoh: Rosewood Tote warna cognac tampak depan.",
      validation: (rule) => rule.required(),
    }),
  ],
});
