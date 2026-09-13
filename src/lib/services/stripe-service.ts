import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";

export interface CheckoutSessionOptions {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export class StripeService {
  /**
   * Create Stripe Checkout session for subscription tier upgrade
   */
  static async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ url: string | null; sessionId?: string; error?: string }> {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (secretKey && secretKey.trim() !== "" && !secretKey.includes("sk_test_...")) {
      try {
        const bodyParams = new URLSearchParams({
          "payment_method_types[0]": "card",
          mode: "subscription",
          "line_items[0][price]": options.priceId,
          "line_items[0][quantity]": "1",
          customer_email: options.userEmail,
          client_reference_id: options.userId,
          success_url: options.successUrl,
          cancel_url: options.cancelUrl,
        });

        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${secretKey.trim()}`,
          },
          body: bodyParams.toString(),
        });

        if (response.ok) {
          const data = await response.json();
          return { url: data.url, sessionId: data.id };
        } else {
          const errText = await response.text();
          console.error("[StripeService Error]:", response.status, errText);
          return { url: null, error: `Stripe returned status ${response.status}` };
        }
      } catch (err) {
        return { url: null, error: err instanceof Error ? err.message : "Failed to initiate Stripe session" };
      }
    }

    // Development Mode Mock Checkout URL
    return {
      url: `${options.successUrl}?session_id=mock_stripe_session_${Date.now()}`,
      sessionId: `mock_stripe_session_${Date.now()}`,
    };
  }

  /**
   * Update subscription record in Database upon webhook signal
   */
  static async handleSubscriptionWebhookEvent(
    userId: string,
    tier: "free" | "professional" | "career_pro",
    status: "active" | "canceled" | "past_due" | "trialing",
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
  ): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              tier,
              status,
              stripe_customer_id: stripeCustomerId || null,
              stripe_subscription_id: stripeSubscriptionId || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        // Also update users table tier
        await supabase.from("users").update({ subscription_tier: tier, subscription_status: status }).eq("id", userId);
        return true;
      } catch (err) {
        console.warn("[StripeService] Error updating subscription in Supabase:", err);
      }
    }
    return true;
  }
}
