import { useEffect, useState } from "react";
import { Effect, pipe } from "effect";
import { clientRuntime } from "@/lib/runtime/client.runtime";
import { HttpClientService } from "@/lib/services/http-client-service"
import { UserSession } from "@/lib/schema";


export function useSession() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const program = Effect.gen(function* () {
      const client = yield* HttpClientService;
      const response = yield* client.auth.getUserSession()
      return response.user
    });

    const handledProgram = pipe(program, Effect.tap({
        onSuccess: (user:UserSession) => Effect.sync(() => setUser(user)),
      }),
      Effect.catchAll((error) =>
        Effect.sync(() => {
          console.error("Failed to fetch session:", error);
          setError(
            new Error("Unable to load your session. Please try again in a moment.")
          );
        })
      ),
      Effect.ensureErrorType<never>(),
      Effect.ensuring(Effect.sync(() => setLoading(false))))

      clientRuntime.runPromise(handledProgram);
  }, []);

  return { user, loading, error };
}