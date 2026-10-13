'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import type { Product } from '@/lib/db';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { CartDrawer } from '@/components/site/cart-drawer';
import { ProductCard } from '@/components/site/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/cart-context';
import { formatNaira } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-amber-900 text-amber-50',
  New: 'bg-emerald-800 text-emerald-50',
  Premium: 'bg-primary text-primary-foreground',
};

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product || null);
          setRelated(data.related || []);
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error('Failed to fetch product detail', e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <CartDrawer />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    notFound();
  }

  const images = [product.image_url, product.secondary_image_url].filter(
    Boolean
  ) as string[];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <SiteHeader />
      <CartDrawer />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              {images[activeImage] && (
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
              {product.badge && (
                <span
                  className={cn(
                    'absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold',
                    badgeColors[product.badge] ||
                      'bg-primary text-primary-foreground'
                  )}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors',
                      activeImage === i
                        ? 'border-primary'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-bold text-primary">
                {formatNaira(product.price)}
              </p>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.in_stock ? (
                <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  In Stock
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  Sold Out
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart — {formatNaira(product.price * quantity)}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Free shipping over &#8358;50K
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  100% authentic
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Easy returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                You May Also Like
              </h2>
              <Link
                href="/shop"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
