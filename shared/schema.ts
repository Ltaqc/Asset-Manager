import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomCategory: text("room_category").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  adults: integer("adults").notNull(),
  teens: integer("teens").notNull(),
  children: integer("children").notNull(),
  toddlers: integer("toddlers").notNull(),
  totalPrice: integer("total_price").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const roomCategories = [
  "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442 \u0441 \u0434\u0432\u0443\u0441\u043f\u0430\u043b\u044c\u043d\u043e\u0439 \u043a\u0440\u043e\u0432\u0430\u0442\u044c\u044e \u0438 \u0431\u0430\u043b\u043a\u043e\u043d\u043e\u043c",
  "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442 \u0441 \u0440\u0430\u0437\u0434\u0432\u0438\u0436\u043d\u043e\u0439 \u0434\u0432\u0443\u0441\u043f\u0430\u043b\u044c\u043d\u043e\u0439 \u043a\u0440\u043e\u0432\u0430\u0442\u044c\u044e \u0438 \u0431\u0430\u043b\u043a\u043e\u043d\u043e\u043c",
  "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u0441 \u0431\u0430\u043b\u043a\u043e\u043d\u043e\u043c",
  "\u0414\u0436\u0443\u043d\u0438\u043e\u0440 \u0421\u044c\u044e\u0442 \u0441 \u0431\u0430\u043b\u043a\u043e\u043d\u043e\u043c",
  "\u041b\u044e\u043a\u0441 \u0434\u0432\u0443\u0445\u043a\u043e\u043c\u043d\u0430\u0442\u043d\u044b\u0439 \u0431\u0435\u0437 \u0431\u0430\u043b\u043a\u043e\u043d\u0430",
  "\u041b\u044e\u043a\u0441 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439, \u0434\u0432\u0443\u0445\u043a\u043e\u043c\u043d\u0430\u0442\u043d\u044b\u0439",
  "\u0410\u043f\u0430\u0440\u0442\u0430\u043c\u0435\u043d\u0442\u044b, 1 \u044d\u0442\u0430\u0436, \u0441 \u0432\u044b\u0445\u043e\u0434\u043e\u043c \u043d\u0430 \u0431\u0430\u0441\u0441\u0435\u0439\u043d",
  "\u0410\u043f\u0430\u0440\u0442\u0430\u043c\u0435\u043d\u0442\u044b, 2 \u044d\u0442\u0430\u0436, \u0441 \u0432\u0438\u0434\u043e\u043c \u043d\u0430 \u0431\u0430\u0441\u0441\u0435\u0439\u043d"
] as const;

export const months = ["\u0418\u044e\u043d\u044c", "\u0418\u044e\u043b\u044c", "\u0410\u0432\u0433\u0443\u0441\u0442", "\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c"] as const;
