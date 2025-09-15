import { HttpApiSchema } from "@effect/platform";
import { Data, Schema } from "effect";

export class UserSessionNotFoundError extends Data.TaggedError(
  "UserSessionNotFoundError",
)<{}> {}

export class CookieStoreAccessError extends Data.TaggedError(
  "CookieStoreAccessError",
)<{ cause: unknown }> {}

export class DecryptionError extends Data.TaggedError("DecryptionError")<{
  cause: unknown;
}> {}

export class PasswordResetTokenGenerationError extends Schema.TaggedError<PasswordResetTokenGenerationError>()(
  "PasswordResetTokenGenerationError",
  {
    message: Schema.Literal(
      "Failed to create a secure password reset token. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message:
        "Failed to create a secure password reset token. Please try again later.",
      ...props,
    });
  }
}

export class CreatePasswordResetUrlError extends Schema.TaggedError<CreatePasswordResetUrlError>()(
  "CreatePasswordResetUrlError",
  {
    message: Schema.Literal(
      "Failed to create the password reset URL. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message:
        "Failed to create the password reset URL. Please try again later.",
      ...props,
    });
  }
}

export class CreatePasswordResetSessionError extends Schema.TaggedError<CreatePasswordResetSessionError>()(
  "CreatePasswordResetSessionError",
  {
    message: Schema.Literal(
      "Failed to create the password reset session. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message:
        "Failed to create the password reset session. Please try again later.",
      ...props,
    });
  }
}

export class PasswordResetEmailTemplateRenderError extends Schema.TaggedError<PasswordResetEmailTemplateRenderError>()(
  "PasswordResetEmailTemplateRenderError",
  {
    message: Schema.Literal(
      "Failed to prepare the password reset email. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message:
        "Failed to prepare the password reset email. Please try again later.",
      ...props,
    });
  }
}
