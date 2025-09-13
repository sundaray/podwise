import { HttpApiGroup, HttpApiEndpoint } from "@effect/platform";
import {Schema} from "effect"

// export class UserSessionNotFoundError extends Schema.TaggedError<UserSessionNotFoundError>()(
//   "UserSessionNotFoundError", 
//   {} 
// ) {}

const UserSchema = Schema.Struct({
    email: Schema.String,
    role: Schema.String,
})

  const SessionResponseSchema = Schema.Struct({
    user: Schema.NullOr(UserSchema)
})

const getUserSessionEndpoint = HttpApiEndpoint.get("getUserSession", "/auth/session").addSuccess(SessionResponseSchema)

export const authGroup = HttpApiGroup.make("auth").add(getUserSessionEndpoint)