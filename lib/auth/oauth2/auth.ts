import { Google } from "@/lib/auth/oauth2/google";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.REDIRECT_URI!,
);
