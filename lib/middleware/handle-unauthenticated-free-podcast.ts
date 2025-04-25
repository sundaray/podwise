// lib/middleware/handle-unauthenticated-free-podcast.ts
import { NextRequest, NextResponse } from "next/server";
import { freePostcastPaths } from "@/lib/podcast/free-podcast-paths";
import { isPodcastSummaryPage } from "@/lib/middleware/is-podcast-summary-page";
import {
  getPodcastSession,
  createPodcastSession,
  updatePodcastSession,
} from "@/lib/podcast/podcast-session";

export async function handleUnauthenticatedFreePodcast(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Only proceed if this is a podcast summary page
  if (!isPodcastSummaryPage(path)) {
    return null;
  }

  // Check if it's a free podcast
  const isFreePostcast = freePostcastPaths.includes(path);
  if (!isFreePostcast) {
    return null;
  }

  // Get client IP address
  const clientIP = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // Get existing session cookie
  const sessionCookie = request.cookies.get("podcast");

  // First visit (no existing session)
  if (!sessionCookie) {
    await createPodcastSession(clientIP, false);

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

  if (!podcastSession) {
    // Invalid session - create new
    await createPodcastSession(clientIP, false);

    // Set header on the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-limit-reached", "false");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check if session needs reset (new day or different IP)
  const sessionDate = new Date(podcastSession.createdAt);
  const today = new Date();
  const isSameDay =
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear();

  if (!isSameDay || podcastSession.ip !== clientIP) {
    // Create session
    await createPodcastSession(clientIP, false);

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
    false,
  );

  // Unauthenticated users can view 1 free podcast
  const limitReached = updatedSession.count > 1;

  // Set header on the request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-limit-reached", limitReached.toString());

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
