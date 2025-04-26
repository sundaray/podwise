"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { google } from "@/lib/auth/oauth2/auth";
import { generateCodeVerifier } from "@/lib/auth/oauth2/pkce";
import { generateState } from "@/lib/auth/oauth2/utils";
import { storeOAuthState } from "@/lib/auth/oauth2/session";

/************************************************
 * Sign in with Google
 **************** ********************************/

export type GoogleSignInState = { error?: string[] };

export async function signInWithGoogle(next: string) {
  let errorOccurred = false;
  let redirectUrl = "";

  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = await google.createAuthorizationURLWithPKCE(
      state,
      codeVerifier,
      ["openid", "email", "profile"],
    );

    await storeOAuthState(state, codeVerifier, next);

    redirectUrl = url.toString();
  } catch (error) {
    errorOccurred = true;
    return {
      errors: ["Failed to sign in with Google. Please try again."],
    };
  } finally {
    if (!errorOccurred && redirectUrl) {
      redirect(redirectUrl);
    }
  }
}

/************************************************
 * Sign out
 ************************************************/

export async function signOut() {
  const cookiesStore = await cookies();
  cookiesStore.delete("session");
  redirect("/");
}
