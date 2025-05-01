import { NextRequest, NextResponse } from "next/server";
import { freePodcastPaths } from "@/lib/podcast/free-podcast-paths";
import { isPodcastSummaryPage } from "@/lib/middleware/is-podcast-summary-page";
import {
  getPodcastSession,
  createPodcastSession,
  updatePodcastSession,
} from "@/lib/podcast/podcast-session";

export async function handleAuthenticatedFreePodcast(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Only proceed if this is a podcast summary page
  if (!isPodcastSummaryPage(path)) {
    return null;
  }

  // Check if it's a free podcast
  const isFreePostcast = freePodcastPaths.includes(path);
  if (!isFreePostcast) {
    return null;
  }

  // Get client IP address
  const clientIP = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // Get existing session cookie
  const sessionCookie = request.cookies.get("podcast");

  // First visit (no existing session)
  if (!sessionCookie) {
    await createPodcastSession(clientIP, true);

    // Set header on the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-limit-reached", "false");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Subsequent visit (has existing session)
  const podcastSession = await getPodcastSession(sessionCookie.value);

  // Check if session needs reset (new day, different IP, or auth changed)
  const sessionDate = new Date(podcastSession!.createdAt);
  const today = new Date();
  const isSameDay =
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear();

  if (!isSameDay || podcastSession!.ip !== clientIP) {
    // Create session
    await createPodcastSession(clientIP, true);

    // Set header on the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-limit-reached", "false");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Update existing session
  const updatedSession = await updatePodcastSession(
    clientIP,
    podcastSession,
    true,
  );

  // Authenticated users can view 2 free podcasts
  const limitReached = updatedSession.count > 2;

  // Set header on the request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-limit-reached", limitReached.toString());

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
