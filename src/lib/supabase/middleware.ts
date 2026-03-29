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

  // Public routes that don't require auth
  const publicRoutes = ["/", "/login", "/signup", "/auth/callback"];
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith("/auth/")
  );

  // If not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If authenticated, check role-based routing
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // Redirect authenticated users away from auth pages and landing page
    if (path === "/login" || path === "/signup" || path === "/") {
      if (!role) return supabaseResponse; // no role yet — let them see the page
      const url = request.nextUrl.clone();
      if (role === "admin") url.pathname = "/admin";
      else if (role === "waste_producer") url.pathname = "/dashboard";
      else url.pathname = "/marketplace";
      return NextResponse.redirect(url);
    }

    // Admin: lock to /admin/* only
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

    // User needs to select role — but don't interrupt public pages like the landing page
    if (!role && path !== "/role-select" && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/role-select";
      return NextResponse.redirect(url);
    }

    // Role-based route protection
    if (role === "recycler" && path.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/marketplace";
      return NextResponse.redirect(url);
    }

    if (role === "waste_producer" && path.startsWith("/marketplace")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Redirect from role-select if already has role
    if (role && path === "/role-select") {
      const url = request.nextUrl.clone();
      url.pathname = role === "waste_producer" ? "/dashboard" : "/marketplace";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
