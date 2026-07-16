import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET environment variable is not set. " +
    "Add it to your .env file: SESSION_SECRET=<a long random string>"
  );
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_DURATION_SECONDS = 2 * 60 * 60; // 2 hours

export async function createSession() {
  const session = await new SignJWT({ auth: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // JWT hard-expires after 2 hours
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // maxAge matches JWT expiry (2h). Without this, mobile browsers kill the
    // cookie when switching apps/tabs, causing the admin to appear logged out.
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function verifySession(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    // JWT expired, tampered, or missing — all treated as invalid
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) return null;

  const session = await verifySession(sessionCookie);

  // If JWT is expired/invalid, clean up the stale cookie
  if (!session || session.auth !== true) {
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
