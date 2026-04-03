"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  MessageSquare,
  Search,
  Zap,
  Building2,
  Smartphone,
  Cog,
  Cpu,
  Recycle,
  FileText,
  GlassWater,
  Package,
  Menu,
  X,
  ArrowRight,
  Quote,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 500, suffix: "+", label: "Active Listings" },
  { value: 120, suffix: "+", label: "Verified Companies" },
  { value: 2.4, suffix: "Cr", prefix: "₹", label: "Monthly Transactions" },
  { value: 15, suffix: "+", label: "Cities Covered" },
];

const categories = [
  { name: "Metal", description: "Steel, aluminium, copper, brass, iron scrap", icon: Cog },
  { name: "E-waste", description: "Circuit boards, servers, monitors, electronics", icon: Cpu },
  { name: "Plastic", description: "HDPE, PP, PET, PVC, mixed polymers", icon: Recycle },
  { name: "Paper", description: "OCC cardboard, office paper, newsprint", icon: FileText },
  { name: "Glass", description: "Clear cullet, colored glass, float glass", icon: GlassWater },
  { name: "Mixed Scrap", description: "Unsorted or multi-material industrial waste", icon: Package },
];

const howItWorks = {
  seller: [
    { step: "01", title: "Create your company profile", description: "Set up your business details, industry type, and location." },
    { step: "02", title: "List your scrap materials", description: "Add detailed listings with photos, quantity, price, and category." },
    { step: "03", title: "Receive bookings & chat", description: "Get notified when recyclers book. Chat in real-time to coordinate." },
    { step: "04", title: "Complete the transaction", description: "Confirm pickup, mark as collected, and close the deal." },
  ],
  buyer: [
    { step: "01", title: "Browse the marketplace", description: "Search available scrap by category, location, and price." },
    { step: "02", title: "View details & company info", description: "Check material specifications, images, and seller credentials." },
    { step: "03", title: "Book instantly", description: "Reserve materials with one click. Chat with the seller to finalize." },
    { step: "04", title: "Arrange pickup", description: "Coordinate logistics and collect your booked materials." },
  ],
};

const features = [
  { title: "Verified Listings", description: "Every scrap listing includes detailed specs, images, and seller verification — so you know what you're getting.", icon: ShieldCheck },
  { title: "Real-Time Chat", description: "Negotiate, coordinate logistics, and finalize deals directly within the platform. No phone tag required.", icon: MessageSquare },
  { title: "Category Filters", description: "Find exactly what you need with smart filters for material type, price range, location, and availability.", icon: Search },
  { title: "Instant Booking", description: "Reserve materials with a single click. Scrap gets locked immediately — no more lost deals.", icon: Zap },
  { title: "Company Profiles", description: "Browse detailed company directories. See industry, location, and listing history for every seller.", icon: Building2 },
  { title: "Mobile Ready", description: "Full PWA experience. Install ScrapKart on your phone and manage deals on the go.", icon: Smartphone },
];

