'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoSlide {
  id: string;
  videoUrl: string;
  poster: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  featuredProduct: {
    name: string;
    tag: string;
    slug: string;
  };
}

const videoSlides: VideoSlide[] = [
  {
    id: 'slide-1',
    videoUrl: 'https://assets.mixkit.co/videos/41584/41584-720.mp4',
    poster: 'https://images.pexels.com/photos/29372552/pexels-photo-29372552.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
    badge: 'Glowing Essentials',
    title: 'Beauty that',
    highlight: 'celebrates',
    description:
      'Curated skincare, fragrance, and personal care products designed to empower and elevate the natural beauty of deeper skin tones.',
    featuredProduct: {
      name: 'Azelaic Acid Serum',
      tag: 'Bestseller',
      slug: '/shop/azelaic-acid-serum-30ml',
    },
  },
  {
    id: 'slide-2',
    videoUrl: 'https://assets.mixkit.co/videos/40130/40130-720.mp4',
    poster: 'https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'Radiant Care',
    title: 'Nourish &',
    highlight: 'illuminate',
    description:
      'Experience deep hydration and botanical radiance with our luxury formulas crafted for everyday self-care.',
    featuredProduct: {
      name: 'Luminous Face Oil',
      tag: 'New Formula',
      slug: '/shop',
    },
  },
  {
    id: 'slide-3',
    videoUrl: 'https://assets.mixkit.co/videos/39767/39767-720.mp4',
    poster: 'https://images.pexels.com/photos/12456276/pexels-photo-12456276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'Signature Scents',
    title: 'Aroma that',
    highlight: 'inspires',
    description:
      'Indulge in rich amber, warm oud, and delicate floral notes formulated to linger elegantly throughout the day.',
    featuredProduct: {
      name: 'Amber Oud Eau de Parfum',
      tag: 'Trending',
      slug: '/shop',
    },
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-slide effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videoSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync video playback with active slide and play state
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === currentIndex) {
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Auto-play was prevented by browser policy
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
      }
    });
  }, [currentIndex, isPlaying]);

  const currentSlide = videoSlides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoSlides.length) % videoSlides.length);
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] lg:min-h-[88vh] flex items-center bg-background border-b border-border/40">
      {/* Background Video Slider */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              playsInline
              muted
              loop
              poster={slide.poster}
              className="h-full w-full object-cover scale-105 transition-transform duration-10000 ease-linear"
            >
              <source src={slide.videoUrl} type="video/mp4" />
            </video>
          </div>
        ))}

        {/* Light Contrast Overlay Layer */}
        {/* Combines a soft light background wash and subtle directional gradient to ensure high readability */}
        <div className="absolute inset-0 z-20 bg-background/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-background/95 via-background/85 to-background/40 md:to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Main Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{currentSlide.badge}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
              {currentSlide.title}{' '}
              <br className="hidden sm:inline" />
              <span className="text-primary italic font-normal underline decoration-primary/30 underline-offset-8">
                {currentSlide.highlight}
              </span>{' '}
              you
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg font-medium">
              {currentSlide.description}
            </p>

            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center pt-2">
              <Button asChild size="lg" className="group shadow-md transition-all duration-300 hover:shadow-lg">
                <Link href="/shop">
                  Shop the Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm border-border hover:bg-background">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-border/60 w-full max-w-md">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">100K+</p>
                <p className="text-xs font-medium text-muted-foreground">Happy Customers</p>
              </div>
              <div className="border-l border-border/60 pl-6">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">20+</p>
                <p className="text-xs font-medium text-muted-foreground">Products</p>
              </div>
              <div className="border-l border-border/60 pl-6">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">5</p>
                <p className="text-xs font-medium text-muted-foreground">Global Stores</p>
              </div>
            </div>
          </div>

          {/* Featured Card / Visual Spotlight Column */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative aspect-[4/5] w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl shadow-2xl border border-border/50 group">
              <Image
                src={currentSlide.poster}
                alt={currentSlide.badge}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Floating Featured Product Badge */}
              <div className="absolute top-4 right-4 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-sm">
                {currentSlide.featuredProduct.tag}
              </div>

              {/* Interactive Product Banner */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl bg-background/95 p-4 backdrop-blur-md border border-border/50 shadow-lg transition-transform duration-300 group-hover:translate-y-[-2px]">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-primary">Featured Product</p>
                  <p className="text-sm font-semibold text-foreground">{currentSlide.featuredProduct.name}</p>
                </div>
                <Link
                  href={currentSlide.featuredProduct.slug}
                  className="flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 shadow-sm"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Video Slider Controls Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {videoSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group flex items-center gap-2 py-2 transition-all ${
                  idx === currentIndex ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-foreground/40'
                  }`}
                />
                <span className="text-xs font-medium text-foreground hidden md:inline">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation & Play/Pause Controls */}
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/60 shadow-sm">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors"
              aria-label={isPlaying ? 'Pause background video slider' : 'Play background video slider'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <div className="h-4 w-px bg-border" />
            <button
              onClick={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
