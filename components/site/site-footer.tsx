import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Skincare', href: '/shop?category=skincare' },
    { label: 'Fragrance', href: '/shop?category=fragrance' },
    { label: 'Body Care', href: '/shop?category=body-care' },
  ],
  Company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Stockists', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Contact', href: '/about' },
  ],
  Support: [
    { label: 'Shipping & Returns', href: '/about' },
    { label: 'Track Your Order', href: '/about' },
    { label: 'FAQ', href: '/about' },
    { label: 'Privacy Policy', href: '/about' },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <h3 className="font-serif text-3xl font-medium sm:text-4xl">
              Join the DANG Community
            </h3>
            <p className="max-w-md text-sm text-primary-foreground/70">
              Get exclusive offers, early access to new products, and skincare
              tips delivered to your inbox.
            </p>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-12 w-full rounded-md border border-primary-foreground/25 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
              />
              <button
                type="submit"
                className="h-12 whitespace-nowrap rounded-md bg-primary-foreground px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold">
              DANG
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70">
              A premium beauty and lifestyle brand empowering people of colour
              through curated skincare, fragrance, and personal care.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
                {title}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 sm:flex-row">
          <p className="text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} DANG Lifestyle. All rights
            reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Lagos &bull; London &bull; New York
          </p>
        </div>
      </div>
    </footer>
  );
}
