import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/session";

export async function checkPrivateRoutes(request: NextRequest) {
  const privateRoutes = ["/admin"];
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  console.log("checkPrivateRoutes(), path: ", path);

  // Get user session
  const { user } = await getUserSession();

  // Redirect unauthenticated users attempting to access private pages to the sign-in page
  if (
    !user &&
    privateRoutes.some(
      (route) => path === route || path.startsWith(`${route}/`),
    )
  ) {
    const signInUrl = new URL("/signin", nextUrl);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  return null;
}
