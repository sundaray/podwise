import "server-only";

import { cookies } from "next/headers";
import { base64url, jwtVerify, SignJWT } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY!;
const secret = base64url.decode(key);

// Create a podcast summary session
export async function createPodcastSession(
  clientIP: string,
  isAuthenticated: boolean,
) {
  const sessionData = await new SignJWT({
    ip: clientIP,
    count: 1,
    createdAt: Date.now(),
    isAuthenticated: isAuthenticated, // Track if user is authenticated
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d") // Expires in 1 day
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set({
    name: "podcast",
    value: sessionData,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    sameSite: "lax",
    path: "/",
  });

  return { count: 1, isAuthenticated };
}

// Get the podcast summary session
export async function getPodcastSession(cookieValue?: string) {
  if (!cookieValue) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("podcast");

    if (!sessionCookie) {
      return null;
    }

    cookieValue = sessionCookie.value;
  }

  try {
    const { payload } = await jwtVerify(cookieValue, secret, {
      algorithms: ["HS256"],
    });
    return payload as {
      ip: string;
      count: number;
      createdAt: number;
      isAuthenticated: boolean;
    };
  } catch (error) {
    // If the session is invalid or expired, return null
    return null;
  }
}

// Update the podcast summary session
export async function updatePodcastSession(
  clientIP: string,
  currentSession: any,
  isAuthenticated: boolean,
) {
  const cookieStore = await cookies();

  // Check if it's a new day or a new IP (only reset for these reasons)
  const sessionDate = new Date(currentSession.createdAt);
  const today = new Date();

  const isSameDay =
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear();

  // If it's a new day or new IP, create a new session
  if (!isSameDay || currentSession.ip !== clientIP) {
    return createPodcastSession(clientIP, isAuthenticated);
  }

  // It's the same day and IP, update the existing session
  let newCount = currentSession.count;

  // Only increment count if not changing authentication status
  // This preserves the count during login/logout transitions
  if (currentSession.isAuthenticated === isAuthenticated) {
    newCount += 1; // Increment for a podcast view when auth status is stable
  }
  // If auth status is changing (either logging in or out), preserve the count

  // Create updated session with preserved count
  const sessionData = await new SignJWT({
    ip: clientIP,
    count: newCount,
    createdAt: currentSession.createdAt, // Keep original creation time
    isAuthenticated: isAuthenticated, // Update authentication status
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

  cookieStore.set({
    name: "podcast",
    value: sessionData,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60,
    sameSite: "lax",
    path: "/",
  });

  return { count: newCount, isAuthenticated };
}

// Helper to determine if limit is reached based on count and authentication status
export function isLimitReached(
  count: number,
  isAuthenticated: boolean,
): boolean {
  if (isAuthenticated) {
    return count > 2; // Authenticated users get 2 free podcasts
  } else {
    return count > 1; // Unauthenticated users get 1 free podcast
  }
}
