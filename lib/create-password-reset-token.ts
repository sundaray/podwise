import "server-only";

import { Data, Effect } from "effect";
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

class TokenGenerationError extends Data.TaggedError("TokenGenerationError")<{
  operation: string;
  cause: unknown;
}> {}

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
      new TokenGenerationError({
        operation: "createPasswordResetToken",
        cause: error,
      }),
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
