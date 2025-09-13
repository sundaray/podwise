import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

// export class UserSessionNotFoundError extends Schema.TaggedError<UserSessionNotFoundError>()(
//   "UserSessionNotFoundError",
//   {}
// ) {}

export class TokenNotFoundError extends Schema.TaggedError<TokenNotFoundError>()(
  "TokenNotFoundError",
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
  TokenNotFoundError,
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

const getUserSessionEndpoint = HttpApiEndpoint.get(
  "getUserSession",
  "/auth/session",
).addSuccess(SessionResponseSchema);

const verifyEmailEndpoint = HttpApiEndpoint.get(
  "verifyEmail",
  "/auth/verify-email",
)
  .setUrlParams(Schema.Struct({ token: Schema.String }))
  .addSuccess(Schema.Void)
  .addError(VerifyEmailError);

export const authGroup = HttpApiGroup.make("auth")
  .add(getUserSessionEndpoint)
  .add(verifyEmailEndpoint);
