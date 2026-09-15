import { getDb } from "../db/neon";
import type { SupportTicket } from "@/types/database";
import { notificationService } from "./notification-service";

const mockTickets: SupportTicket[] = [
  {
    id: "tkt_01",
    userId: "usr_mock_01",
    userName: "Alex Morgan",
    userEmail: "alex.morgan@example.com",
    subject: "Inquiry about JazzCash activation speed",
    category: "billing",
    message: "Hi! I submitted my JazzCash transaction ID 0982347123 via payment proof upload. How long does admin verification usually take?",
    status: "resolved",
    adminResponse: "Hello Alex! Your JazzCash payment proof has been verified and your account is active. Thank you!",
    respondedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export class SupportService {
  async getTickets(userId?: string): Promise<SupportTicket[]> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    if (userId && isUUID(userId)) {
      try {
        const db = getDb();
        const rows = await db`
          SELECT 
            id, user_id as "userId", user_name as "userName", user_email as "userEmail",
            subject, category, message, status, admin_response as "adminResponse",
            responded_at as "respondedAt", created_at as "createdAt", updated_at as "updatedAt"
          FROM support_tickets
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            userName: r.userName,
            userEmail: r.userEmail,
            subject: r.subject,
            category: r.category,
            message: r.message,
            status: r.status,
            adminResponse: r.adminResponse,
            respondedAt: r.respondedAt ? new Date(r.respondedAt).toISOString() : null,
            createdAt: new Date(r.createdAt).toISOString(),
            updatedAt: new Date(r.updatedAt).toISOString(),
          }));
        }
      } catch (err) {
        console.warn("[SupportService] Error querying user tickets from Neon DB:", err);
      }
    }
    return mockTickets.filter((t) => !userId || t.userId === userId);
  }

  async getAllTicketsForAdmin(): Promise<SupportTicket[]> {
    try {
      const db = getDb();
      const rows = await db`
        SELECT 
          id, user_id as "userId", user_name as "userName", user_email as "userEmail",
          subject, category, message, status, admin_response as "adminResponse",
          responded_at as "respondedAt", created_at as "createdAt", updated_at as "updatedAt"
        FROM support_tickets
        ORDER BY created_at DESC
      `;
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          userId: r.userId,
          userName: r.userName,
          userEmail: r.userEmail,
          subject: r.subject,
          category: r.category,
          message: r.message,
          status: r.status,
          adminResponse: r.adminResponse,
          respondedAt: r.respondedAt ? new Date(r.respondedAt).toISOString() : null,
          createdAt: new Date(r.createdAt).toISOString(),
          updatedAt: new Date(r.updatedAt).toISOString(),
        }));
      }
    } catch (err) {
      console.warn("[SupportService] Error querying all tickets from Neon DB:", err);
    }
    return [...mockTickets];
  }

  async createTicket(
    data: {
      subject: string;
      category: SupportTicket["category"];
      message: string;
    },
    userId: string,
    userName?: string,
    userEmail?: string
  ): Promise<SupportTicket> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    const newId = `tkt_${Date.now().toString(36)}`;
    const ticket: SupportTicket = {
      id: newId,
      userId,
      userName: userName || "Candidate",
      userEmail: userEmail || "candidate@example.com",
      subject: data.subject,
      category: data.category,
      message: data.message,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isUUID(userId)) {
      try {
        const db = getDb();
        await db`
          INSERT INTO support_tickets (
            id, user_id, user_name, user_email, subject, category, message, status, created_at, updated_at
          ) VALUES (
            ${newId}, ${userId}, ${ticket.userName}, ${ticket.userEmail}, ${ticket.subject}, ${ticket.category}, ${ticket.message}, 'open', NOW(), NOW()
          )
        `;
      } catch (err) {
        console.warn("[SupportService] Error inserting ticket into Neon DB:", err);
      }
    }

    mockTickets.unshift(ticket);
    return ticket;
  }

  async respondToTicket(
    ticketId: string,
    adminResponse: string,
    status: SupportTicket["status"] = "resolved"
  ): Promise<SupportTicket | null> {
    const now = new Date().toISOString();

    // Check DB
    try {
      const db = getDb();
      const rows = await db`
        UPDATE support_tickets
        SET 
          admin_response = ${adminResponse},
          status = ${status},
          responded_at = NOW(),
          updated_at = NOW()
        WHERE id = ${ticketId}
        RETURNING user_id as "userId", subject
      `;

      if (rows && rows.length > 0) {
        const targetUserId = rows[0].userId;
        const subject = rows[0].subject;

        // Automatically create a notification for the user!
        await notificationService.createNotification({
          userId: targetUserId,
          title: `Support Ticket Updated: "${subject}"`,
          message: adminResponse.slice(0, 120),
          type: "info",
          link: "/dashboard/support",
        });
      }
    } catch (err) {
      console.warn("[SupportService] Error updating ticket in Neon DB:", err);
    }

    // In-memory fallback
    const tkt = mockTickets.find((t) => t.id === ticketId);
    if (tkt) {
      tkt.adminResponse = adminResponse;
      tkt.status = status;
      tkt.respondedAt = now;
      tkt.updatedAt = now;

      await notificationService.createNotification({
        userId: tkt.userId,
        title: `Support Ticket Updated: "${tkt.subject}"`,
        message: adminResponse.slice(0, 120),
        type: "info",
        link: "/dashboard/support",
      });

      return tkt;
    }

    return null;
  }
}

export const supportService = new SupportService();
