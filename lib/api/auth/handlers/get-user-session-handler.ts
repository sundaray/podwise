import { Effect, Option } from "effect";

import { getUserSession } from "@/lib/get-user-session";

export function getUserSessionHandler() {
  return Effect.gen(function* () {
    const userOption = yield* Effect.option(getUserSession());

    return { user: Option.getOrNull(userOption) };
  });
}
