"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Factory, Recycle, Check, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

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

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || "User",
      role: selected,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(selected === "waste_producer" ? "/dashboard" : "/marketplace");
    router.refresh();
  }

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
        "I have industrial scrap to sell. I want to list materials and connect with recyclers.",
      icon: Factory,
    },
    {
      value: "recycler",
      title: "Recycler",
      description:
        "I buy and recycle scrap materials. I want to browse listings and book pickups.",
      icon: Recycle,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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
          Select how you&apos;ll use ScrapKart. This determines your experience.
        </p>
      </motion.div>

      {/* Role cards */}
      <div className="space-y-4">
        {roles.map((role) => {
          const isSelected = selected === role.value;
          const Icon = role.icon;

          return (
            <motion.div key={role.value} variants={itemVariants}>
              <button
                type="button"
                onClick={() => setSelected(role.value)}
                className={`w-full text-left rounded-2xl border p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-[#64CCC5]/50 bg-[#64CCC5]/[0.06] shadow-lg shadow-[#64CCC5]/5"
                    : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-[#64CCC5]/15 border border-[#64CCC5]/30"
                        : "bg-white/[0.04] border border-white/[0.08]"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 transition-colors duration-300 ${
                        isSelected ? "text-[#64CCC5]" : "text-white/40"
                      }`}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-white">{role.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Checkmark */}
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

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
        >
          {error}
        </motion.p>
      )}

      {/* Continue button */}
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
