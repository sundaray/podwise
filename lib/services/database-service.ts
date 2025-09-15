import * as schema from "@/db/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Data, Effect } from "effect";

import { DatabaseClientService } from "@/lib/services/database-client-service";

class DatabaseError extends Data.TaggedError("DatabaseError")<{
  cause: unknown;
}> {}

type DatabaseServiceImp = {
  use: <A>(
    f: (db: PostgresJsDatabase<typeof schema>) => Promise<A>,
  ) => Effect.Effect<A, DatabaseError>;
};

export class DatabaseService extends Effect.Service<DatabaseService>()(
  "DatabaseService",
  {
    effect: Effect.gen(function* () {
      const db = yield* DatabaseClientService;

      return {
        use: (f) =>
          Effect.tryPromise({
            try: () => f(db),
            catch: (error) => new DatabaseError({ cause: error }),
          }),
      } satisfies DatabaseServiceImp;
    }),
    dependencies: [DatabaseClientService.Default],
  },
) {}
