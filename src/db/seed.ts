import "dotenv/config";
import { db, pool } from "./index";
import { categories, products, stock } from "./schema";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}`;

const categorySeed = [
  { slug: "knitwear", name: "Knitwear" },
  { slug: "outerwear", name: "Outerwear" },
  { slug: "handbags", name: "Handbags" },
  { slug: "shirts", name: "Shirts" },
  { slug: "bags", name: "Bags" },
  { slug: "essentials", name: "Essentials" },
];

const productSeed = [
  {
    slug: "fringed-knit-poncho",
    name: "Fringed Knit Poncho",
    category: "knitwear",
    priceCents: 42000,
    image: photo("1434389677669-e08b4cac3105"),
    alt: "Cream open-knit poncho with fringe on a wooden hanger",
    isNew: true,
    quantity: 12,
    description:
      "An open-knit poncho with a hand-finished fringe hem. Light enough for layering, warm enough to carry from autumn into winter.",
    details: ["100% organic cotton", "Relaxed, one-size fit", "Hand wash cold", "Made in Portugal"],
  },
  {
    slug: "satin-bomber-jacket",
    name: "Satin Bomber Jacket",
    category: "outerwear",
    priceCents: 98000,
    image: photo("1591047139829-d91aecb6caea"),
    alt: "Terracotta bomber jacket on a hanger",
    isNew: true,
    quantity: 8,
    description:
      "A satin-finished bomber in warm terracotta, with ribbed trims and a clean zip front. Cut slightly boxy for easy layering.",
    details: ["Recycled polyamide shell", "Ribbed cuffs and hem", "Side zip pocket", "Made in Italy"],
  },
  {
    slug: "structured-top-handle-bag",
    name: "Structured Top-Handle Bag",
    category: "handbags",
    priceCents: 215000,
    image: photo("1584917865442-de89df76afd3"),
    alt: "Red leather top-handle bag on a plinth",
    isNew: true,
    quantity: 3,
    description:
      "A rigid top-handle bag in polished calf leather with a signature turn-lock closure and a detachable shoulder strap.",
    details: ["Calf leather, suede lining", "Palladium-finish hardware", "24 x 19 x 11 cm", "Made in Italy"],
  },
  {
    slug: "biker-leather-jacket",
    name: "Biker Leather Jacket",
    category: "outerwear",
    priceCents: 289000,
    image: photo("1551028719-00167b16eac5"),
    alt: "Black leather biker jacket",
    isNew: true,
    quantity: 5,
    description:
      "A classic biker jacket in supple lambskin with asymmetric zip, notched lapels and quilted shoulder detailing.",
    details: ["Lambskin leather", "Fully lined in cotton twill", "Asymmetric zip closure", "Made in Italy"],
  },
  {
    slug: "poplin-dress-shirt",
    name: "Poplin Dress Shirt",
    category: "shirts",
    priceCents: 29500,
    image: photo("1603252109303-2751441dd157"),
    alt: "White shirts on wooden hangers on a rail",
    isBestSeller: true,
    quantity: 24,
    description:
      "A crisp poplin shirt with a refined point collar and mother-of-pearl buttons. The foundation of any wardrobe.",
    details: ["100% Egyptian cotton", "Regular fit", "Machine wash 30°", "Made in Portugal"],
  },
  {
    slug: "heavy-cotton-sweatshirt",
    name: "Heavy Cotton Sweatshirt",
    category: "knitwear",
    priceCents: 34000,
    image: photo("1620799140408-edc6dcb6d633"),
    alt: "White crewneck sweatshirt flat lay",
    isBestSeller: true,
    quantity: 15,
    description:
      "A heavyweight crewneck in brushed-back cotton fleece, garment washed for a soft, lived-in hand.",
    details: ["100% organic cotton, 480 gsm", "Relaxed fit", "Machine wash 30°", "Made in Portugal"],
  },
  {
    slug: "everyday-nylon-backpack",
    name: "Everyday Nylon Backpack",
    category: "bags",
    priceCents: 76000,
    image: photo("1553062407-98eeb64c6a62"),
    alt: "Navy nylon backpack standing on a pale floor",
    isBestSeller: true,
    quantity: 0,
    description:
      "A minimal everyday backpack in water-repellent nylon with a padded laptop sleeve and concealed zip pockets.",
    details: ["Recycled nylon", "Fits a 15-inch laptop", "Water-repellent finish", "Made in Italy"],
  },
  {
    slug: "garment-dyed-jersey-tee",
    name: "Garment-Dyed Jersey Tee",
    category: "essentials",
    priceCents: 14000,
    image: photo("1523381210434-271e8be1f52b"),
    alt: "Sage green t-shirts on wooden hangers",
    isBestSeller: true,
    quantity: 40,
    description:
      "A midweight jersey tee, garment-dyed in sage for a soft, faded colour that deepens with every wash.",
    details: ["100% combed cotton", "Regular fit", "Machine wash 30°", "Made in Portugal"],
  },
];

async function main() {
  await db.insert(categories).values(categorySeed).onConflictDoNothing();
  const categoryRows = await db.select().from(categories);
  const categoryId = new Map(categoryRows.map((c) => [c.slug, c.id]));

  for (const { category, quantity, ...p } of productSeed) {
    const values = { ...p, categoryId: categoryId.get(category)! };
    const [row] = await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({ target: products.slug, set: values })
      .returning({ id: products.id });
    await db
      .insert(stock)
      .values({ productId: row.id, quantity })
      .onConflictDoNothing(); // không ghi đè tồn kho đã thay đổi
  }

  console.log(`Seeded ${categoryRows.length} categories, ${productSeed.length} products`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
