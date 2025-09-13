import { HttpApiGroup } from "@effect/platform";

import {
  getUserSessionEndpoint,
  verifyEmailEndpoint,
} from "@/lib/api/auth/endpoints";

export const authGroup = HttpApiGroup.make("auth")
  .add(getUserSessionEndpoint)
  .add(verifyEmailEndpoint);
