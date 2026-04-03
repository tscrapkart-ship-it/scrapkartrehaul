import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center">
      <div className="animate-fade-in relative max-w-md w-full space-y-8">
        {/* Large 404 background decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -top-16" aria-hidden="true">
          <span className="text-[12rem] sm:text-[16rem] font-bold text-[#10B981]/10 leading-none tracking-tighter">
            404
          </span>
        </div>

        {/* Content on top */}
        <div className="relative z-10 space-y-8">
          {/* Error icon */}
          <div className="animate-slide-up delay-1 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#262626] bg-[#141414]">
            <AlertCircle className="h-9 w-9 text-[#10B981]" />
          </div>

          {/* Text */}
          <div className="animate-slide-up delay-2 space-y-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Page not found
            </h1>
            <p className="text-sm text-[#737373] max-w-xs mx-auto leading-relaxed">
              The page you are looking for does not exist or has been moved to a different location.
            </p>
          </div>

          {/* Button */}
          <div className="animate-slide-up delay-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#10B981] text-black font-semibold text-sm transition-all duration-300 hover:bg-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Subtle divider + help link */}
          <div className="animate-slide-up delay-4 pt-4">
            <div className="h-px w-16 mx-auto bg-[#262626] mb-4" />
            <p className="text-xs text-[#525252]">
              Need help?{" "}
              <Link href="/contact" className="text-[#10B981] hover:text-[#34D399] transition-colors">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
