import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#001C30] px-4 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#176B87]/15 blur-[120px]" />

      <div className="relative z-10 space-y-6">
        {/* 404 heading with teal gradient */}
        <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-[#176B87] to-[#64CCC5] bg-clip-text text-transparent tracking-tight">
          404
        </h1>

        <div className="space-y-2">
          <p className="text-xl text-white font-medium">Page not found</p>
          <p className="text-sm text-white/40 max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link href="/">
          <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#176B87] to-[#64CCC5] hover:from-[#1a7a99] hover:to-[#72ddd4] text-white font-semibold shadow-lg shadow-[#64CCC5]/10 transition-all duration-300">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
