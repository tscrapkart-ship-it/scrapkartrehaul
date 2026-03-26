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

    // Redirect authenticated users away from auth pages
    if (path === "/login" || path === "/signup") {
      const url = request.nextUrl.clone();
      url.pathname = role === "waste_producer" ? "/dashboard" : "/marketplace";
      return NextResponse.redirect(url);
    }

    // User needs to select role
    if (!role && path !== "/role-select") {
      const url = request.nextUrl.clone();
      url.pathname = "/role-select";
      return NextResponse.redirect(url);
    }

    // Role-based route protection
    if (role === "recycler" && path.startsWith("/dashboard")) {
      // Seller routes — redirect buyer to marketplace
      const url = request.nextUrl.clone();
      url.pathname = "/marketplace";
      return NextResponse.redirect(url);
    }

    if (role === "waste_producer" && path.startsWith("/marketplace")) {
      // Buyer routes — redirect seller to dashboard
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
