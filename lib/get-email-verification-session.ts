import "server-only";

import { cookies } from "next/headers";
import { Effect } from "effect";

import { decrypt } from "@/lib/decrypt";
import { CookieStoreAccessError } from "@/lib/errors";
import { EmailVerificationSessionSchema } from "@/lib/schema";

export function getEmailVerificationSession() {
  return Effect.gen(function* () {
    const cookieStore = yield* Effect.tryPromise({
      try: () => cookies(),
      catch: (error) => new CookieStoreAccessError({ cause: error }),
    });

    const emailVerificationSessionCookie = cookieStore.get(
      "email-verification-session",
    );

    const emailVerificationSession = yield* Effect.fromNullable(
      emailVerificationSessionCookie,
    );

    const emailVerification = yield* decrypt(
      emailVerificationSession.value,
      EmailVerificationSessionSchema,
    );

    return emailVerification;
  });
}
