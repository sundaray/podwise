import { NextRequest, NextResponse } from "next/server";
import { freePodcastPaths } from "@/lib/podcast/free-podcast-paths";
import { isPodcastSummaryPage } from "@/lib/middleware/is-podcast-summary-page";

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

  // If it's not a free podcast and user is not authenticated, redirect to signin
  if (!isFreePostcast && !isAuthenticated) {
    const signInUrl = new URL("/signin", nextUrl);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  return null;
}
