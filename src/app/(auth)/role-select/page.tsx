"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Factory, Recycle, Layers2, Check, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

const roles: {
  value: UserRole;
  title: string;
  description: string;
  icon: typeof Factory;
}[] = [
  {
    value: "waste_producer",
    title: "Waste Producer",
    description:
      "I generate industrial scrap. I want to list materials and receive bids from recyclers.",
    icon: Factory,
  },
  {
    value: "recycler",
    title: "Recycler / Aggregator",
    description:
      "I process and recycle scrap. I want to browse listings and place competitive bids.",
    icon: Recycle,
  },
  {
    value: "both",
    title: "Both",
    description:
      "I generate scrap and also process it. I need access to both producer and recycler tools.",
    icon: Layers2,
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated. Please sign in again.");
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || "User",
      role: selected,
      onboarding_completed: false,
      is_approved: false,
    });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    // Redirect to role-specific onboarding
    if (selected === "recycler") {
      router.push("/onboarding/recycler");
    } else {
      // waste_producer and both both start with producer onboarding
      router.push("/onboarding/producer");
    }
    router.refresh();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Choose Your Role
        </h1>
        <p className="text-sm text-white/40">
          This determines your experience and onboarding. You can always contact support to change it.
        </p>
      </motion.div>

      {/* Role cards */}
      <div className="space-y-3">
        {roles.map((role) => {
          const isSelected = selected === role.value;
          const Icon = role.icon;

          return (
            <motion.div key={role.value} variants={itemVariants}>
              <button
                type="button"
                onClick={() => setSelected(role.value)}
                className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? "border-[#64CCC5]/50 bg-[#64CCC5]/[0.06] shadow-lg shadow-[#64CCC5]/5"
                    : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-[#64CCC5]/15 border border-[#64CCC5]/30"
                        : "bg-white/[0.04] border border-white/[0.08]"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors duration-300 ${
                        isSelected ? "text-[#64CCC5]" : "text-white/40"
                      }`}
                    />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <h3 className="font-semibold text-white">{role.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isSelected
                        ? "bg-[#64CCC5] scale-100"
                        : "border border-white/[0.12] scale-90 opacity-40"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="h-3.5 w-3.5 text-[#001C30]" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
        >
          {error}
        </motion.p>
      )}

      <motion.div variants={itemVariants}>
        <Button
          onClick={handleConfirm}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#176B87] to-[#64CCC5] hover:from-[#1a7a99] hover:to-[#72ddd4] text-white font-semibold shadow-lg shadow-[#64CCC5]/10 transition-all duration-300 disabled:opacity-40 disabled:shadow-none"
          disabled={!selected || loading}
        >
          {loading ? (
            "Setting up..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
