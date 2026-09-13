export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  /**
   * Send transactional email using Resend API or development log fallback
   */
  static async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || "HireBoost AI <notifications@hireboost.ai>";

    if (resendApiKey && resendApiKey.trim() !== "" && !resendApiKey.includes("re_...")) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey.trim()}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text || options.html.replace(/<[^>]+>/g, ""),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, messageId: data.id };
        } else {
          const errText = await response.text();
          console.error("[EmailService Resend Error]:", response.status, errText);
          return { success: false, error: `Resend API returned status ${response.status}` };
        }
      } catch (err) {
        console.error("[EmailService Failure]:", err);
        return { success: false, error: err instanceof Error ? err.message : "Email send failed" };
      }
    }

    // Development Safe Logging Mode
    console.log("==========================================");
    console.log("[EmailService Dev Mode]");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content:\n${options.text || options.html}`);
    console.log("==========================================");

    return {
      success: true,
      messageId: `dev_msg_${Date.now()}`,
    };
  }
}
