import "server-only";

import { cookies } from "next/headers";
import { Effect } from "effect";

import { CookieStoreAccessError } from "@/lib/api/auth/errors";
import { decrypt } from "@/lib/decrypt";
import { UserSessionSchema } from "@/lib/schema";

export function getUserSession() {
  return Effect.gen(function* () {
    const cookieStore = yield* Effect.tryPromise({
      try: () => cookies(),
      catch: (error) =>
        new CookieStoreAccessError({
          operation: "getUserSession",
          cause: error,
        }),
    });

    const userSessionCookie = cookieStore.get("user-session");

    const userSession = yield* Effect.fromNullable(userSessionCookie);

    const user = yield* decrypt(userSession.value, UserSessionSchema);

    return user;
  }).pipe(Effect.tapError((error) => Effect.logError(error)));
}
