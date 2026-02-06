
import { db } from "./db";
import { bookings, type InsertBooking, type Booking } from "@shared/schema";

export interface IStorage {
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
}

export const storage = new DatabaseStorage();
