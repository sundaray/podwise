import { NextRequest, NextResponse } from "next/server";

import {
  deleteSubscriptionEmailVerificationSession,
  doesSubscriptionEmailVerificationSessionExist,
  getSubscriptionEmailVerificationSession,
} from "@/lib/subscription/session";
import { createSubscriber } from "@/lib/subscription/create-subscriber";
import { timingSafeCompare } from "@/lib/auth/credentials/timing-safe-compare";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const tokenFromUrl = url.searchParams.get("token");
    const subscribeErrorUrl = new URL("/subscribe/verify-email/error", url);

    const sessionExists = await doesSubscriptionEmailVerificationSessionExist();
    const payload = await getSubscriptionEmailVerificationSession();

    if (!tokenFromUrl || !sessionExists || !payload) {
      return NextResponse.redirect(subscribeErrorUrl);
    }

    const { email, token: tokenFromSession } = payload;

    if (!timingSafeCompare(tokenFromUrl, tokenFromSession)) {
      return NextResponse.redirect(subscribeErrorUrl);
    }

    await createSubscriber(email);

    await deleteSubscriptionEmailVerificationSession();

    return NextResponse.redirect(new URL("/subscribe/success", url));
  } catch (error) {
    const authErrorUrl = new URL("/subscribe/verify-email/error", request.nextUrl);
    return NextResponse.redirect(authErrorUrl);
  }
}
