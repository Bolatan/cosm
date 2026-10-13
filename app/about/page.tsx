import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { CartDrawer } from '@/components/site/cart-drawer';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <CartDrawer />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                About DANG
              </span>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-balance">
                A movement dedicated to celebrating natural beauty
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                DANG Lifestyle is a trailblazing e-commerce and retail platform
                committed to empowering women and men of colour by providing a
                curated selection of beauty, skincare, fragrance, and personal
                care products.
              </p>
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://images.pexels.com/photos/4077936/pexels-photo-4077936.jpeg?auto=compress&cs=tinysrgb&h=800&w=640"
                alt="Ifedayo Agoro - Founder & CEO"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Meet the Founder
              </span>
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">
                Ifedayo Agoro
              </h2>
              <p className="text-lg font-medium text-muted-foreground">
                Founder &amp; CEO of DANG Lifestyle
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Ifedayo Agoro launched DANG Lifestyle in Nigeria in 2020 as a
                premium home and body care production company. It has since
                expanded into a diverse portfolio of over 20 products with
                stores in the UK, USA, Canada, Ghana, and Kenya.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                She successfully converted DANG community members into loyal
                customers, with over 100,000 customers worldwide in three years
                without a major campaign. With over 16 years of experience
                across oil &amp; gas and creative media, she brings a unique
                blend of business acumen and creative vision to the brand.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                What We Stand For
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Our Core Values
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Inclusivity',
                  desc: 'We believe beauty is for everyone. Our products are formulated with deeper skin tones in mind, ensuring everyone feels seen and catered to.',
                },
                {
                  title: 'Diversity',
                  desc: 'Our product range reflects the diverse needs of our community. From skincare to fragrance, we celebrate the richness of different skin types and preferences.',
                },
                {
                  title: 'Empowerment',
                  desc: 'We are not just a brand — we are a movement. We empower people of colour to embrace and elevate their natural beauty with confidence.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl bg-background p-8 shadow-sm"
                >
                  <h3 className="font-serif text-2xl font-bold">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
              {[
                { value: '100K+', label: 'Customers Worldwide' },
                { value: '20+', label: 'Premium Products' },
                { value: '5', label: 'Physical Stores' },
                { value: '5', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-4xl font-bold sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-primary-foreground/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-balance">
              Ready to discover your new favorites?
            </h2>
            <Button asChild size="lg">
              <Link href="/shop">
                Shop the Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
