"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  RevealOnScroll,
  StaggerGrid,
  StaggerItem,
  AnimatedCounter,
} from "@/components/shared/motion";
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
  CheckCircle2,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

const stats = [
  { value: 500, suffix: "+", label: "Active Listings", icon: Package },
  { value: 120, suffix: "+", label: "Verified Companies", icon: Building2 },
  { value: 2.4, suffix: "Cr", prefix: "₹", label: "Monthly GMV", decimals: 1, icon: TrendingUp },
  { value: 15, suffix: "+", label: "Cities Covered", icon: MapPin },
];

const categories = [
  { name: "Metal", description: "Steel, aluminium, copper, brass, iron scrap", icon: Cog, color: "from-blue-500/10 to-blue-600/5" },
  { name: "E-waste", description: "Circuit boards, servers, monitors, electronics", icon: Cpu, color: "from-purple-500/10 to-purple-600/5" },
  { name: "Plastic", description: "HDPE, PP, PET, PVC, mixed polymers", icon: Recycle, color: "from-yellow-500/10 to-yellow-600/5" },
  { name: "Paper", description: "OCC cardboard, office paper, newsprint", icon: FileText, color: "from-green-500/10 to-green-600/5" },
  { name: "Glass", description: "Clear cullet, colored glass, float glass", icon: GlassWater, color: "from-cyan-500/10 to-cyan-600/5" },
  { name: "Mixed Scrap", description: "Unsorted or multi-material industrial waste", icon: Package, color: "from-gray-500/10 to-gray-600/5" },
];

const howItWorks = [
  { step: "01", title: "Create your profile", description: "Set up your company details and get verified in minutes.", icon: Users },
  { step: "02", title: "List or browse scrap", description: "Sellers list materials with photos and specs. Buyers browse the marketplace.", icon: Search },
  { step: "03", title: "Place bids & negotiate", description: "Buyers submit competitive bids. Sellers accept the best offer.", icon: BarChart3 },
  { step: "04", title: "Close the deal", description: "Coordinate pickup, complete the transaction, and grow your business.", icon: CheckCircle2 },
];

const features = [
  { title: "Verified Listings", description: "Every listing includes detailed specs, images, and seller verification.", icon: ShieldCheck },
  { title: "Real-Time Chat", description: "Negotiate and coordinate logistics directly within the platform.", icon: MessageSquare },
  { title: "Smart Filters", description: "Find exactly what you need by material type, price, and location.", icon: Search },
  { title: "Competitive Bidding", description: "Transparent bidding system ensures fair market prices for everyone.", icon: Zap },
  { title: "Company Profiles", description: "Browse detailed directories with industry, location, and listing history.", icon: Building2 },
  { title: "Mobile Ready", description: "Full PWA experience — manage deals on the go from any device.", icon: Smartphone },
];

