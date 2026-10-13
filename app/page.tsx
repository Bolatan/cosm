'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import { Hero } from '@/components/site/hero';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { CartDrawer } from '@/components/site/cart-drawer';
import { ProductCard } from '@/components/site/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On orders over \u20A650,000',
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    desc: 'Guranteed original products',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    desc: 'Carefully curated selection',
  },
  {
    icon: Heart,
    title: 'Made for You',
    desc: 'Formulated for deeper skin tones',
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <SiteHeader />
      <CartDrawer />

      <main>
        <Hero />

        {/* Features bar */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Our Favorites
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Aesthetic Favorites
              </h2>
            </div>
            <Button asChild variant="link" className="hidden sm:flex">
              <Link href="/shop">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

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
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center sm:hidden">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Category Showcase */}
        <section className="bg-secondary/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Explore
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Shop by Category
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Link
                href="/shop?category=skincare"
                className="group relative aspect-[4/5] overflow-hidden rounded-xl"
              >
                <Image
                  src="https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Skincare"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">Skincare</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Serums, toners &amp; creams
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              <Link
                href="/shop?category=fragrance"
                className="group relative aspect-[4/5] overflow-hidden rounded-xl"
              >
                <Image
                  src="https://images.pexels.com/photos/12456276/pexels-photo-12456276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Fragrance"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">Fragrance</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Signature scents
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              <Link
                href="/shop?category=body-care"
                className="group relative aspect-[4/5] overflow-hidden rounded-xl md:row-span-1"
              >
                <Image
                  src="https://images.pexels.com/photos/39281916/pexels-photo-39281916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Body Care"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">Body Care</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Butters, oils &amp; more
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <Image
                src="https://images.pexels.com/photos/17273209/pexels-photo-17273209.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="DANG Lifestyle founder"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Our Story
              </span>
              <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl text-balance">
                Not just a brand — it&apos;s a movement
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                DANG Lifestyle is a trailblazing e-commerce and retail platform
                committed to empowering women and men of colour by providing a
                curated selection of beauty, skincare, fragrance, and personal
                care products.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Built on the core values of inclusivity, diversity, and
                empowerment, we celebrate and elevate the natural beauty of
                people with deeper skin tones.
              </p>
              <Button asChild variant="outline" size="lg" className="w-fit">
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                Testimonials
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Loved by Thousands
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote:
                    'The Azelaic Acid Serum transformed my skin in just two weeks. My dark spots have faded significantly.',
                  name: 'Amara O.',
                  location: 'Lagos',
                },
                {
                  quote:
                    'I have been searching for skincare that works for my melanin-rich skin. DANG is the answer.',
                  name: 'Chidinma N.',
                  location: 'Abuja',
                },
                {
                  quote:
                    'The Amber Oud perfume is absolutely divine. I get compliments every time I wear it.',
                  name: 'Tunde A.',
                  location: 'London',
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-primary-foreground/10 p-6"
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg
                        key={j}
                        className="h-4 w-4 fill-amber-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-primary-foreground/90">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-primary-foreground/60">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
