import { HttpServerResponse } from "@effect/platform";
import { Effect } from "effect";

import "@/lib/api";

import { createPasswordResetSession } from "@/lib/create-password-reset-session";
import { createPasswordResetToken } from "@/lib/create-password-reset-token";
import { createPasswordResetUrl } from "@/lib/create-password-reset-url";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";

export function forgotPasswordHandler({ data }: { data: { email: string } }) {
  const { email } = data;

  const program = Effect.gen(function* () {
    const token = yield* createPasswordResetToken();

    const url = yield* createPasswordResetUrl(token);

    yield* createPasswordResetSession(email, token);

    yield* sendPasswordResetEmail(email, url);
  });

  const handledProgram = program.pipe(
    Effect.match({
      onFailure: (error) => HttpServerResponse.json(error),
      onSuccess: () =>
        HttpServerResponse.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        }),
    }),
  );

  return handledProgram;
}
