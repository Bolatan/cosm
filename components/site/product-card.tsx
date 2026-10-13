'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/db';
import { formatNaira } from '@/lib/format';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-amber-900 text-amber-50',
  New: 'bg-emerald-800 text-emerald-50',
  Premium: 'bg-primary text-primary-foreground',
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {product.secondary_image_url && (
          <Image
            src={product.secondary_image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {product.badge && (
          <span
            className={cn(
              'absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold',
              badgeColors[product.badge] || 'bg-primary text-primary-foreground'
            )}
          >
            {product.badge}
          </span>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground">
              Sold Out
            </span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md opacity-0 transition-all duration-300 hover:bg-foreground hover:text-background group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
          aria-label="Add to cart"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium leading-tight text-foreground line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-primary">
          {formatNaira(product.price)}
        </p>
      </div>
    </Link>
  );
}
