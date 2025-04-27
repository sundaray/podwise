import { NextRequest, NextResponse } from "next/server";
import { updateUserSession } from "@/lib/auth/session";

/**
 * Updates the user session cookie on GET requests
 * This helps extend session lifetime for active users
 */
export async function updateAuthSession(request: NextRequest) {
  // Only update session on GET requests to avoid conflicts with other session operations
  if (request.method === "GET") {
    const response = NextResponse.next();
    const token = request.cookies.get("user-session")?.value ?? null;

    if (token) {
      try {
        const data = await updateUserSession(token);

        if (data) {
          response.cookies.set("user-session", data.updatedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1 hour in seconds
            sameSite: "lax",
            path: "/",
          });
        }
      } catch (error) {
        // Log error but don't interrupt the request flow
        console.error("Failed to update user session:", error);
      }

      return response;
    }
  }

  // Return null for non-GET requests or when no session token exists
  return null;
}
