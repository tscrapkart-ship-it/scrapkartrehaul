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
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profile?.role;
        if (role === "admin") return NextResponse.redirect(`${origin}/admin`);
        if (role === "waste_producer") return NextResponse.redirect(`${origin}/dashboard`);
        if (role === "recycler") return NextResponse.redirect(`${origin}/marketplace`);
      }

      // No role yet (new Google user) — send to role selection
      return NextResponse.redirect(`${origin}/role-select`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
