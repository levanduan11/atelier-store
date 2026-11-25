import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/home/ProductCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { collections, getBestSellers, getNewArrivals, unsplash } from "@/lib/catalog";

const services = [
  ["Complimentary shipping", "On all orders over $250"],
  ["Free returns", "Within 30 days of delivery"],
  ["Gift wrapping", "Signature packaging on request"],
  ["Book an appointment", "Private styling in boutique or online"],
];

export default async function Home() {
  const [newArrivals, bestSellers] = await Promise.all([
    getNewArrivals(),
    getBestSellers(),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="hero flex items-end bg-ink text-paper">
          <Image
            src={unsplash("1539109136881-3be0616acf4b", 2000)}
            alt="Woman in a powder-blue coat in front of Milan's cathedral"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-ink/50" />
          <div className="container-page relative pb-12 md:pb-20">
            <p className="text-eyebrow">Autumn / Winter 2026</p>
            <h1 className="text-display mt-2 max-w-3xl">The Milan Collection</h1>
            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <Link href="/women" className="btn btn-on-image btn-block">
                Shop women
              </Link>
              <Link href="/men" className="btn btn-on-image btn-block">
                Shop men
              </Link>
            </div>
          </div>
        </section>

        {/* Featured collections */}
        <section className="section container-page">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-heading">Featured collections</h2>
            <Link href="/collections" className="link-nav">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c, i) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group relative block aspect-4/5 overflow-hidden bg-smoke"
              >
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                  <p className="text-eyebrow">0{i + 1}</p>
                  <h3 className="text-lg uppercase">{c.title}</h3>
                  <span className="link-nav mt-2 inline-block underline">Discover</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New arrivals */}
        <section className="pb-(--spacing-section)">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-heading">New arrivals</h2>
              <Link href="/new" className="link-nav">
                Shop all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Editorial split */}
        <section className="grid md:grid-cols-2">
          <div className="relative aspect-4/5 md:aspect-auto md:min-h-[44rem]">
            <Image
              src={unsplash("1496747611176-843222e1e57c", 1400)}
              alt="Woman in a floral wrap dress by the sea"
              fill
              sizes="(min-width: 48rem) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="bg-smoke flex flex-col justify-center gap-5 px-(--spacing-gutter) py-16 md:px-16 lg:px-24">
            <p className="text-eyebrow text-muted">The Atelier Edit</p>
            <h2 className="text-display">Summer, held over</h2>
            <p className="max-w-md">
              Light florals and washed silks designed to carry the warmth of the
              coast into the colder months, layered under tailoring or worn on
              their own.
            </p>
            <Link href="/edit" className="btn btn-secondary btn-block self-start">
              Explore the edit
            </Link>
          </div>
        </section>

        {/* Best sellers */}
        <section className="section container-page">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-heading">Best sellers</h2>
            <Link href="/bestsellers" className="link-nav">
              Shop all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Full-bleed craft banner */}
        <section className="relative flex min-h-[32rem] items-center text-paper md:min-h-[40rem]">
          <Image
            src={unsplash("1445205170230-053b83016050", 2000)}
            alt="A rail of tailored garments in warm light"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="container-page relative">
            <p className="text-eyebrow">Craftsmanship</p>
            <h2 className="text-display mt-2 max-w-2xl">Made to be worn for decades</h2>
            <Link href="/craftsmanship" className="btn btn-on-image btn-block mt-6">
              Our story
            </Link>
          </div>
        </section>

        {/* Services */}
        <section className="container-page section">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([title, body]) => (
              <li key={title} className="rule pt-4">
                <h3 className="text-eyebrow">{title}</h3>
                <p className="text-muted mt-1">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Newsletter */}
        <section className="bg-smoke section">
          <div className="container-content grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <h2 className="text-display">Stay in the loop</h2>
              <p className="text-muted mt-3 max-w-md">
                First access to new collections, private events and the Atelier journal.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
