import "server-only";

import { cookies } from "next/headers";
import { Data, Effect } from "effect";

class DeleteEmailVerificationSessionError extends Data.TaggedError(
  "DeleteEmailVerificationSessionError",
)<{ cause: unknown }> {}

export function deleteEmailVerificationSession() {
  return Effect.tryPromise({
    try: async () => {
      const cookieStore = await cookies();
      cookieStore.delete("email-verification-session");
    },
    catch: (error) => new DeleteEmailVerificationSessionError({ cause: error }),
  });
}
