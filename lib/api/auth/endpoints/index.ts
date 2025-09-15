import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

import {
  EmailVerificationSessionNotFoundError,
  TokenMismatchError,
  UserCreationError,
} from "@/lib/api/auth/errors";

/**************************************
 * getUserSession
 *************************************/

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

/**************************************
 * verifyEmail
 *************************************/

export const VerifyEmailError = Schema.Union(
  EmailVerificationSessionNotFoundError,
  TokenMismatchError,
  UserCreationError,
);

export const verifyEmailEndpoint = HttpApiEndpoint.get(
  "verifyEmail",
  "/auth/verify-email",
)
  .setUrlParams(Schema.Struct({ token: Schema.String }))
  .addSuccess(Schema.Void)
  .addError(VerifyEmailError);

/**************************************
 * forgotPassword
 *************************************/

const ForgotPasswordPayload = Schema.Struct({
  email: Schema.String,
});

const forgotPasswordEndpoint = HttpApiEndpoint.post(
  "forgotPassword",
  "/auth/forgot-password",
)
  .setPayload(ForgotPasswordPayload)
  .addSuccess(Schema.Void);

/**************************************
 * verifyPasswordReset
 *************************************/

const verifyPasswordResetEndpoint = HttpApiEndpoint.get(
  "verifyPasswordReset",
  "/auth/verify-password-reset",
)
  .setUrlParams(Schema.Struct({ token: Schema.String }))
  .addSuccess(Schema.Void);

/**************************************
 * authGroup
 *************************************/

export const authGroup = HttpApiGroup.make("auth")
  .add(getUserSessionEndpoint)
  .add(verifyEmailEndpoint)
  .add(forgotPasswordEndpoint)
  .add(verifyPasswordResetEndpoint);
