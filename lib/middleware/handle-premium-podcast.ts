import { NextRequest, NextResponse } from "next/server";
import { premiumPodcastPaths } from "@/lib/podcast/premium-podcast-paths";
import { getUserSession } from "@/lib/auth/session";

export async function handlePremiumPodcast(
  request: NextRequest,
  isAuthenticated: boolean,
) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Check if it's a premium podcast
  const isPremiumPodcast = premiumPodcastPaths.includes(path);
  if (!isPremiumPodcast) {
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
  }

  return null;
}
