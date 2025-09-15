import { HttpApiSchema } from "@effect/platform";
import { Schema } from "effect";

export class EmailError extends Schema.TaggedError<EmailError>()(
  "EmailError",
  {
    message: Schema.Literal(
      "An unexpected error occurred while sending the email.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "An unexpected error occurred while sending the email.",
      ...props,
    });
  }
}

export class EncryptError extends Schema.TaggedError<EncryptError>()(
  "EncryptionError",
  {
    message: Schema.Literal(
      "Failed to encrypt payload. please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Failed to encrypt payload. please try again later.",
      ...props,
    });
  }
}

export class EmailVerificationSessionNotFoundError extends Schema.TaggedError<EmailVerificationSessionNotFoundError>()(
  "EmailVerificationSessionNotFoundError",
  {
    message: Schema.Literal(
      "Email verification session not found. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 404 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Email verification session not found. Please try again later.",
      ...props,
    });
  }
}

export class PasswordResetSessionNotFoundError extends Schema.TaggedError<PasswordResetSessionNotFoundError>()(
  "PasswordResetSessionNotFoundError",
  {
    message: Schema.Literal(
      "Password reset session not found. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 404 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Password reset session not found. Please try again later.",
      ...props,
    });
  }
}

export class TokenMismatchError extends Schema.TaggedError<TokenMismatchError>()(
  "TokenMismatchError",
  {
    message: Schema.Literal("The provided token is invalid or does not match."),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 400 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "The provided token is invalid or does not match.",
      ...props,
    });
  }
}

export class CreateUserError extends Schema.TaggedError<CreateUserError>()(
  "CreateUserError",
  {
    message: Schema.Literal("Failed to create user. Please try again later."),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Failed to create user. Please try again later.",
      ...props,
    });
  }
}

export class ConfigError extends Schema.TaggedError<ConfigError>()(
  "ConfigError",
  {
    message: Schema.Literal("Config error. Please try again later."),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({ message: "Config error. Please try again later.", ...props });
  }
}

export class CreatePasswordResetTokenError extends Schema.TaggedError<CreatePasswordResetTokenError>()(
  "PasswordResetTokenGenerationError",
  {
    message: Schema.Literal(
      "Failed to create password reset token. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Failed to create password reset token. Please try again later.",
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

export class CookieStoreAccessError extends Schema.TaggedError<CookieStoreAccessError>()(
  "CookieStoreAccessError",
  {
    message: Schema.Literal(
      "Failed to access the cookie store. Please try again later.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Failed to access the cookie store. Please try again later.",
      ...props,
    });
  }
}

export class DecryptError extends Schema.TaggedError<DecryptError>()(
  "DecryptError",
  {
    message: Schema.Literal(
      "Failed to decrypt the token. It may be invalid or expired.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "Failed to decrypt the token. It may be invalid or expired.",
      ...props,
    });
  }
}

export class InvalidJWTPayloadError extends Schema.TaggedError<InvalidJWTPayloadError>()(
  "InvalidJWTPayloadError",
  {
    message: Schema.Literal(
      "The token's payload does not have the expected structure.",
    ),
    operation: Schema.String,
    cause: Schema.Unknown,
  },
  HttpApiSchema.annotations({ status: 500 }),
) {
  constructor(props: { operation: string; cause: unknown }) {
    super({
      message: "The token's payload does not have the expected structure.",
      ...props,
    });
  }
}
