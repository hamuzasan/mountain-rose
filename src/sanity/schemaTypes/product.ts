import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "Nama produk yang akan tampil di katalog dan halaman detail produk.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Slug URL produk. Contoh: rosewood-tote.",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description:
        "Harga produk dalam Rupiah untuk tampilan lokal. Gunakan angka saja, tanpa Rp atau titik. Boleh dikosongkan jika produk memakai harga katalog internasional.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "priceAmount",
      title: "Catalogue price amount",
      type: "number",
      description:
        "Harga numerik dari katalog atau source internasional, misalnya 75.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "priceCurrency",
      title: "Catalogue price currency",
      type: "string",
      description:
        "Mata uang harga katalog, misalnya USD. Biarkan kosong jika hanya memakai harga IDR lokal.",
    }),
    defineField({
      name: "priceNote",
      title: "Price note",
      type: "text",
      rows: 3,
      description:
        "Catatan opsional untuk harga katalog, misalnya perubahan harga karena quantity, kurs, atau kondisi pasar.",
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "string",
      description:
        "Material utama produk seperti tertulis pada katalog atau source brand, misalnya Genuine Cow Leather.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Kategori produk untuk filter katalog. Contoh: Tote Bag, Sling Bag, Handbag, Laptop Bag, Wallet, Custom Bag.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      description:
        "Pilih koleksi/editorial grouping jika produk termasuk dalam seri tertentu.",
      to: [{ type: "collection" }],
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      description: "Deskripsi singkat untuk card produk dan preview SEO.",
      validation: (rule) =>
        rule.max(180).warning("Usahakan tetap ringkas, sekitar 1-2 kalimat."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description:
        "Tulis copy editorial tentang material, siluet, ketahanan, fungsi, dan craftsmanship.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      description:
        "Upload foto produk utama dan detail. Minimal satu foto sangat disarankan untuk katalog.",
      validation: (rule) => rule.min(1).warning("Tambahkan minimal satu foto produk."),
    }),
    defineField({
      name: "leatherType",
      title: "Leather type",
      type: "string",
      description:
        "Jenis kulit yang digunakan, misalnya full-grain cow leather atau pull-up cow leather.",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description:
        "Nama warna produk. Gunakan nama yang hangat dan spesifik, misalnya Cognac, Espresso, Saddle Brown.",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description:
        "Ukuran produk, label singkat, atau dimensi. Contoh: Medium, 14 inch, 28 x 20 x 10 cm.",
    }),
    defineField({
      name: "sourcePdfPage",
      title: "Source PDF page",
      type: "number",
      description:
        "Nomor halaman PDF katalog yang menjadi sumber data dan gambar produk ini.",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured product",
      type: "boolean",
      description: "Aktifkan jika produk ingin tampil di bagian featured homepage.",
      initialValue: false,
    }),
    defineField({
      name: "isAvailable",
      title: "Available",
      type: "boolean",
      description: "Tentukan apakah produk sedang tersedia untuk dipesan.",
      initialValue: true,
    }),
    defineField({
      name: "whatsAppMessage",
      title: "WhatsApp message",
      type: "text",
      rows: 3,
      description:
        "Pesan WhatsApp opsional untuk produk ini. Jaga tetap sopan, tenang, dan premium.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
    },
  },
});
