// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/session";
import { checkPrivateRoutes } from "@/lib/middleware/check-private-routes";
import { checkAuthRoutes } from "@/lib/middleware/check-auth-routes";
import { handlePremiumPodcast } from "@/lib/middleware/handle-premium-podcast";
import { handleUnauthenticatedFreePodcast } from "@/lib/middleware/handle-unauthenticated-free-podcast";
import { handleAuthenticatedFreePodcast } from "@/lib/middleware/handle-authenticated-free-podcast";
// import { updateAuthSession } from "@/lib/middleware/update-auth-session";

export async function middleware(request: NextRequest) {
  // Get user session
  const { user } = await getUserSession();
  const isAuthenticated = !!user;

  // Check private routes (admin pages)
  const privateRoutesResponse = await checkPrivateRoutes(request);
  if (privateRoutesResponse) return privateRoutesResponse;

  // Check auth routes (signin, forgot password)
  const authRoutesResponse = await checkAuthRoutes(request);
  if (authRoutesResponse) return authRoutesResponse;

  // Handle premium podcasts for unauthenticated users
  const premiumPodcastResponse = await handlePremiumPodcast(
    request,
    isAuthenticated,
  );
  if (premiumPodcastResponse) return premiumPodcastResponse;

  // Handle free podcasts based on authentication status
  if (isAuthenticated) {
    const authFreePodcastResponse =
      await handleAuthenticatedFreePodcast(request);
    if (authFreePodcastResponse) return authFreePodcastResponse;
  } else {
    const unauthFreePodcastResponse =
      await handleUnauthenticatedFreePodcast(request);
    if (unauthFreePodcastResponse) return unauthFreePodcastResponse;
  }

  // Update auth session on GET requests
  // const sessionUpdateResponse = await updateAuthSession(request);
  // if (sessionUpdateResponse) return sessionUpdateResponse;

  // Default response
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
