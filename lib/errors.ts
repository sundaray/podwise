import { Data } from "effect";

export class UserSessionNotFoundError extends Data.TaggedError(
  "UserSessionNotFoundError"
)<{}> {}

export class CookieStoreAccessError extends Data.TaggedError(
  "CookieStoreAccessError"
)<{ cause: unknown }> {}

export class DecryptionError extends Data.TaggedError("DecryptionError")<{
  cause: unknown;
}> {}