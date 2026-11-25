import { and, asc, desc, eq, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, products, stock } from "@/db/schema";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  categoryId: number;
  priceCents: number;
  image: string;
  alt: string;
  description: string;
  details: string[];
  isNew: boolean;
  stock: number; // units available; 0 = sold out
};

export type Collection = {
  slug: string;
  title: string;
  image: string;
  alt: string;
};

export function unsplash(id: string, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

// Product images are stored as a base URL; the width is chosen at render time.
export const productImage = (url: string, width = 800) =>
  `${url}?auto=format&fit=crop&w=${width}&q=80`;

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);

export const collections: Collection[] = [
  {
    slug: "women",
    title: "Women",
    image: unsplash("1572804013309-59a88b7e92f1", 1000),
    alt: "Woman in a red patterned dress against a warm ochre backdrop",
  },
  {
    slug: "men",
    title: "Men",
    image: unsplash("1594938298603-c8148c4dae35", 1000),
    alt: "Man in a blue checked three-piece suit",
  },
  {
    slug: "outerwear",
    title: "Outerwear",
    image: unsplash("1551028719-00167b16eac5", 1000),
    alt: "Black leather jacket laid on white linen",
  },
  {
    slug: "accessories",
    title: "Accessories",
    image: unsplash("1584917865442-de89df76afd3", 1000),
    alt: "Structured red leather top-handle handbag",
  },
];

const productSelect = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  category: categories.name,
  categoryId: products.categoryId,
  priceCents: products.priceCents,
  image: products.image,
  alt: products.alt,
  description: products.description,
  details: products.details,
  isNew: products.isNew,
  stock: stock.quantity,
};

// Every product has a stock row (the seed creates both); inner joins keep `stock` a number.
const selectProducts = () =>
  db
    .select(productSelect)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(stock, eq(stock.productId, products.id));

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  return selectProducts()
    .where(eq(products.isNew, true))
    .orderBy(desc(products.createdAt), asc(products.id))
    .limit(limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  return selectProducts()
    .where(eq(products.isBestSeller, true))
    .orderBy(asc(products.id))
    .limit(limit);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);
  const [product] = await selectProducts().where(eq(products.slug, slug)).limit(1);
  return product;
}

// Same-category products first, then the rest, excluding the product itself.
export async function getRelatedProducts(
  productId: number,
  categoryId: number,
  count = 4,
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const sameCategory = await selectProducts()
    .where(and(ne(products.id, productId), eq(products.categoryId, categoryId)))
    .orderBy(asc(products.id))
    .limit(count);
  if (sameCategory.length >= count) return sameCategory;
  const others = await selectProducts()
    .where(and(ne(products.id, productId), ne(products.categoryId, categoryId)))
    .orderBy(asc(products.id))
    .limit(count - sameCategory.length);
  return [...sameCategory, ...others];
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((r) => r.slug);
}

const LOW_STOCK_THRESHOLD = 5;

export function stockState(stock: number) {
  if (stock <= 0) return { key: "out", label: "Sold out" } as const;
  if (stock <= LOW_STOCK_THRESHOLD)
    return { key: "low", label: `Only ${stock} left` } as const;
  return { key: "in", label: "In stock" } as const;
}
