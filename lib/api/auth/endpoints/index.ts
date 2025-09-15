import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

import {
  ConfigError,
  CreatePasswordResetSessionError,
  CreatePasswordResetTokenError,
  CreatePasswordResetUrlError,
  CreateUserError,
  EmailError,
  EmailVerificationSessionNotFoundError,
  EncryptError,
  PasswordResetEmailTemplateRenderError,
  TokenMismatchError,
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
  CreateUserError,
);

export const verifyEmailEndpoint = HttpApiEndpoint.get(
  "verifyEmail",
  "/auth/verify-email",
)
  .setUrlParams(Schema.Struct({ token: Schema.String }))
  .addSuccess(Schema.Void)
  .addError(VerifyEmailError);

// ============================================================================
// forgotPassword
// ============================================================================

const ForgotPasswordPayload = Schema.Struct({
  email: Schema.String,
});

const ForgotPasswordResponse = Schema.Struct({
  message: Schema.String,
});

export const ForgotPasswordError = Schema.Union(
  CreatePasswordResetTokenError,
  ConfigError,
);

const forgotPasswordEndpoint = HttpApiEndpoint.post(
  "forgotPassword",
  "/auth/forgot-password",
)
  .setPayload(ForgotPasswordPayload)
  .addSuccess(ForgotPasswordResponse)
  .addError(ForgotPasswordError);

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
