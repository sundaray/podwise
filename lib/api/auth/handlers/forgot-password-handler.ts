import { HttpServerResponse } from "@effect/platform";
import { Effect } from "effect";

import "@/lib/api";

import { sendPasswordResetEmail } from "@/lib/auth/credentials/password-reset";
import { createPasswordResetSession } from "@/lib/create-password-reset-session";
import { createPasswordResetToken } from "@/lib/create-password-reset-token";
import { createPasswordResetUrl } from "@/lib/create-password-reset-url";

export function forgotPasswordHandler({ data }: { data: { email: string } }) {
  const { email } = data;

  const program = Effect.gen(function* () {
    const token = yield* createPasswordResetToken();

    const url = yield* createPasswordResetUrl(token);

    yield* createPasswordResetSession(email, token);

    yield* sendPasswordResetEmail(payload.email, url);
  });

  const handledProgram = program.pipe(
    Effect.matchEffect({
      onFailure: (error) => {
        Effect.logError("Forgot password process failed", error);

        const responseBody = {
          ok: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        };
        return HttpServerResponse.json(responseBody);
      },
      onSuccess: () => {
        const responseBody = {
          ok: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        };
        return HttpServerResponse.json(responseBody);
      },
    }),
  );

  return handledProgram;
}
