import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#001C30] flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <Link href="/">
          <Image
            src="/logos/ScrapKart White Logo.png"
            alt="ScrapKart"
            width={130}
            height={36}
            priority
          />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}
