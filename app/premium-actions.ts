"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { getUserSession } from "@/lib/auth/session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2023-10-16",
});

export async function createAnnualCheckoutSession(
  prevState: unknown,
  formData: FormData,
) {
  // Get user from session
  const { user } = await getUserSession();

  // If no user is logged in, redirect to sign-in
  if (!user) {
    redirect("/signin?next=/premium");
  }

  const email = user.email;

  let errorOccurred = false;
  let shouldRedirect = false;
  let checkoutUrl = "";

  try {
    // Set price based on email (special discount for tusarxml@gmail.com)
    const amount = email === "tusarxml@gmail.com" ? 100 : 4900; // $1.00 or $49.00

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Podwise Annual Access",
              description:
                "Access to all current podcast summaries and everything published in the next 12 months",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail: email,
        planType: "annual",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
    });

    if (session) {
      shouldRedirect = true;
      checkoutUrl = session.url;
    }
  } catch (error) {
    errorOccurred = true;
    console.error("[createAnnualCheckoutSession] error:", error);
    return {
      formErrors: ["Error. Please try again."],
    };
  } finally {
    if (shouldRedirect && checkoutUrl && !errorOccurred) {
      redirect(checkoutUrl);
    }
  }
}

export async function createLifetimeCheckoutSession(
  prevState: unknown,
  formData: FormData,
) {
  // Get user from session
  const { user } = await getUserSession();

  // If no user is logged in, redirect to sign-in
  if (!user) {
    redirect("/signin?next=/premium");
  }

  const email = user.email;

  let errorOccurred = false;
  let shouldRedirect = false;
  let checkoutUrl = "";

  try {
    // Set price based on email (special discount for tusarxml@gmail.com)
    const amount = email === "tusarxml@gmail.com" ? 100 : 9900; // $1.00 or $99.00

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Podwise Lifetime Access",
              description:
                "Unlimited access to all current and future podcast summaries forever",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail: email,
        planType: "lifetime",
      },
      // More robust success URL with session ID for verification
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
    });

    if (session) {
      shouldRedirect = true;
      checkoutUrl = session.url;
    }
  } catch (error) {
    errorOccurred = true;
    console.error("[createLifetimeCheckoutSession] error:", error);
    return {
      formErrors: ["Error. Please try again."],
    };
  } finally {
    if (shouldRedirect && checkoutUrl && !errorOccurred) {
      redirect(checkoutUrl);
    }
  }
}
