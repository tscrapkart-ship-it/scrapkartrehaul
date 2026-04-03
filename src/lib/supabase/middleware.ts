import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public routes — always accessible
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/auth/callback",
    "/contact",
    "/blogs",
    "/pending-approval",
  ];
  const isPublicRoute =
    publicRoutes.some((route) => path === route) ||
    path.startsWith("/auth/") ||
    path.startsWith("/blogs/");

  // Unauthenticated: redirect to login for protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role, is_approved, onboarding_completed")
      .eq("id", user.id)
      .single();

    // If profile query fails (no row, DB error), treat as no-role user
    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 = no rows — expected for brand-new users
      console.error("Middleware profile query error:", profileError.message);
    }

    const role = profile?.role;
    const isApproved = profile?.is_approved ?? false;
    const onboardingCompleted = profile?.onboarding_completed ?? false;

    // Already authenticated — redirect away from auth/landing pages
    if (path === "/login" || path === "/signup" || path === "/") {
      const url = request.nextUrl.clone();
      if (!role) {
        // Authenticated but no role — always send to role selection
        url.pathname = "/role-select";
        return NextResponse.redirect(url);
      }
      if (role === "admin") url.pathname = "/admin";
      else if (role === "waste_producer" || role === "both") url.pathname = "/dashboard";
      else url.pathname = "/marketplace";
      return NextResponse.redirect(url);
    }

    // Admin: only /admin/* paths
    if (role === "admin") {
      if (!path.startsWith("/admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // Non-admin trying to access /admin — block
    if (path.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // No role yet — must select role first
    if (!role && path !== "/role-select" && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/role-select";
      return NextResponse.redirect(url);
    }

    // Redirect away from /role-select if role already set
    if (role && path === "/role-select") {
      const url = request.nextUrl.clone();
      if (!onboardingCompleted) {
        url.pathname =
          role === "recycler"
            ? "/onboarding/recycler"
            : "/onboarding/producer";
      } else if (role === "waste_producer" || role === "both") {
        url.pathname = "/dashboard";
      } else {
        url.pathname = "/marketplace";
      }
      return NextResponse.redirect(url);
    }

    // Has role but not onboarded — send to onboarding
    if (
      role &&
      !onboardingCompleted &&
      !path.startsWith("/onboarding") &&
      !isPublicRoute
    ) {
      const url = request.nextUrl.clone();
      url.pathname =
        role === "recycler" ? "/onboarding/recycler" : "/onboarding/producer";
      return NextResponse.redirect(url);
    }

    // Redirect away from pending-approval — approval gate removed
    if (path === "/pending-approval") {
      const url = request.nextUrl.clone();
      url.pathname = role === "waste_producer" || role === "both" ? "/dashboard" : "/marketplace";
      return NextResponse.redirect(url);
    }

    // Role-based route protection
    // Recyclers can't access seller dashboard/scraps management
    if (role === "recycler" && (path.startsWith("/dashboard") || path.startsWith("/scraps") || path.startsWith("/company") || path.startsWith("/seller-bookings"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/marketplace";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
