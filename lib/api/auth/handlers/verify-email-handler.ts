import { HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { Config, Effect } from "effect";

import { UserCreationError } from "@/lib/api/auth/errors";
import { assignUserRole } from "@/lib/assign-user-role";
import { timingSafeCompare } from "@/lib/auth/credentials/timing-safe-compare";
import { createUser } from "@/lib/create-user";
import { deleteEmailVerificationSession } from "@/lib/delete-email-verification-session";
import { getEmailVerificationSession } from "@/lib/get-email-verification-session";

export const verifyEmailHandler = ({
  urlParams,
  request,
}: {
  urlParams: { token: string };
  request: HttpServerRequest.HttpServerRequest;
}) => {
  const program = Effect.gen(function* () {
    const emailVerificationSession = yield* getEmailVerificationSession();

    yield* timingSafeCompare(urlParams.token, emailVerificationSession.token);

    const role = assignUserRole(emailVerificationSession.email);
    
    yield* Effect.tryPromise({
      try: () =>
        createUser(
          emailVerificationSession.email,
          role,
          "credentials",
          undefined,
          emailVerificationSession.hashedPassword,
        ),
      catch: (error) => new UserCreationError({ cause: error }),
    });

    yield* deleteEmailVerificationSession();
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
