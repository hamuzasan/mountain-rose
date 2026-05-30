export type CatalogueImportProduct = {
  name: string;
  slug: string;
  category: string;
  material: string;
  leatherType: string;
  color: string;
  size: string;
  priceCurrency: "USD";
  priceAmount: number;
  priceNote: string;
  sourcePdfPage: number;
  isFeatured: boolean;
  isAvailable: boolean;
  shortDescription: string;
  description: string;
  whatsAppMessage: string;
};

const defaultPriceNote =
  "Prices can change without notice depending on quantity, exchange rates and market conditions.";

export const mountainRoseCatalogueProducts: CatalogueImportProduct[] = [
  {
    name: "Sundaland Beauty Rose",
    slug: "sundaland-beauty-rose",
    category: "Clutch & Sling Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Brown",
    size: "24 x 15 x 8",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 2,
    isFeatured: true,
    isAvailable: true,
    shortDescription:
      "Tas clutch dan sling kulit sapi asli dengan siluet rapi dan nuansa hangat untuk tampilan yang elegan.",
    description:
      "Sundaland Beauty Rose menghadirkan bentuk ringkas dengan kesan feminin yang tenang. Material genuine cow leather memberi karakter alami, sementara proporsinya cocok untuk momen harian maupun acara yang lebih istimewa.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Sundaland Beauty Rose. Apakah masih tersedia?",
  },
  {
    name: "Sundaland Beauty Moon",
    slug: "sundaland-beauty-moon",
    category: "Sling Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Black",
    size: "26 x 17 x 7",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 3,
    isFeatured: true,
    isAvailable: true,
    shortDescription:
      "Sling bag kulit sapi asli dengan struktur ringan dan tampilan matang untuk perjalanan sehari-hari.",
    description:
      "Sundaland Beauty Moon dirancang untuk membawa kebutuhan penting dengan cara yang lebih ringkas dan refined. Kulit sapi asli memberi tekstur yang kuat sekaligus menjaga kesan premium yang tidak berlebihan.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Sundaland Beauty Moon. Apakah masih tersedia?",
  },
  {
    name: "Sundaland Beauty Pouch",
    slug: "sundaland-beauty-pouch",
    category: "Pouch",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Cognac",
    size: "20 x 15 x 5",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 4,
    isFeatured: true,
    isAvailable: true,
    shortDescription:
      "Pouch kulit sapi asli dengan ukuran praktis, tekstur hangat, dan karakter yang tetap elegan.",
    description:
      "Sundaland Beauty Pouch cocok untuk penyimpanan esensial yang tetap terasa rapi saat dibawa. Bentuknya sederhana, namun material kulit sapi asli membuat tampilannya tetap berkelas dan nyaman dipadukan dengan berbagai gaya.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Sundaland Beauty Pouch. Apakah masih tersedia?",
  },
  {
    name: "Papandayan Messenger",
    slug: "papandayan-messenger",
    category: "Messenger Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Dark Brown",
    size: "34 x 24 x 7",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 5,
    isFeatured: true,
    isAvailable: true,
    shortDescription:
      "Messenger bag kulit sapi asli dengan siluet tegas dan ruang yang cukup untuk aktivitas harian.",
    description:
      "Papandayan Messenger dibuat untuk pengguna yang membutuhkan tas kerja atau perjalanan ringan dengan kesan dewasa. Material genuine cow leather membantu menjaga struktur tas tetap rapi sambil menghadirkan karakter yang kuat.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Papandayan Messenger. Apakah masih tersedia?",
  },
  {
    name: "Papandayan Backpack",
    slug: "papandayan-backpack",
    category: "Backpack",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Brown",
    size: "25 x 35 x 10",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 6,
    isFeatured: false,
    isAvailable: true,
    shortDescription:
      "Backpack kulit sapi asli dengan karakter hangat dan keseimbangan antara fungsi serta tampilan premium.",
    description:
      "Papandayan Backpack menawarkan ruang yang lebih lega untuk aktivitas yang dinamis tanpa meninggalkan kesan refined. Handmade construction dan material kulit sapi asli membuatnya terasa kuat, nyaman, dan tetap elegan saat digunakan sehari-hari.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Papandayan Backpack. Apakah masih tersedia?",
  },
  {
    name: "Guntur Backpack",
    slug: "guntur-backpack",
    category: "Backpack",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Olive",
    size: "28 x 40 x 10",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 7,
    isFeatured: false,
    isAvailable: true,
    shortDescription:
      "Backpack kulit sapi asli dengan ukuran lebih tinggi, cocok untuk membawa kebutuhan yang lebih lengkap.",
    description:
      "Guntur Backpack dirancang untuk pengguna yang memerlukan kapasitas tambahan dengan gaya yang tetap tenang. Karakter genuine cow leather memberi kesan autentik dan matang, sementara dimensinya mendukung penggunaan harian yang lebih fleksibel.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Guntur Backpack. Apakah masih tersedia?",
  },
  {
    name: "Schatzi",
    slug: "schatzi",
    category: "Handbag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Black",
    size: "23 x 17 x 8",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 8,
    isFeatured: false,
    isAvailable: true,
    shortDescription:
      "Handbag kulit sapi asli dengan ukuran ringkas dan proporsi yang terasa anggun untuk berbagai momen.",
    description:
      "Schatzi membawa kesan elegan yang lebih intim melalui bentuk yang terukur dan material yang matang. Tas ini cocok untuk pelanggan yang mengutamakan keindahan detail, kemudahan dibawa, dan karakter kulit asli yang tetap terasa premium.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Schatzi. Apakah masih tersedia?",
  },
  {
    name: "Panjalu Messenger",
    slug: "panjalu-messenger",
    category: "Messenger Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Cognac",
    size: "28 x 18 x 8",
    priceCurrency: "USD",
    priceAmount: 75,
    priceNote: defaultPriceNote,
    sourcePdfPage: 9,
    isFeatured: false,
    isAvailable: true,
    shortDescription:
      "Messenger bag kulit sapi asli dengan ukuran medium dan nuansa hangat yang mudah dipadukan.",
    description:
      "Panjalu Messenger menghadirkan gaya yang lebih santai namun tetap refined. Bentuknya praktis untuk mobilitas harian, sementara genuine cow leather memberi tekstur alami dan kesan yang semakin indah seiring waktu.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Panjalu Messenger. Apakah masih tersedia?",
  },
  {
    name: "Adler",
    slug: "adler",
    category: "Sling Bag",
    material: "Genuine Cow Leather (Crazy Horse)",
    leatherType: "Genuine Cow Leather (Crazy Horse)",
    color: "Dark Brown",
    size: "25 x 17 x 5",
    priceCurrency: "USD",
    priceAmount: 50,
    priceNote: defaultPriceNote,
    sourcePdfPage: 10,
    isFeatured: false,
    isAvailable: true,
    shortDescription:
      "Sling bag kulit sapi crazy horse dengan karakter kuat dan tampilan kasual yang tetap matang.",
    description:
      "Adler menonjolkan karakter genuine cow leather crazy horse yang lebih ekspresif tanpa kehilangan kesan premium. Ukurannya ringkas, nyaman dibawa, dan cocok untuk pelanggan yang menyukai tekstur alami dengan nuansa yang lebih rugged.",
    whatsAppMessage:
      "Halo Mountain Rose, saya tertarik dengan Adler. Apakah masih tersedia?",
  },
];

export const cataloguePageImageMap = mountainRoseCatalogueProducts.map((product) => ({
  slug: product.slug,
  sourcePdfPage: product.sourcePdfPage,
  outputFileName: `${product.slug}.png`,
}));
