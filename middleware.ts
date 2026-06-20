import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Middleware runs on Edge — read secret directly from env (no module-level throw on Edge)
const secretKey = process.env.SESSION_SECRET ?? "";
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
