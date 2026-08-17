import { NextResponse } from "next/server";

/**
 * POST /api/auth/clear-session
 * 
 * This Next.js API route runs on the SAME origin as the frontend,
 * so it CAN set/clear cookies that were set by the backend (same domain in dev).
 * 
 * This solves the circular dependency where the backend's /auth/logout
 * requires a valid token to clear cookies — but we're calling it BECAUSE
 * the token already expired.
 */
export async function POST() {
  const response = NextResponse.json({ message: "Session cleared" });

  // Clear all auth cookies by setting them to expired
  // We match every possible combination of attributes the backend may have used
  const cookieNames = ["access_token", "refresh_token", "role", "temp_token", "registration_token"];

  for (const name of cookieNames) {
    // Clear with path=/
    response.cookies.set(name, "", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  }

  return response;
}
