import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, JWTPayload } from "jose";
import { v4 as uuidv4 } from "uuid";

import { assignUserRole } from "@/lib/assign-user-role";
import { createUser } from "@/lib/create-user";
import { google } from "@/lib/auth/oauth2/auth";
import { createSession, decrypt } from "@/lib/auth/oauth2/session";

interface GoogleIdTokenClaims extends JWTPayload {
  name: string;
  email: string;
  picture: string;
}

interface OAuthRequestState extends JWTPayload {
  state: string;
  codeVerifier: string;
  redirect: string;
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;

    const code = url.searchParams.get("code");
    const stateFromGoogle = url.searchParams.get("state");

    const cookieStore = await cookies();
    const encryptedOAuthState =
      cookieStore.get("google_oauth_state")?.value ?? null;

    const authErrorUrl = new URL("/auth-error", url);

    if (
      code === null ||
      stateFromGoogle === null ||
      encryptedOAuthState === null
    ) {
      return NextResponse.redirect(authErrorUrl);
    }

    // Decrypt our stored values
    const oauthState = (await decrypt(
      encryptedOAuthState,
    )) as OAuthRequestState;

    // Additional null check after decryption
    if (!oauthState) {
      return NextResponse.redirect(authErrorUrl);
    }

    // Verify the state parameter matches
    if (stateFromGoogle !== oauthState.state) {
      return NextResponse.redirect(authErrorUrl);
    }

    // Exchange authorization code for tokens
    const { data } = await google.exchangeCodeForTokens(
      code,
      oauthState.codeVerifier,
    );

    // Decrypt the ID token to get user profile information
    const claims = decodeJwt(data.id_token) as GoogleIdTokenClaims;

    const id = uuidv4();
    const name = claims.name;
    const email = claims.email;
    const picture = claims.picture;

    // Assign user a role
    const role = assignUserRole(email);

    // Create a user record in the database
    await createUser(id, name, email, role, picture);

    // Create a user session
    await createSession(id, name, email, role, picture);

    return NextResponse.redirect(new URL(oauthState.redirect, url));
  } catch (error) {
    const authErrorUrl = new URL("/auth-error", request.nextUrl);
    return NextResponse.redirect(authErrorUrl);
  }
}
