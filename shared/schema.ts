
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomCategory: text("room_category").notNull(),
  month: text("month").notNull(),
  nights: integer("nights").notNull(),
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
  createdAt: true 
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const roomCategories = [
  "Standard (Double, Balcony)",
  "Standard (Sliding Double, Balcony)",
  "Standard Family (Balcony)",
  "Junior Suite (Balcony)",
  "Suite 2-room (No Balcony)",
  "Suite Family 2-room",
  "Apartments 1st floor (Pool access)",
  "Apartments 2nd floor (Pool view)"
] as const;

export const months = ["June", "July", "August", "September"] as const;
