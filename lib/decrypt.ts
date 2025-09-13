import "server-only";

import { base64url, jwtDecrypt } from "jose";
import { Effect, Data, Config, Schema } from "effect";
import { EncryptableSession } from "@/lib/schema";

class DecryptionError extends Data.TaggedError("DecryptionError")<{
  operation: string;
  cause: unknown;
}> {}

class InvalidJWTPayloadError extends Data.TaggedError(
  "InvalidJWTPayloadError"
)<{
  operation: string;
  cause: unknown;
}> {}

/************************************************
 *
 * JWT Secret Configuration
 *
 ************************************************/

const jwtKey = Config.string("JWT_ENCRYPTION_KEY").pipe(
  Config.mapAttempt((key) => base64url.decode(key))
);

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/

export function decrypt<A extends EncryptableSession>(
  jwt: string,
  schema: Schema.Schema<A>
) {
  return Effect.gen(function* () {
    // Load the secret using Config
    const key = yield* jwtKey;

    // 1. Decrypt the JWT
    const { payload } = yield* Effect.tryPromise({
      try: () => jwtDecrypt(jwt, key),
      catch: (error) =>
        new DecryptionError({
          operation: "decrypt",
          cause: error,
        }),
    });

    // 2. Validate the payload using the provided schema
    const validatedPayload = yield* Schema.decodeUnknown(schema)(payload).pipe(
      Effect.mapError(
        (error) =>
          new InvalidJWTPayloadError({
            operation: "decrypt",
            cause: error,
          })
      )
    );

    return validatedPayload;
  }).pipe(Effect.tapError((error) => Effect.logError(error)))
}
