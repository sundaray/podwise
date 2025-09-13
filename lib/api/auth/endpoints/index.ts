import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

export class EmailVerificationSessionNotFoundError extends Schema.TaggedError<EmailVerificationSessionNotFoundError>()(
  "EmailVerificationSessionNotFoundError",
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

export const VerifyEmailError = Schema.Union(
  EmailVerificationSessionNotFoundError,
  TokenMismatchError,
  UserCreationError,
  ConfigError,
);
const UserSchema = Schema.Struct({
  email: Schema.String,
  role: Schema.String,
});

const SessionResponseSchema = Schema.Struct({
  user: Schema.NullOr(UserSchema),
});

export const getUserSessionEndpoint = HttpApiEndpoint.get(
  "getUserSession",
  "/auth/session",
).addSuccess(SessionResponseSchema);

export const verifyEmailEndpoint = HttpApiEndpoint.get(
  "verifyEmail",
  "/auth/verify-email",
)
  .setUrlParams(Schema.Struct({ token: Schema.String }))
  .addSuccess(Schema.Void)
  .addError(VerifyEmailError);

export const authGroup = HttpApiGroup.make("auth")
  .add(getUserSessionEndpoint)
  .add(verifyEmailEndpoint);
