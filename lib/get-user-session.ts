import "server-only";

import { cookies } from "next/headers";
import { Effect } from "effect";

import { decrypt } from "@/lib/decrypt";
import { CookieStoreAccessError } from "@/lib/errors";
import { UserSessionSchema } from "@/lib/schema";

export function getUserSession() {
  return Effect.gen(function* () {
    const cookieStore = yield* Effect.tryPromise({
      try: () => cookies(),
      catch: (error) => new CookieStoreAccessError({ cause: error }),
    });

    const userSessionCookie = cookieStore.get("user-session");

    const userSession = yield* Effect.fromNullable(userSessionCookie);

    const user = yield* decrypt(userSession.value, UserSessionSchema);

    return user;
  });
}