const testimonials = [
  { quote: "ScrapKart helped us offload 50 tons of steel scrap in just 2 weeks. The marketplace visibility is unmatched.", author: "Rajesh Sharma", company: "Tata Steel Works, Mumbai" },
  { quote: "As a recycler, I used to spend days finding quality scrap. Now I browse, book, and pickup — all from one dashboard.", author: "Priya Menon", company: "EcoRecycle Solutions, Bangalore" },
  { quote: "The real-time chat feature saved us countless phone calls. We closed a ₹4L deal entirely on the platform.", author: "Amit Gupta", company: "PackRight Industries, Delhi" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useGSAP(
    () => {
      // Hero animations only — these fire immediately on mount, no ScrollTrigger risk
      gsap.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" });
      gsap.from(".hero-title", { y: 40, opacity: 0, duration: 0.8, delay: 0.15, ease: "power3.out" });
      gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.7, delay: 0.3, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, delay: 0.45, ease: "power3.out" });

      // Stat count-up (reads value, never hides the element)
      document.querySelectorAll<HTMLElement>(".stat-number").forEach((el) => {
        const target = parseFloat(el.dataset.value || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            el.textContent = prefix + (target % 1 !== 0 ? obj.val.toFixed(1) : Math.floor(obj.val).toString()) + suffix;
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background">

      {/* ========== NAVBAR ========== */}
      <header className="sticky top-0 z-50 border-b border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logos/ScrapKart White Logo.png"
              alt="ScrapKart"
              width={160}
              height={46}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-2 md:flex">
            {["How It Works", "Categories", "Features", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#A3A3A3] transition-all duration-200 hover:bg-[#1A1A1A] hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button
                variant="ghost"
                className="h-10 px-5 text-sm font-medium text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white rounded-lg"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="h-10 px-5 text-sm font-semibold bg-[#10B981] text-black hover:bg-[#059669] rounded-lg transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-2.5 text-white/70 hover:bg-white/5 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#262626] bg-[#0A0A0A]/98 backdrop-blur-md md:hidden">
            <div className="space-y-1 px-4 py-4">
              {["How It Works", "Categories", "Features", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {item}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-[#262626]">
                <Link href="/login">
                  <Button variant="ghost" className="w-full h-12 text-base text-white/70 hover:bg-white/5 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full h-12 text-base font-semibold bg-brand-accent text-brand-dark hover:bg-brand-light">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/herobg.jpg"
            alt="Hero background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Left-side dark overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/20" />
          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content — left-aligned */}
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
<h1 className="hero-title text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Buy & sell</span>
              <br />
              <span className="text-white">industrial scrap </span>
              <br />
              <span className="text-gradient">smarter.</span>
            </h1>

            <p className="hero-subtitle mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">
              ScrapKart connects waste producers with verified recyclers. List scrap, discover materials, book instantly, and chat in real time — all on one platform.
            </p>

            <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-13 w-full px-8 text-base font-semibold bg-[#10B981] text-black hover:bg-[#059669] transition-all sm:w-auto rounded-xl"
                >
                  Start Selling Scrap
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 w-full px-8 text-base border-[#262626] text-white hover:bg-[#1A1A1A] hover:border-[#404040] sm:w-auto rounded-xl"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#262626] bg-card p-6 sm:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="stat-number text-4xl font-bold text-brand-accent sm:text-5xl"
                  data-value={stat.value}
                  data-prefix={stat.prefix || ""}
                  data-suffix={stat.suffix}
                >
                  0
                </p>
                <p className="mt-2 text-sm font-medium text-white/50 sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="scroll-mt-20 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-white/45 sm:text-xl">
              Whether you&apos;re selling scrap or buying, it takes just 4 steps.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Seller flow */}
            <div className="stagger-parent">
              <div className="mb-8 inline-flex rounded-full bg-brand-accent/10 border border-brand-accent/20 px-5 py-2 text-base font-medium text-brand-accent">
                For Sellers (Waste Producers)
              </div>
              <div className="space-y-7">
                {howItWorks.seller.map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-base font-bold text-brand-accent border border-brand-accent/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-1.5 text-base text-white/45">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer flow */}
            <div className="stagger-parent">
              <div className="mb-8 inline-flex rounded-full bg-brand-secondary/20 border border-brand-secondary/30 px-5 py-2 text-base font-medium text-brand-accent">
                For Buyers (Recyclers)
              </div>
              <div className="space-y-7">
                {howItWorks.buyer.map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/20 text-base font-bold text-brand-accent border border-brand-secondary/30">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-1.5 text-base text-white/45">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section id="categories" className="scroll-mt-20 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Scrap Categories</h2>
            <p className="mt-4 text-lg text-white/45 sm:text-xl">Trade across six major industrial scrap categories.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-card/50 p-6 transition-all duration-300 hover:border-brand-accent/30 hover:bg-card/80 hover:shadow-lg hover:shadow-brand-accent/5 hover:-translate-y-0.5"
                >
                  {/* Subtle bg icon — top-right, large, faint */}
                  <Icon className="absolute -right-3 -top-3 h-24 w-24 text-brand-accent/20 transition-all duration-300 group-hover:text-brand-accent/30" />
                  {/* Left-aligned content */}
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    <p className="mt-1.5 text-base text-white/45">{cat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="scroll-mt-20 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Built for Industrial Scrap Trading
            </h2>
            <p className="mt-4 text-lg text-white/45 sm:text-xl">
              Everything you need to trade scrap efficiently, in one place.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-card/50 p-7 transition-all duration-300 hover:border-brand-accent/20 hover:bg-card/80"
                >
                  {/* Subtle bg icon — centered */}
                  <Icon className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-brand-accent/[0.12] transition-all duration-300 group-hover:text-brand-accent/20" />
                  {/* Center-aligned content */}
                  <div className="relative text-center">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-white/45">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimonials" className="scroll-mt-20 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-4 text-lg text-white/45 sm:text-xl">
              Hear from businesses already trading on ScrapKart.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="rounded-2xl border border-[#262626] bg-card/50 p-7"
              >
                <Quote className="h-9 w-9 text-brand-accent/30" />
                <p className="mt-5 text-base leading-relaxed text-white/65">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent/10 text-base font-bold text-brand-accent">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{t.author}</p>
                    <p className="text-sm text-white/40">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#262626] bg-gradient-to-br from-[#10B981]/5 to-background p-10 text-center sm:p-20">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Ready to trade smarter?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/50 sm:text-xl">
              Join hundreds of businesses already using ScrapKart to buy and sell industrial scrap. Free to get started.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-13 w-full px-8 text-base font-semibold bg-[#10B981] text-black hover:bg-[#059669] transition-all sm:w-auto rounded-xl"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 w-full px-8 text-base border-[#262626] text-white hover:bg-[#1A1A1A] hover:border-[#404040] sm:w-auto rounded-xl"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[#262626] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Image
                src="/logos/ScrapKart White Logo.png"
                alt="ScrapKart"
                width={150}
                height={43}
              />
              <p className="mt-5 text-base text-white/35 leading-relaxed">
                India&apos;s B2B marketplace for industrial scrap trading. Connecting waste producers with recyclers since 2025.
              </p>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-semibold text-white/60 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3.5 text-base text-white/35">
                <li><Link href="/marketplace" className="transition-colors hover:text-brand-accent">Marketplace</Link></li>
                <li><a href="#categories" className="transition-colors hover:text-brand-accent">Categories</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-brand-accent">How It Works</a></li>
                <li><a href="#features" className="transition-colors hover:text-brand-accent">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-semibold text-white/60 uppercase tracking-widest">Get Started</h4>
              <ul className="space-y-3.5 text-base text-white/35">
                <li><Link href="/signup" className="transition-colors hover:text-brand-accent">Create Account</Link></li>
                <li><Link href="/login" className="transition-colors hover:text-brand-accent">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-semibold text-white/60 uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3.5 text-base text-white/35">
                <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0" /> hello@scrapkart.app</li>
                <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0" /> +91 98765 43210</li>
                <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0" /> Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="mt-14 border-t border-[#262626] pt-7 text-center text-sm text-white/25">
            &copy; {new Date().getFullYear()} ScrapKart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
