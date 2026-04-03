import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[#262626] px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logos/ScrapKart White Logo.png"
            alt="ScrapKart"
            width={130}
            height={36}
            priority
          />
          <span className="hidden sm:inline-block h-5 w-px bg-[#262626]" />
          <span className="hidden sm:inline-block text-xs font-medium uppercase tracking-widest text-[#525252] group-hover:text-[#737373] transition-colors">
            Onboarding
          </span>
        </Link>
      </header>

      {/* Subtle grid background */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 bg-grid-pattern">
        <div className="w-full max-w-xl animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
