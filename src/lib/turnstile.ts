/**
 * Server-side Cloudflare Turnstile token verification.
 * Call this at the top of any public server action that accepts a Turnstile token.
 *
 * In local development (TURNSTILE_SECRET_KEY not set), the check is bypassed so
 * the form continues to work without a challenge widget.
 */
export async function verifyTurnstileToken(
  token?: string,
  ip?: string
): Promise<{ success: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Bypass in dev if secret is not configured
  if (!secret) return { success: true };

  if (!token) {
    return { success: false, reason: "Missing Turnstile token" };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      return { success: false, reason: "Turnstile verification service error" };
    }

    const data = await res.json();
    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      reason: data["error-codes"]?.join(", ") ?? "Turnstile verification failed",
    };
  } catch {
    return { success: false, reason: "Turnstile network error" };
  }
}
