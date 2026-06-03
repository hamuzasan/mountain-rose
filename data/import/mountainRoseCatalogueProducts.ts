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
      "A genuine cow leather clutch and sling bag with a refined silhouette and warm character for an elegant look.",
    description:
      "Sundaland Beauty Rose brings a compact shape with calm feminine elegance. Genuine cow leather gives it natural character, while its proportions suit everyday moments and more special occasions.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Sundaland Beauty Rose. Is it still available?",
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
      "A genuine cow leather sling bag with a light structure and mature look for daily travel.",
    description:
      "Sundaland Beauty Moon is designed to carry essentials in a compact and refined way. Genuine cow leather adds strong texture while keeping the premium impression quiet and balanced.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Sundaland Beauty Moon. Is it still available?",
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
      "A genuine cow leather pouch with practical proportions, warm texture, and elegant character.",
    description:
      "Sundaland Beauty Pouch is made for essential storage that still feels neat when carried. Its shape is simple, while genuine cow leather keeps the look polished and easy to pair with different styles.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Sundaland Beauty Pouch. Is it still available?",
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
      "A genuine cow leather messenger bag with a confident silhouette and enough space for daily use.",
    description:
      "Papandayan Messenger is made for workdays and light travel with a mature impression. Genuine cow leather helps the bag keep its structure while bringing strong natural character.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Papandayan Messenger. Is it still available?",
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
      "A genuine cow leather backpack with warm character and a balanced mix of function and premium style.",
    description:
      "Papandayan Backpack offers more generous space for dynamic days without losing its refined impression. Handmade construction and genuine cow leather make it feel strong, comfortable, and elegant for everyday use.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Papandayan Backpack. Is it still available?",
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
      "A taller genuine cow leather backpack made to carry fuller daily essentials.",
    description:
      "Guntur Backpack is designed for those who need added capacity with a calm sense of style. Genuine cow leather gives it an authentic, mature character, while its dimensions support more flexible daily use.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Guntur Backpack. Is it still available?",
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
      "A compact genuine cow leather handbag with graceful proportions for many occasions.",
    description:
      "Schatzi carries an intimate elegance through measured form and mature material. This bag suits customers who value beautiful details, easy carry, and the premium character of genuine leather.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Schatzi. Is it still available?",
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
      "A medium genuine cow leather messenger bag with warm tones that pair easily with daily style.",
    description:
      "Panjalu Messenger brings a more relaxed style while staying refined. Its shape is practical for daily mobility, while genuine cow leather adds natural texture and a character that grows richer over time.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Panjalu Messenger. Is it still available?",
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
      "A crazy horse cow leather sling bag with strong character and a mature casual look.",
    description:
      "Adler highlights the more expressive character of crazy horse genuine cow leather without losing its premium feel. It is compact, comfortable to carry, and suited to customers who enjoy natural texture with a more rugged mood.",
    whatsAppMessage:
      "Hello Mountain Rose, I am interested in Adler. Is it still available?",
  },
];

export const cataloguePageImageMap = mountainRoseCatalogueProducts.map((product) => ({
  slug: product.slug,
  sourcePdfPage: product.sourcePdfPage,
  outputFileName: `${product.slug}.png`,
}));
