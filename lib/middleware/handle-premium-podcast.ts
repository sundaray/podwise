import { NextRequest, NextResponse } from "next/server";
import { freePodcastPaths } from "@/lib/podcast/free-podcast-paths";
import { isPodcastSummaryPage } from "@/lib/middleware/is-podcast-summary-page";
import { getUserSession } from "@/lib/auth/session";

export async function handlePremiumPodcast(
  request: NextRequest,
  isAuthenticated: boolean,
) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Only proceed if this is a podcast summary page
  if (!isPodcastSummaryPage(path)) {
    return null;
  }

  // Check if it's a free podcast
  const isFreePostcast = freePodcastPaths.includes(path);

  // If it's a free podcast, let the other handlers take care of it
  if (isFreePostcast) {
    return null;
  }

  // If it's a premium podcast and user is not authenticated, redirect to signin
  if (!isAuthenticated) {
    const signInUrl = new URL("/signin", nextUrl);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is authenticated, check if they have premium access
  if (isAuthenticated) {
    // Get the full user session to access the premium flags
    const { user } = await getUserSession();

    const hasPremiumAccess =
      user && (user.annualAccessStatus || user.lifetimeAccessStatus);

    // If authenticated but without premium access, redirect to upgrade page
    if (!hasPremiumAccess) {
      const premiumUrl = new URL("/premium", nextUrl);
      return NextResponse.redirect(premiumUrl);
    }

    // If they have premium access, allow access (return null to continue)
  }

  return null;
}
