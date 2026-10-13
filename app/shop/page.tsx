'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product, Category } from '@/lib/db';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { CartDrawer } from '@/components/site/cart-drawer';
import { ProductCard } from '@/components/site/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Alphabetical' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);

        const catData = catRes.ok ? await catRes.json() : [];
        const prodData = prodRes.ok ? await prodRes.json() : [];

        setCategories(catData || []);
        setProducts(prodData || []);
      } catch (e) {
        console.error('Failed to fetch shop data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  let filtered = products;
  if (selectedCategory !== 'all') {
    const cat = categories.find((c) => c.slug === selectedCategory);
    if (cat) {
      filtered = products.filter((p) => p.category_id === cat.id);
    }
  }

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const pageTitle = activeCategory
    ? activeCategory.name
    : 'All Products';
  const pageDescription = activeCategory?.description || null;

  return (
    <>
      <SiteHeader />
      <CartDrawer />

      <main className="min-h-screen">
        {/* Page Header */}
        <div className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <nav className="mb-2 text-xs text-muted-foreground">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">{pageTitle}</span>
            </nav>
            <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {pageDescription}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Category filter & sort */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <a
                href="/shop"
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background hover:bg-accent'
                )}
              >
                All
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    selectedCategory === cat.slug
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background hover:bg-accent'
                  )}
                >
                  {cat.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${filtered.length} products`}
          </p>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try a different category or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Skeleton className="h-8 w-32" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
