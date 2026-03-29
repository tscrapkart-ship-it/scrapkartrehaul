"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEmailSent(true);
  }

  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl text-center space-y-6">
          {/* Animated mail icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#64CCC5]/10 border border-[#64CCC5]/20"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Mail className="h-10 w-10 text-[#64CCC5]" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              We sent a confirmation link to{" "}
              <span className="font-medium text-[#64CCC5]">{email}</span>.
              Click the link to verify your account and choose your role.
            </p>
            <p className="text-xs text-white/25">
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setEmailSent(false)}
            >
              Back to Sign Up
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signup-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#64CCC5]/10 border border-[#64CCC5]/20">
              <UserPlus className="h-6 w-6 text-[#64CCC5]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-white/40">
              Join ScrapKart and start trading
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/60 text-sm">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus:border-[#64CCC5]/50 focus:ring-1 focus:ring-[#64CCC5]/30 focus-visible:ring-[#64CCC5]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/60 text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus:border-[#64CCC5]/50 focus:ring-1 focus:ring-[#64CCC5]/30 focus-visible:ring-[#64CCC5]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/60 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus:border-[#64CCC5]/50 focus:ring-1 focus:ring-[#64CCC5]/30 focus-visible:ring-[#64CCC5]/30 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#176B87] to-[#64CCC5] hover:from-[#1a7a99] hover:to-[#72ddd4] text-white font-semibold shadow-lg shadow-[#64CCC5]/10 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-xs text-white/25">or</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <GoogleAuthButton label="Sign up with Google" />
          </div>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#64CCC5] hover:text-[#72ddd4] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
