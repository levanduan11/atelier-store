import Image from "next/image";
import Link from "next/link";
import { formatPrice, productImage, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block bg-paper pb-6">
      <div className="frame-product relative">
        <Image
          src={productImage(product.image)}
          alt={product.alt}
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
        />
        {product.isNew && (
          <span className="text-eyebrow bg-paper absolute left-3 top-3 px-2 py-1">
            New
          </span>
        )}
      </div>
      <div className="px-3 pt-3">
        <p className="text-eyebrow">{product.name}</p>
        <p className="text-muted mt-1">{product.category}</p>
        <p className="mt-1">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
