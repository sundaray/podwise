import "server-only";

import { Config, Effect, Schema } from "effect";
import { base64url, jwtDecrypt } from "jose";

// ============================================================================
// JWT secret configuration
// ============================================================================

const jwtKey = Config.string("JWT_ENCRYPTION_KEY").pipe(
  Config.mapAttempt((key) => base64url.decode(key)),
);

// ============================================================================
// Decrypt JWT
// ============================================================================

export function decrypt<A, I>(jwt: string, schema: Schema.Schema<A, I>) {
  return Effect.gen(function* () {
    const key = yield* jwtKey;

    const { payload } = yield* Effect.tryPromise({
      try: () => jwtDecrypt(jwt, key),
      catch: (error) =>
        new DecryptError({
          operation: "decrypt",
          cause: error,
        }),
    });

    const decoded = yield* Schema.decodeUnknown(schema)(payload).pipe(
      Effect.mapError(
        (cause) => new InvalidJWTPayloadError({ operation: "decrypt", cause }),
      ),
    );

    return decoded;
  });
}
