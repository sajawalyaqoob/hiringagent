import { getDb } from "../db/neon";
import type { Notification } from "@/types/database";

const mockNotifications: Notification[] = [
  {
    id: "notif_01",
    userId: "usr_mock_01",
    title: "Groq AI Career Analysis Ready",
    message: "Your profile has been evaluated for domain compatibility and ATS scoring.",
    type: "info",
    isRead: false,
    link: "/dashboard/profile",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "notif_02",
    userId: "usr_mock_01",
    title: "Executive CV Studio Features Unlocked",
    message: "Generate customized resumes tailored specifically for any company and job role.",
    type: "success",
    isRead: false,
    link: "/dashboard/create",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export class NotificationService {
  async getNotifications(userId?: string): Promise<Notification[]> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    if (userId && isUUID(userId)) {
      try {
        const db = getDb();
        const rows = await db`
          SELECT 
            id, user_id as "userId", title, message, type, is_read as "isRead", link, created_at as "createdAt"
          FROM user_notifications
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        `;

        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            title: r.title,
            message: r.message,
            type: r.type,
            isRead: Boolean(r.isRead),
            link: r.link,
            createdAt: new Date(r.createdAt).toISOString(),
          }));
        }
      } catch (err) {
        console.warn("[NotificationService] Error querying user notifications from Neon DB:", err);
      }
    }
    return mockNotifications.filter((n) => !userId || n.userId === userId);
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: Notification["type"];
    link?: string;
  }): Promise<Notification> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    const newId = `notif_${Date.now().toString(36)}`;
    const notif: Notification = {
      id: newId,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "info",
      isRead: false,
      link: data.link,
      createdAt: new Date().toISOString(),
    };

    if (isUUID(data.userId)) {
      try {
        const db = getDb();
        await db`
          INSERT INTO user_notifications (
            id, user_id, title, message, type, is_read, link, created_at
          ) VALUES (
            ${newId}, ${data.userId}, ${data.title}, ${data.message}, ${notif.type}, false, ${data.link || null}, NOW()
          )
        `;
      } catch (err) {
        console.warn("[NotificationService] Error inserting notification into Neon DB:", err);
      }
    }

    mockNotifications.unshift(notif);
    return notif;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const db = getDb();
      await db`UPDATE user_notifications SET is_read = true WHERE id = ${notificationId}`;
    } catch {
      // ignore
    }

    const target = mockNotifications.find((n) => n.id === notificationId);
    if (target) {
      target.isRead = true;
      return true;
    }
    return false;
  }
}

export const notificationService = new NotificationService();
