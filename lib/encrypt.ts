import "server-only";

import { Config, Data, Effect } from "effect";
import { base64url, EncryptJWT, type JWTPayload } from "jose";

class EncryptError extends Data.TaggedError("EncryptionError")<{
  operation: string;
  cause: unknown;
}> {}

// ============================================================================
// JWT secret configuration
// ============================================================================

const jwtKey = Config.string("JWT_ENCRYPTION_KEY").pipe(
  Config.mapAttempt((key) => base64url.decode(key)),
);

// ============================================================================
// Encrypt payload
// ============================================================================

export function encrypt(payload: JWTPayload) {
  return Effect.gen(function* () {
    const key = yield* jwtKey;

    const encryptedJWT = yield* Effect.tryPromise({
      try: () =>
        new EncryptJWT(payload)
          .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
          .setExpirationTime("1hr")
          .encrypt(key),
      catch: (error) =>
        new EncryptError({
          operation: "encrypt",
          cause: error,
        }),
    });

    return encryptedJWT;
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
