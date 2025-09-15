import "server-only";

import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import { Config, Effect } from "effect";

import { PasswordResetTemplate } from "@/components/auth/password-reset-template";
import { PasswordResetEmailTemplateRenderError } from "@/lib/api/auth/errors";
import { EmailService } from "@/lib/services/email-service";

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
        new PasswordResetEmailTemplateRenderError({
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
