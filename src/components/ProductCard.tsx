"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-surface-light border border-border transition-all duration-300 group-hover:border-gold/30 group-hover:shadow-lg group-hover:shadow-gold/5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.discount && (
            <span className="absolute left-3 top-3 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold text-white">
              -{product.discount}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-foreground truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gold">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-success">
            {product.stock} In Stock
          </p>
        </div>
      </div>
    </Link>
  );
}
