import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_USD!, {
  // @ts-ignore
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, userEmail } = await request.json();

    // Ensure amount is a number and convert it to cents (Stripe uses cents)
    const amountInCents = Number(amount) * 100;

    // Define the params object within the POST function, so it has access to amount
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "makepodcast.app credits",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail,
      },
      success_url: "https://podwise.org/credits",
      cancel_url: "https://podwise.org/buy-credits/canceled",
    };

    const { id } = await stripe.checkout.sessions.create(params);

    return NextResponse.json(
      {
        id,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}
