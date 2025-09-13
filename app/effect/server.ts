import { HttpApiBuilder, HttpMiddleware } from "@effect/platform";
import { Layer } from "effect";

import { PodwiseApi } from "@/lib/api";
import { getUserSessionHandler } from "@/lib/api/auth/handlers/get-user-session-handler";
import { verifyEmailHandler } from "@/lib/api/auth/handlers/verify-email-handler";

const AuthGroupLive = HttpApiBuilder.group(PodwiseApi, "auth", (handlers) =>
  handlers
    .handle("getUserSession", () => getUserSessionHandler)
    .handle("verifyEmail", (req) => verifyEmailHandler(req)),
);

export const PodwiseApiLive = HttpApiBuilder.api(PodwiseApi).pipe(
  Layer.provide(AuthGroupLive),
);

const MiddlewareLive = HttpApiBuilder.middleware(HttpMiddleware.logger);

export const mainLayer = Layer.mergeAll(PodwiseApiLive, MiddlewareLive);
