import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api } from "@shared/routes";
import { storage } from "./storage";
import {
  sendBookingNotifications,
  type NotificationData,
  type RoomBreakdownItem,
} from "./notifications";

const notificationExtrasSchema = z.object({
  roomBreakdown: z.array(z.object({
    category: z.string().max(300),
    shortTitle: z.string().max(300),
    capacity: z.number().int().min(0).max(100),
    maxToddlers: z.number().int().min(0).max(100),
    roomCost: z.number().int().min(0),
  })).max(20).optional(),
  discountAmount: z.number().int().min(0).optional(),
  prepayment: z.number().int().min(0).optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post(api.bookings.create.path, async (req, res) => {
    let input: z.infer<typeof api.bookings.create.input>;
    let extras: {
      roomBreakdown?: RoomBreakdownItem[];
      discountAmount?: number;
      prepayment?: number;
    };

    try {
      const {
        roomBreakdown,
        discountAmount,
        prepayment,
        ...bookingFields
      } = req.body;

      input = api.bookings.create.input.parse(bookingFields);
      extras = notificationExtrasSchema.parse({
        roomBreakdown,
        discountAmount,
        prepayment,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }

    let booking;
    try {
      booking = await storage.createBooking(input);
    } catch (err) {
      console.error("Booking persistence failed:", err);
      return res.status(503).json({
        message: "Заявка временно не может быть сохранена. Попробуйте ещё раз чуть позже.",
      });
    }

    const notificationData: NotificationData = {
      ...input,
      contactName: input.contactName ?? null,
      contactPhone: input.contactPhone ?? null,
      ...extras,
    };

    try {
      const deliveredChannels = await sendBookingNotifications(notificationData);
      console.log(
        `Booking ${booking.id} notification delivered via ${deliveredChannels.join(", ")}`,
      );
    } catch (err) {
      console.error(`Booking ${booking.id} notification failed:`, err);
      return res.status(503).json({
        message: "Заявка сохранена, но уведомление менеджеру не доставлено. Позвоните нам по номеру +7 (918) 471-03-74.",
      });
    }

    return res.status(201).json(booking);
  });

  return httpServer;
}
