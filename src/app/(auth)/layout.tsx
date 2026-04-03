import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0A0A0A] border-r border-[#262626] flex-col items-center justify-center px-12">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <Image
            src="/logos/ScrapKart White Logo.png"
            alt="ScrapKart"
            width={220}
            height={62}
            priority
          />
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Industrial Scrap,{" "}
              <span className="text-[#10B981]">Reimagined.</span>
            </h2>
            <p className="text-[#A3A3A3] text-base leading-relaxed">
              The B2B marketplace connecting waste producers with recyclers.
              Turn your industrial scrap into opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - form area */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-[#0A0A0A] px-4 py-12 relative">
        {/* Mobile logo - shown only on small screens */}
        <div className="mb-8 lg:hidden relative z-10">
          <Image
            src="/logos/ScrapKart White Logo.png"
            alt="ScrapKart"
            width={180}
            height={50}
            priority
          />
        </div>

        <div className="w-full max-w-md relative z-10">{children}</div>
      </div>
    </div>
  );
}
