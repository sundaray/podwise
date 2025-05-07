import { NextRequest, NextResponse } from "next/server";
import { freePodcastPaths } from "@/lib/podcast/free-podcast-paths";
import {
  getPodcastSession,
  createPodcastSession,
  updatePodcastSession,
} from "@/lib/podcast/podcast-session";

export async function handleAuthenticatedFreePodcast(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

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

  if (!podcastSession) {
    // Invalid session - create new
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

  // Check if authentication status changed (was unauthenticated, now authenticated)
  if (podcastSession.isAuthenticated === false) {
    // Check if session needs reset (new day or different IP)
    const sessionDate = new Date(podcastSession.createdAt);
    const today = new Date();
    const isSameDay =
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear();

    if (!isSameDay || podcastSession.ip !== clientIP) {
      // Create fresh session
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

    // Same day, same IP - handle authentication status change
    // Calculate how many summaries they should have left after signing in
    let adjustedCount;

    // If they've already reached or exceeded the unauthenticated limit (count >= 2),
    // set count to 1 so they can read 1 more summary after signing in
    if (podcastSession.count >= 2) {
      adjustedCount = 1;
    } else {
      // They've seen 1 or fewer, preserve their count
      adjustedCount = podcastSession.count;
    }

    // Create a new authenticated session
    await createPodcastSession(clientIP, true);

    // Get the newly created session
    const newSession = await getPodcastSession();

    // Update session with the adjusted count
    const updatedSession = {
      ...newSession,
      count: adjustedCount,
      createdAt: podcastSession.createdAt, // Keep original creation time
    };

    // Apply updates
    const result = await updatePodcastSession(clientIP, updatedSession, true);

    // Authenticated users can view 2 free podcasts
    const limitReached = result.count > 2;

    // Set header on the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-limit-reached", limitReached.toString());

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Regular authenticated session case - continue normally
  // Check if session needs reset (new day or different IP)
  const sessionDate = new Date(podcastSession.createdAt);
  const today = new Date();
  const isSameDay =
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear();

  if (!isSameDay || podcastSession.ip !== clientIP) {
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
