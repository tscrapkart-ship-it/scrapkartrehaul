import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#001C30] flex-col items-center justify-center px-12">
        {/* Abstract gradient blobs */}
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#176B87]/30 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#64CCC5]/20 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] h-[250px] w-[250px] rounded-full bg-[#176B87]/15 blur-[80px]" />

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
              <span className="text-[#64CCC5]">Reimagined.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              The B2B marketplace connecting waste producers with recyclers.
              Turn your industrial scrap into opportunity.
            </p>
          </div>

          {/* Decorative dots grid */}
          <div className="grid grid-cols-5 gap-3 mt-8 opacity-20">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#64CCC5]"
              />
            ))}
          </div>
        </div>

        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#64CCC5]/30 to-transparent" />
      </div>

      {/* Right side - form area */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-[#001C30] px-4 py-12 relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001C30] via-[#001C30] to-[#0a2a3f]" />

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
