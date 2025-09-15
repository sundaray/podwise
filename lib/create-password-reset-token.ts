import "server-only";

import { Effect } from "effect";
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

import { PasswordResetTokenGenerationError } from "@/lib/errors";

// ============================================================================
// Create password reset token
// ============================================================================

export function createPasswordResetToken() {
  return Effect.try({
    try: () => {
      const randomValues = new Uint8Array(32);
      getRandomValues(randomValues);
      return base64url.encode(randomValues);
    },
    catch: (error) =>
      new PasswordResetTokenGenerationError({
        operation: "createPasswordResetToken",
        cause: error,
      }),
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
