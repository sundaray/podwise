import { HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { Config, Effect } from "effect";

import {
  TokenMismatchError,
  TokenNotFoundError,
  UserCreationError,
} from "@/lib/api/auth.api";
import { assignUserRole } from "@/lib/assign-user-role";
import {
  deleteEmailVerificationSession,
  getEmailVerificationSession,
} from "@/lib/auth/credentials/session";
import { timingSafeCompare } from "@/lib/auth/credentials/timing-safe-compare";
import { createUser } from "@/lib/create-user";

export const verifyEmailHandler = ({
  urlParams,
}: {
  urlParams: { token: string };
  request: HttpServerRequest.HttpServerRequest;
}) => {
  const program = Effect.gen(function* () {
    const sessionPayload = yield* Effect.tryPromise({
      try: () => getEmailVerificationSession(),
      catch: () => new TokenNotFoundError(),
    });

    if (!timingSafeCompare(urlParams.token, sessionPayload.token)) {
      return yield* Effect.fail(new TokenMismatchError());
    }

    const role = assignUserRole(sessionPayload.email);
    yield* Effect.tryPromise({
      try: () =>
        createUser(
          sessionPayload.email,
          role,
          "credentials",
          undefined,
          sessionPayload.hashedPassword,
        ),
      catch: (error) => new UserCreationError({ cause: error }),
    });

    yield* Effect.promise(() => deleteEmailVerificationSession());
  });

  const handledProgram = program.pipe(
    Effect.matchEffect({
      onFailure: (error) =>
        Effect.gen(function* () {
          const origin = yield* Config.string("NEXT_PUBLIC_APP_URL").pipe(
            Effect.orElseSucceed(() => "http://localhost:3000"),
          );
          Effect.logError("Email verification failed", error);
          const errorUrl = new URL("/signup/verify-email/error", origin);
          errorUrl.searchParams.set("error", error._tag);
          return HttpServerResponse.redirect(errorUrl);
        }),
      onSuccess: () =>
        Effect.gen(function* () {
          const origin = yield* Config.string("NEXT_PUBLIC_APP_URL").pipe(
            Effect.orElseSucceed(() => "http://localhost:3000"),
          );
          const successUrl = new URL("/signup/email-verified", origin);
          return HttpServerResponse.redirect(successUrl);
        }),
    }),
  );

  return handledProgram;
};
