import { HttpApiBuilder, HttpMiddleware } from "@effect/platform";
import { Layer } from "effect";

import { PodwiseApi } from "@/lib/api";
import { getUserSessionHandler } from "@/lib/handlers/auth.handlers";

const AuthGroupLive = HttpApiBuilder.group(PodwiseApi, "auth", (handlers) =>
  handlers.handle("getUserSession", () => getUserSessionHandler),
);

export const ApiLive = HttpApiBuilder.api(PodwiseApi).pipe(
  Layer.provide(AuthGroupLive),
);

const MiddlewareLive = HttpApiBuilder.middleware(HttpMiddleware.logger);

export const mainLayer = Layer.mergeAll(ApiLive, MiddlewareLive);
