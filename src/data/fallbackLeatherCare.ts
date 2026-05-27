import type { LeatherCareArticle } from "@/types/leatherCare";

function isoDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function sectionsToPortableText(
  heading: string,
  sections: string[],
): unknown[] {
  const blocks: unknown[] = [
    {
      _type: "block",
      children: [{ _type: "span", text: heading }],
    },
  ];

  sections.forEach((s) => {
    blocks.push({
      _type: "block",
      children: [{ _type: "span", text: `- ${s}` }],
    });
  });

  return blocks;
}

export const FALLBACK_LEATHER_CARE_ARTICLES: LeatherCareArticle[] = [
  {
    _id: "fallback-lc-1",
    title: "Cara Merawat Tas Kulit Sapi agar Tetap Elegan",
    slug: "cara-merawat-tas-kulit-sapi",
    excerpt:
      "Panduan dasar menjaga tas kulit sapi agar tetap bersih, lembut, dan memiliki karakter alami yang indah.",
    content: sectionsToPortableText("Panduan dasar:", [
      "Bersihkan dengan kain lembut",
      "Hindari air berlebih",
      "Simpan di tempat kering",
      "Gunakan leather conditioner secukupnya",
    ]),
    coverImage: { alt: "Leather care (placeholder)" },
    publishedAt: isoDate(18),
  },
  {
    _id: "fallback-lc-2",
    title: "Hal yang Harus Dihindari pada Tas Kulit Asli",
    slug: "hal-yang-harus-dihindari-pada-tas-kulit-asli",
    excerpt:
      "Beberapa kebiasaan sederhana bisa membuat tas kulit lebih awet jika diperhatikan sejak awal.",
    content: sectionsToPortableText("Hal yang perlu dihindari:", [
      "Jangan menjemur langsung di bawah matahari",
      "Hindari menyimpan di tempat lembap",
      "Jangan memakai bahan kimia keras",
      "Hindari menumpuk barang terlalu berat",
    ]),
    coverImage: { alt: "Tas kulit asli (placeholder)" },
    publishedAt: isoDate(26),
  },
  {
    _id: "fallback-lc-3",
    title: "Kenapa Kulit Sapi Berubah Karakter Seiring Waktu",
    slug: "kenapa-kulit-sapi-berubah-karakter",
    excerpt:
      "Kulit sapi asli memiliki karakter alami yang berkembang seiring pemakaian dan perawatan.",
    content: sectionsToPortableText("Mengapa berubah:", [
      "Tekstur alami kulit",
      "Patina",
      "Warna yang semakin matang",
      "Cara menjaga perubahan tetap indah",
    ]),
    coverImage: { alt: "Karakter kulit sapi (placeholder)" },
    publishedAt: isoDate(35),
  },
  {
    _id: "fallback-lc-4",
    title: "Tips Menyimpan Tas Kulit Saat Tidak Digunakan",
    slug: "tips-menyimpan-tas-kulit",
    excerpt:
      "Penyimpanan yang tepat membantu menjaga bentuk, warna, dan kualitas tas kulit sapi.",
    content: sectionsToPortableText("Tips penyimpanan:", [
      "Gunakan dust bag",
      "Isi bagian dalam tas agar bentuk terjaga",
      "Simpan di tempat bersirkulasi baik",
      "Keluarkan secara berkala",
    ]),
    coverImage: { alt: "Penyimpanan tas kulit (placeholder)" },
    publishedAt: isoDate(44),
  },
];

