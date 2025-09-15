import { Schema } from "effect";

export class EmailVerificationSessionNotFoundError extends Schema.TaggedError<EmailVerificationSessionNotFoundError>()(
  "EmailVerificationSessionNotFoundError",
  {},
) {}

export class PasswordResetSessionNotFoundError extends Schema.TaggedError<PasswordResetSessionNotFoundError>()(
  "PasswordResetSessionNotFoundError",
  {},
) {}

export class TokenMismatchError extends Schema.TaggedError<TokenMismatchError>()(
  "TokenMismatchError",
  {},
) {}

export class UserCreationError extends Schema.TaggedError<UserCreationError>()(
  "UserCreationError",
  { cause: Schema.Unknown },
) {}

export class ConfigError extends Schema.TaggedError<ConfigError>()(
  "ConfigError",
  {},
) {}
