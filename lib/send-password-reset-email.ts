import "server-only";

import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import { Config, Data, Effect } from "effect";

import { PasswordResetTemplate } from "@/components/auth/password-reset-template";
import { EmailService } from "@/lib/services/email-service";

class EmailTemplateRenderError extends Data.TaggedError(
  "EmailTemplateRenderError",
)<{ operation: string; cause: unknown }> {}

// ============================================================================
// Send password reset email
// ============================================================================

export function sendPasswordResetEmail(email: string, url: string) {
  return Effect.gen(function* () {
    const emailService = yield* EmailService;
    const emailFrom = yield* Config.string("EMAIL_FROM");

    const emailHtml = yield* Effect.tryPromise({
      try: () => render(PasswordResetTemplate({ url })),
      catch: (error) =>
        new EmailTemplateRenderError({
          operation: "sendPasswordResetEmail",
          cause: error,
        }),
    });

    const emailInput: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: emailHtml,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "reset your password for Simple Next Auth",
        },
      },
      Source: emailFrom,
    };

    const command = new SendEmailCommand(emailInput);

    yield* emailService.use((client) => client.send(command));
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