const testimonials = [
  { quote: "ScrapKart helped us offload 50 tons of steel scrap in just 2 weeks. The marketplace visibility is unmatched.", author: "Rajesh Sharma", role: "Operations Head", company: "Tata Steel Works, Mumbai" },
  { quote: "As a recycler, I used to spend days finding quality scrap. Now I browse, bid, and pickup — all from one dashboard.", author: "Priya Menon", role: "Founder", company: "EcoRecycle Solutions, Bangalore" },
  { quote: "The real-time chat feature saved us countless phone calls. We closed a ₹4L deal entirely on the platform.", author: "Amit Gupta", role: "Procurement Manager", company: "PackRight Industries, Delhi" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ========== NAVBAR ========== */}
      <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <Image src="/logos/ScrapKart White Logo.png" alt="ScrapKart" width={140} height={40} priority />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {["How It Works", "Categories", "Features", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="rounded-lg px-3.5 py-2 text-base font-medium text-[#737373] transition-all duration-200 hover:bg-[#141414] hover:text-[#F5F5F5]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login">
              <Button variant="ghost" className="h-9 px-4 text-base text-[#A3A3A3] hover:bg-[#141414] hover:text-white rounded-lg">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="h-9 px-4 text-base font-semibold bg-[#10B981] text-black hover:bg-[#059669] rounded-lg">
                Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <button className="rounded-lg p-2 text-[#A3A3A3] hover:bg-[#141414] md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[#1A1A1A] md:hidden"
            >
              <div className="space-y-1 px-4 py-3">
                {["How It Works", "Categories", "Features", "Testimonials"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-base font-medium text-[#A3A3A3] hover:bg-[#141414] hover:text-white">
                    {item}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-3 border-t border-[#1A1A1A]">
                  <Link href="/login"><Button variant="ghost" className="w-full h-10 text-base text-[#A3A3A3]">Sign In</Button></Link>
                  <Link href="/signup"><Button className="w-full h-10 text-base font-semibold bg-[#10B981] text-black">Get Started</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/herobg.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/30" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-4 py-1.5 text-base font-medium text-[#10B981]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              India&apos;s B2B Scrap Marketplace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              <span className="text-[#F5F5F5]">Buy & sell industrial</span>
              <br />
              <span className="text-[#F5F5F5]">scrap </span>
              <span className="text-gradient">smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-[#A3A3A3] sm:text-xl"
            >
              Connect with verified recyclers and waste producers. List scrap, place competitive bids, and close deals — all on one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/signup">
                <Button size="lg" className="h-12 w-full px-6 text-base font-semibold bg-[#10B981] text-black hover:bg-[#059669] rounded-xl sm:w-auto group">
                  Start Trading
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="h-12 w-full px-6 text-base border-[#262626] text-[#D4D4D4] hover:bg-[#141414] hover:border-[#404040] hover:text-white rounded-xl sm:w-auto">
                  Browse Marketplace
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center gap-6 text-base text-[#737373]"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Free to join</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Verified sellers</span>
              <span className="hidden sm:flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Real-time chat</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="relative z-10 -mt-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <RevealOnScroll key={stat.label} delay={i * 0.08}>
                  <div className="rounded-xl border border-[#1A1A1A] bg-[#111111] p-5 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10">
                      <Icon className="h-5 w-5 text-[#10B981]" />
                    </div>
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                      className="text-3xl font-bold text-[#F5F5F5] sm:text-4xl"
                    />
                    <p className="mt-1 text-sm font-medium text-[#737373] sm:text-base">{stat.label}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">How it works</p>
              <h2 className="mt-3 text-4xl font-bold text-[#F5F5F5] sm:text-5xl">Four steps to close a deal</h2>
              <p className="mt-3 text-lg text-[#737373] sm:text-xl">Whether you&apos;re selling scrap or buying, the process is simple.</p>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.step} delay={i * 0.1}>
                  <div className="group relative rounded-xl border border-[#1A1A1A] bg-[#111111] p-6 transition-all duration-300 hover:border-[#10B981]/20 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981] transition-colors group-hover:bg-[#10B981] group-hover:text-black">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="absolute top-5 right-5 text-4xl font-bold text-[#1A1A1A] group-hover:text-[#10B981]/10 transition-colors">{item.step}</span>
                    <h3 className="mt-5 text-lg font-semibold text-[#F5F5F5]">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-[#737373]">{item.description}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section id="categories" className="scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">Categories</p>
              <h2 className="mt-3 text-4xl font-bold text-[#F5F5F5] sm:text-5xl">Trade across six material types</h2>
            </div>
          </RevealOnScroll>

          <StaggerGrid className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <StaggerItem key={cat.name} index={i}>
                  <div className={`group relative overflow-hidden rounded-xl border border-[#1A1A1A] bg-gradient-to-br ${cat.color} p-6 transition-all duration-300 hover:border-[#262626] hover:-translate-y-0.5`}>
                    <Icon className="absolute -right-4 -top-4 h-28 w-28 text-white/[0.03] transition-all duration-500 group-hover:text-white/[0.06] group-hover:scale-110" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#262626] bg-[#0A0A0A]">
                        <Icon className="h-5 w-5 text-[#10B981]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#F5F5F5]">{cat.name}</h3>
                        <p className="mt-1 text-base text-[#737373]">{cat.description}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">Features</p>
              <h2 className="mt-3 text-4xl font-bold text-[#F5F5F5] sm:text-5xl">Built for industrial scrap trading</h2>
              <p className="mt-3 text-lg text-[#737373] sm:text-xl">Everything you need to trade efficiently, in one place.</p>
            </div>
          </RevealOnScroll>

          <StaggerGrid className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title} index={i}>
                  <div className="group rounded-xl border border-[#1A1A1A] bg-[#111111] p-6 transition-all duration-300 hover:border-[#10B981]/15">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981] transition-colors group-hover:bg-[#10B981] group-hover:text-black">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#F5F5F5]">{feature.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-[#737373]">{feature.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimonials" className="scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">Testimonials</p>
              <h2 className="mt-3 text-4xl font-bold text-[#F5F5F5] sm:text-5xl">Trusted by industry leaders</h2>
            </div>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <RevealOnScroll key={t.author} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-xl border border-[#1A1A1A] bg-[#111111] p-6">
                  <Quote className="h-8 w-8 text-[#10B981]/20" />
                  <p className="mt-4 flex-1 text-base leading-relaxed text-[#D4D4D4]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#1A1A1A] pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] text-sm font-bold text-black">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#F5F5F5]">{t.author}</p>
                      <p className="text-sm text-[#737373]">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#111111] px-6 py-16 text-center sm:px-16 sm:py-24">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#10B981_0%,_transparent_50%)] opacity-[0.04]" />

              <div className="relative">
                <h2 className="text-4xl font-bold text-[#F5F5F5] sm:text-5xl">Ready to trade smarter?</h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-[#737373]">
                  Join hundreds of businesses already using ScrapKart to buy and sell industrial scrap.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="h-12 w-full px-6 text-base font-semibold bg-[#10B981] text-black hover:bg-[#059669] rounded-xl sm:w-auto group">
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button size="lg" variant="outline" className="h-12 w-full px-6 text-base border-[#262626] text-[#D4D4D4] hover:bg-[#1A1A1A] hover:text-white rounded-xl sm:w-auto">
                      Explore Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[#1A1A1A] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Image src="/logos/ScrapKart White Logo.png" alt="ScrapKart" width={130} height={37} />
              <p className="mt-4 text-base leading-relaxed text-[#525252]">
                India&apos;s B2B marketplace for industrial scrap trading. Connecting waste producers with recyclers.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#525252]">Platform</h4>
              <ul className="space-y-2.5 text-base text-[#737373]">
                <li><Link href="/marketplace" className="transition-colors hover:text-[#10B981]">Marketplace</Link></li>
                <li><a href="#categories" className="transition-colors hover:text-[#10B981]">Categories</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-[#10B981]">How It Works</a></li>
                <li><a href="#features" className="transition-colors hover:text-[#10B981]">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#525252]">Get Started</h4>
              <ul className="space-y-2.5 text-base text-[#737373]">
                <li><Link href="/signup" className="transition-colors hover:text-[#10B981]">Create Account</Link></li>
                <li><Link href="/login" className="transition-colors hover:text-[#10B981]">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#525252]">Contact</h4>
              <ul className="space-y-2.5 text-base text-[#737373]">
                <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /> hello@scrapkart.app</li>
                <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-[#1A1A1A] pt-6 text-center text-sm text-[#404040]">
            &copy; {new Date().getFullYear()} ScrapKart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
