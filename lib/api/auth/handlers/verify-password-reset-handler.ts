import { HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { Config, Effect } from "effect";

import { timingSafeCompare } from "@/lib/auth/credentials/timing-safe-compare";
import { getPasswordResetSession } from "@/lib/get-password-reset-session";

export const verifyPasswordResetHandler = ({
  urlParams,
  request,
}: {
  urlParams: { token: string };
  request: HttpServerRequest.HttpServerRequest;
}) => {
  const program = Effect.gen(function* () {
    const sessionData = yield* getPasswordResetSession();

    yield* timingSafeCompare(urlParams.token, sessionData.token);
  });

  const handledProgram = program.pipe(
    Effect.matchEffect({
      onFailure: (error) =>
        Effect.gen(function* () {
          const origin = yield* Config.string("NEXT_PUBLIC_APP_URL").pipe(
            Effect.orElseSucceed(() => "http://localhost:3000"),
          );
          Effect.logError("Password reset verification failed", error);
          const errorUrl = new URL("/forgot-password/error", origin);
          return HttpServerResponse.redirect(errorUrl);
        }),
      onSuccess: () =>
        Effect.gen(function* () {
          const origin = yield* Config.string("NEXT_PUBLIC_APP_URL").pipe(
            Effect.orElseSucceed(() => "http://localhost:3000"),
          );
          const successUrl = new URL("/reset-password", origin);
          return HttpServerResponse.redirect(successUrl);
        }),
    }),
  );

  return handledProgram;
};
