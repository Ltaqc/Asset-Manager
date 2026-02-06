
import { pgTable, text, serial, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomCategory: text("room_category").notNull(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  adults: integer("adults").notNull(),
  teens: integer("teens").notNull(),
  children: integer("children").notNull(),
  toddlers: integer("toddlers").notNull(),
  totalPrice: integer("total_price").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings, {
  checkIn: z.string(),
  checkOut: z.string(),
}).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const roomCategories = [
  "Стандарт с двуспальной кроватью и балконом",
  "Стандарт с раздвижной двуспальной кроватью и балконом",
  "Стандарт семейный с балконом",
  "Джуниор Сьют с балконом",
  "Люкс двухкомнатный без балкона",
  "Люкс семейный, двухкомнатный",
  "Апартаменты, 1 этаж, с выходом на бассейн",
  "Апартаменты, 2 этаж, с видом на бассейн"
] as const;

export const months = ["Июнь", "Июль", "Август", "Сентябрь"] as const;
