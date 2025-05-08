import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2023-10-16",
});

// Function to retrieve checkout session by ID
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    return { success: true, session };
  } catch (error) {
    console.error(`[getCheckoutSession] error:`, error);
    return { success: false, error: "Failed to retrieve checkout session" };
  }
}
