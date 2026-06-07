import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Inline the JWT check here — avoids Edge Runtime module resolution issues
const secretKey = process.env.SESSION_SECRET || "default_super_secret_key_change_me_in_prod";
const encodedKey = new TextEncoder().encode(secretKey);

const protectedRoutes = ["/admin"];
const publicRoutes = ["/admin/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute =
    protectedRoutes.some((r) => path.startsWith(r)) &&
    !publicRoutes.includes(path);

  if (!isProtectedRoute) return NextResponse.next();

  const sessionCookie = req.cookies.get("admin_session")?.value;

  try {
    if (!sessionCookie) throw new Error("No session");
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });
    if (!payload.auth) throw new Error("Invalid");
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
