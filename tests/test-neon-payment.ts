import { AuthService } from "../src/lib/services/auth-service";
import { getDb } from "../src/lib/db/neon";

async function testPaymentCycle() {
  console.log("=== Testing Neon PostgreSQL Auth & Payment Flow ===");
  const db = getDb();

  // 1. Sign up test user
  const email = `candidate_${Date.now()}@example.com`;
  const signup = await AuthService.signUp(email, "Pakistan2026!", "Tariq Mahmood");

  if (!signup.user) {
    throw new Error(`Signup failed: ${signup.error}`);
  }
  console.log("1. User signed up successfully:", signup.user.email, "| Status:", signup.user.subscriptionStatus);

  // 2. Insert test payment proof
  const [payment] = await db`
    INSERT INTO payments (
      user_id,
      plan_id,
      plan_name,
      amount_pkr,
      payment_method,
      sender_number,
      transaction_id,
      screenshot_url,
      status
    ) VALUES (
      ${signup.user.id},
      'weekly',
      'Weekly Pro',
      1499,
      'jazzcash',
      '03016532878',
      'TID_TEST_847291',
      'https://res.cloudinary.com/anp5fflm/image/upload/v1726000000/sample_receipt.png',
      'pending'
    )
    RETURNING id, status, amount_pkr as "amountPkr"
  `;
  console.log("2. Payment record created:", payment.id, "| Status:", payment.status, "| Amount (PKR):", payment.amountPkr);

  // 3. Admin verifies and approves payment
  await db`
    UPDATE payments
    SET 
      status = 'approved',
      admin_notes = 'Verified on JazzCash statement',
      reviewed_at = NOW()
    WHERE id = ${payment.id}
  `;

  // 4. Activate user subscription (+7 days)
  await db`
    UPDATE users
    SET 
      subscription_status = 'active',
      subscription_tier = 'weekly',
      subscription_expires_at = NOW() + INTERVAL '7 days',
      updated_at = NOW()
    WHERE id = ${signup.user.id}
  `;

  // 5. Query user to verify activation
  const [updatedUser] = await db`
    SELECT id, email, role, subscription_tier, subscription_status, subscription_expires_at
    FROM users
    WHERE id = ${signup.user.id}
  `;
  console.log("3. User activated successfully:", {
    email: updatedUser.email,
    status: updatedUser.subscription_status,
    tier: updatedUser.subscription_tier,
    expiresAt: updatedUser.subscription_expires_at,
  });

  console.log("=== End-to-End Neon DB Flow Succeeded ===");
}

testPaymentCycle().catch(console.error);
