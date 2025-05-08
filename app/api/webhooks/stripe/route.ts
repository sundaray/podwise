import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserAccess } from "@/lib/update-user-access";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-expect-error
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userEmail = session?.metadata?.userEmail;
      const planType = session?.metadata?.planType as "annual" | "lifetime";

      if (userEmail && planType) {
        console.log(`Processing payment for ${userEmail}, plan: ${planType}`);

        // Update user access in the database
        await updateUserAccess(userEmail, planType);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
