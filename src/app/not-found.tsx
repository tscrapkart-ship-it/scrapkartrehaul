import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0A0A0A] px-4 text-center">
      <div className="space-y-6">
        {/* 404 heading with emerald gradient */}
        <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-[#059669] to-[#10B981] bg-clip-text text-transparent tracking-tight">
          404
        </h1>

        <div className="space-y-2">
          <p className="text-xl text-white font-medium">Page not found</p>
          <p className="text-sm text-[#A3A3A3] max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link href="/">
          <Button className="h-11 px-6 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold transition-all duration-300">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
