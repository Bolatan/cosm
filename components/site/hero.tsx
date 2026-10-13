'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/60 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div className="flex flex-col items-start gap-6 animate-fade-in-up">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              Premium Beauty &amp; Lifestyle
            </span>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
              Beauty that
              <br />
              <span className="text-primary">celebrates</span> you
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Curated skincare, fragrance, and personal care products designed
              to empower and elevate the natural beauty of people of colour.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/shop">
                  Shop the Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-8">
              <div>
                <p className="font-serif text-3xl font-bold text-primary">100K+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="font-serif text-3xl font-bold text-primary">20+</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="font-serif text-3xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground">Global Stores</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-[3/4]">
            <Image
              src="https://images.pexels.com/photos/29372552/pexels-photo-29372552.jpeg?auto=compress&cs=tinysrgb&h=900&w=700"
              alt="Woman showcasing premium beauty and lifestyle products"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Floating card */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-xl bg-background/90 p-4 backdrop-blur-md">
              <div>
                <p className="text-xs text-muted-foreground">Featured</p>
                <p className="text-sm font-semibold">Azelaic Acid Serum</p>
              </div>
              <Link
                href="/shop/azelaic-acid-serum-30ml"
                className="flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
