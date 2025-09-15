import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { Config, Effect, Redacted } from "effect";
import postgres from "postgres";

export class DatabaseClientService extends Effect.Service<DatabaseClientService>()(
  "DatabaseClientService",
  {
    effect: Effect.gen(function* () {
      const databaseUrl = Redacted.value(
        yield* Config.redacted("DATABASE_URL"),
      );

      const client = postgres(databaseUrl, { prepare: false });

      return drizzle(client, { schema });
    }),
  },
) {}
