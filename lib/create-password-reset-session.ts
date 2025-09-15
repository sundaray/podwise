import "server-only";

import { cookies } from "next/headers";
import { Effect } from "effect";

import { encrypt } from "@/lib/encrypt";
import { CreatePasswordResetSessionError } from "@/lib/api/auth/errors";

// ============================================================================
// Create password reset session
// ============================================================================

export function createPasswordResetSession(email: string, token: string) {
  return Effect.gen(function* () {
    const sessionData = yield* encrypt({
      email,
      token,
    });

    yield* Effect.tryPromise({
      try: async () => {
        const cookieStore = await cookies();

        cookieStore.set({
          name: "password-reset-session",
          value: sessionData,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60, // 1 hour in seconds
          sameSite: "lax",
          path: "/",
        });
      },
      catch: (error) =>
        new CreatePasswordResetSessionError({
          operation: "createPasswordResetSession",
          cause: error,
        }),
    });
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
