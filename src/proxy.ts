import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  // (Assuming you store your auth token in a cookie named 'token')
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Define your auth-only paths
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  // 3. If the user is logged in and tries to access an auth page, redirect to dashboard
  //   if (token && isAuthPage) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }

  return NextResponse.next();
}

// 4. Configure which paths this middleware runs on
export const config = {
  matcher: ["/login", "/signup", "/forgot-password"],
};
