import type { Product } from "@/types/product";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: "fallback-rosewood-tote",
    name: "Rosewood Tote",
    slug: "rosewood-tote",
    price: 850000,
    category: "Tote Bag",
    leatherType: "Full-grain cow leather",
    color: "Cognac",
    shortDescription:
      "Tote yang tenang dengan ruang lega, dibuat untuk rutinitas harian yang rapi dan matang.",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Rosewood Tote dibuat dari kulit sapi pilihan dengan siluet yang matang. Tekstur alami kulit memberi karakter hangat yang semakin indah seiring waktu.",
          },
        ],
      },
    ],
    size: "L",
    isAvailable: true,
    images: [{ alt: "Rosewood Tote (placeholder)" }],
  },
  {
    _id: "fallback-alpine-sling",
    name: "Alpine Sling",
    slug: "alpine-sling",
    price: 520000,
    category: "Sling Bag",
    leatherType: "Pull-up cow leather",
    color: "Dark Brown",
    shortDescription:
      "Ringkas dan elegan, cocok untuk langkah yang lebih bebas tanpa kehilangan karakter kulit.",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Alpine Sling mengutamakan kenyamanan dan proporsi yang seimbang. Cocok untuk keseharian yang dinamis dengan kesan premium yang tenang.",
          },
        ],
      },
    ],
    size: "M",
    isAvailable: true,
    images: [{ alt: "Alpine Sling (placeholder)" }],
  },
  {
    _id: "fallback-heritage-handbag",
    name: "Heritage Handbag",
    slug: "heritage-handbag",
    price: 780000,
    category: "Handbag",
    leatherType: "Genuine cow leather",
    color: "Espresso",
    shortDescription:
      "Bentuk klasik yang matang, menghadirkan kesan premium untuk momen penting.",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Heritage Handbag menghadirkan bentuk klasik dengan detail yang rapi. Kulit sapi asli memberi struktur yang kokoh dan tampilan yang tetap elegan.",
          },
        ],
      },
    ],
    size: "M",
    isAvailable: true,
    images: [{ alt: "Heritage Handbag (placeholder)" }],
  },
  {
    _id: "fallback-valley-laptop-bag",
    name: "Valley Laptop Bag",
    slug: "valley-laptop-bag",
    price: 950000,
    category: "Laptop Bag",
    leatherType: "Full-grain cow leather",
    color: "Saddle Brown",
    shortDescription:
      "Struktur kokoh untuk perangkat harian, dengan detail yang tetap halus dan rapi.",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Valley Laptop Bag dibuat untuk membawa perangkat dan dokumen dengan aman. Struktur kulit full-grain menjaga bentuk tetap rapi untuk penggunaan jangka panjang.",
          },
        ],
      },
    ],
    size: "Laptop 14-15\"",
    isAvailable: true,
    images: [{ alt: "Valley Laptop Bag (placeholder)" }],
  },
  {
    _id: "fallback-bloom-wallet",
    name: "Bloom Wallet",
    slug: "bloom-wallet",
    price: 280000,
    category: "Wallet",
    leatherType: "Genuine cow leather",
    color: "Deep Rose Brown",
    shortDescription:
      "Dompet ringkas dengan sentuhan rose yang subtil, untuk keseharian yang tertata.",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Bloom Wallet menawarkan bentuk ringkas dengan nuansa rose yang halus. Tekstur kulit tetap terasa hangat, rapi, dan premium.",
          },
        ],
      },
    ],
    size: "Compact",
    isAvailable: true,
    images: [{ alt: "Bloom Wallet (placeholder)" }],
  },
  {
    _id: "fallback-custom-mountain-bag",
    name: "Custom Mountain Bag",
    slug: "custom-mountain-bag",
    price: 0,
    category: "Custom Bag",
    leatherType: "Custom leather selection",
    color: "Custom",
    shortDescription:
      "Konsultasikan kebutuhanmu untuk rancangan tas yang benar-benar personal dan matang.",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Custom Mountain Bag tersedia untuk kebutuhan khusus. Pilih material, warna, dan ukuran sesuai gaya serta fungsi yang kamu butuhkan.",
          },
        ],
      },
    ],
    size: "Custom",
    isAvailable: false,
    images: [{ alt: "Custom Mountain Bag (placeholder)" }],
  },
];
