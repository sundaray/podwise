import "server-only";

import { cookies } from "next/headers";
import { Effect } from "effect";

import { decrypt } from "@/lib/decrypt";
import { CookieStoreAccessError } from "@/lib/errors";
import { PasswordResetSessionSchema } from "@/lib/schema";

export function getPasswordResetSession() {
  return Effect.gen(function* () {
    const cookieStore = yield* Effect.tryPromise({
      try: () => cookies(),
      catch: (error) => new CookieStoreAccessError({ cause: error }),
    });

    const passwordResetSessionCookie = cookieStore.get(
      "password-reset-session",
    );

    const passwordResetSession = yield* Effect.fromNullable(
      passwordResetSessionCookie,
    );

    const emailVerification = yield* decrypt(
      passwordResetSession.value,
      PasswordResetSessionSchema,
    );

    return emailVerification;
  });
}
