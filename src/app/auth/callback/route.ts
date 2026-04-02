import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role, is_approved, onboarding_completed")
          .eq("id", user.id)
          .single();

        const role = profile?.role;
        const isApproved = profile?.is_approved ?? false;
        const onboardingCompleted = profile?.onboarding_completed ?? false;

        if (role === "admin") return NextResponse.redirect(`${origin}/admin`);

        if (role && !onboardingCompleted) {
          const dest = role === "recycler" ? "/onboarding/recycler" : "/onboarding/producer";
          return NextResponse.redirect(`${origin}${dest}`);
        }

        if (role && onboardingCompleted && !isApproved) {
          return NextResponse.redirect(`${origin}/pending-approval`);
        }

        if (role === "waste_producer" || role === "both") {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
        if (role === "recycler") {
          return NextResponse.redirect(`${origin}/marketplace`);
        }
      }

      // New Google user — no role yet
      return NextResponse.redirect(`${origin}/role-select`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
