import { Config, Data, Effect } from "effect";

class UrlConstructionError extends Data.TaggedError("UrlConstructionError")<{
  operation: string;
  cause: unknown;
}> {}

// ============================================================================
// Create password reset URL
// ============================================================================

export function createPasswordResetUrl(token: string) {
  return Effect.gen(function* () {
    const baseUrl = yield* Config.string("NEXT_PUBLIC_APP_URL");

    const url = yield* Effect.try({
      try: () => {
        const url = new URL("/api/auth/verify-password-reset", baseUrl);
        url.searchParams.set("token", token);
        return url.toString();
      },
      catch: (error) =>
        new UrlConstructionError({
          operation: "createPasswordResetURL",
          cause: error,
        }),
    });

    return url;
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
