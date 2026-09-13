import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";

export class AuditService {
  /**
   * Log security or sensitive user events
   */
  static async log(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from("audit_logs").insert({
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          metadata: metadata || {},
          ip_address: ipAddress || null,
        });
      } catch (err) {
        console.warn("[AuditService] Error logging audit event:", err);
      }
    } else {
      console.log(`[AuditLog] user=${userId} action=${action} entity=${entityType}:${entityId}`);
    }
  }
}
