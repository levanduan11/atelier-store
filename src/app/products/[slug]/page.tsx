import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/home/ProductCard";
import { AddToBag } from "@/components/product/AddToBag";
import {
  formatPrice,
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
  productImage,
  stockState,
} from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} | Atelier Store`, description: product.description };
}

const stockStyles = {
  in: "bg-ink",
  low: "bg-danger",
  out: "bg-disabled",
} as const;

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const stock = stockState(product.stock);
  const related = await getRelatedProducts(product.id, product.categoryId);

  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        <nav aria-label="Breadcrumb" className="container-page text-fine py-4">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="link">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li>{product.category}</li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <section className="container-page grid gap-8 pb-(--spacing-section) lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_30rem]">
          {/* Imagery: one large lead image, then a close-up crop */}
          <div className="grid grid-cols-2 gap-1">
            <div className="frame-product relative col-span-2 aspect-4/5 sm:aspect-square lg:aspect-4/5">
              <Image
                src={productImage(product.image, 1600)}
                alt={product.alt}
                fill
                preload
                sizes="(min-width: 64rem) 60vw, 100vw"
                className="object-cover"
              />
              {product.isNew && (
                <span className="text-eyebrow bg-paper absolute left-4 top-4 px-2 py-1">
                  New
                </span>
              )}
            </div>
            <div className="frame-product relative">
              <Image
                src={productImage(product.image, 1600)}
                alt={`${product.name}, close-up detail`}
                fill
                sizes="(min-width: 64rem) 30vw, 50vw"
                className="origin-[30%_35%] scale-[2] object-cover"
              />
            </div>
            <div className="frame-product relative">
              <Image
                src={productImage(product.image, 1600)}
                alt={`${product.name}, alternate close-up detail`}
                fill
                sizes="(min-width: 64rem) 30vw, 50vw"
                className="origin-[75%_70%] scale-[2] object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="text-eyebrow text-muted">{product.category}</p>
            <h1 className="text-display mt-2">{product.name}</h1>
            <p className="mt-4 text-lg">{formatPrice(product.priceCents)}</p>

            <p
              className="text-eyebrow mt-4 flex items-center gap-2"
              role="status"
            >
              <span
                aria-hidden
                className={`size-2 rounded-pill ${stockStyles[stock.key]}`}
              />
              {stock.label}
            </p>

            <div className="mt-8">
              <AddToBag soldOut={stock.key === "out"} />
            </div>

            <p className="rule mt-8 pt-6">{product.description}</p>

            <h2 className="text-eyebrow mt-8">Details</h2>
            <ul className="mt-3 list-inside list-disc space-y-1">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <ul className="text-muted rule mt-8 space-y-2 pt-6">
              <li>Free returns within 30 days</li>
              <li>Signature gift wrapping available</li>
            </ul>
          </div>
        </section>

        <section className="rule container-page section">
          <h2 className="text-heading mb-8">You may also like</h2>
          <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
