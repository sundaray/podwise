import { HttpApi } from "@effect/platform";

import { authGroup } from "@/lib/api/auth/endpoints";

export class PodwiseApi extends HttpApi.make("PodwiseApi")
  .add(authGroup)
  .prefix("/effect") {}
