import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/session";

export async function checkAuthRoutes(request: NextRequest) {
  const authRoutes = [
    "/signin",
    "/forgot-password",
    "/reset-password",
    "/reset-password/success",
    "/forgot-password/error",
    "/forgot-password/check-email",
    "/signup",
    "/signup/verify-email",
    "/signup/verify-email/error",
    "/signup/email-verified",
  ];
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Get user session
  const { user } = await getUserSession();

  // Redirect authenticated users attempting to access auth pages to the home page
  if (
    user &&
    authRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  ) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return null;
}
