import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ───────────────────────────────────────────────────────────────────────────
// Auth middleware (canonical @supabase/ssr pattern).
//
// Responsibilities:
//   1. Refresh the Supabase session on every request so server components
//      see fresh cookies without each one re-fetching.
//   2. Redirect unauthenticated users away from protected routes to /login
//      (preserving the original path in ?next=).
//   3. Bounce already-signed-in users from /login and /register to
//      /dashboard so the auth pages aren't dead-ends.
//
// Public paths (PUBLIC_PATHS) match an exact route or a route prefix, e.g.
// "/login" matches "/login" and "/login/forgot". Static assets are excluded
// at the matcher level below; this function only runs on real navigations.
// ───────────────────────────────────────────────────────────────────────────

const PUBLIC_PATHS = ["/login", "/register", "/auth"];

const AUTH_PATHS = ["/login", "/register"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars aren't wired yet (e.g. local dev before .env.local exists),
  // skip auth checks rather than 500 every request.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Touch the session so refresh tokens roll forward on the response.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
