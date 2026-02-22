
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import nodemailer from "nodemailer";

async function sendEmailNotification(booking: {
  roomCategory: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  teens: number;
  children: number;
  toddlers: number;
  totalPrice: number;
  contactName: string | null;
  contactPhone: string | null;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return;

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}.${m}.${y}`;
  };

  const guests: string[] = [];
  if (booking.adults > 0) guests.push(`Взрослые: ${booking.adults}`);
  if (booking.teens > 0) guests.push(`Подростки: ${booking.teens}`);
  if (booking.children > 0) guests.push(`Дети: ${booking.children}`);
  if (booking.toddlers > 0) guests.push(`Малыши: ${booking.toddlers}`);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#2EC4B6;margin-bottom:20px;">Новая заявка на бронирование</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;">Гость:</td><td style="padding:8px 0;font-weight:600;">${booking.contactName || "Не указано"}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Телефон:</td><td style="padding:8px 0;font-weight:600;">${booking.contactPhone || "Не указан"}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Номер:</td><td style="padding:8px 0;font-weight:600;">${booking.roomCategory}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Даты:</td><td style="padding:8px 0;font-weight:600;">${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Гости:</td><td style="padding:8px 0;font-weight:600;">${guests.join(", ")}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Итого:</td><td style="padding:8px 0;font-weight:600;color:#2EC4B6;font-size:18px;">${booking.totalPrice.toLocaleString("ru-RU")} ₽</td></tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"AL MARE" <no-reply@hotelalmare.ru>`,
      to: "almare@hotelalmare.ru",
      subject: `Бронирование: ${booking.contactName || "Гость"} — ${booking.roomCategory}`,
      html,
    });
    console.log("Email notification sent");
  } catch (err) {
    console.error("Email notification failed:", err);
  }
}

async function sendTelegramNotification(booking: {
  roomCategory: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  teens: number;
  children: number;
  toddlers: number;
  totalPrice: number;
  contactName: string | null;
  contactPhone: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}.${m}.${y}`;
  };

  const guests: string[] = [];
  if (booking.adults > 0) guests.push(`Взрослые: ${booking.adults}`);
  if (booking.teens > 0) guests.push(`Подростки: ${booking.teens}`);
  if (booking.children > 0) guests.push(`Дети: ${booking.children}`);
  if (booking.toddlers > 0) guests.push(`Малыши: ${booking.toddlers}`);

  const rawPhone = booking.contactPhone || "";
  const phoneDisplay = rawPhone || "Не указан";

  const lines = [
    `🏨 *Новая заявка на бронирование*`,
    ``,
    `👤 *Гость:* ${booking.contactName || "Не указано"}`,
    `📱 *Телефон:* ${phoneDisplay}`,
    ``,
    `🏠 *Номер:* ${booking.roomCategory}`,
    `📅 *Даты:* ${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}`,
    `👥 *Гости:* ${guests.join(", ")}`,
    `💰 *Итого:* ${booking.totalPrice.toLocaleString("ru-RU")} ₽`,
  ];

  const text = lines.join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
    const result = await response.json();
    if (!result.ok) {
      console.error("Telegram API error:", result);
    } else {
      console.log("Telegram notification sent, message_id:", result.result?.message_id);
    }
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.bookings.create.path, async (req, res) => {
    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);

      const notificationData = {
        ...input,
        contactName: input.contactName ?? null,
        contactPhone: input.contactPhone ?? null,
      };
      sendTelegramNotification(notificationData).catch(() => {});
      sendEmailNotification(notificationData).catch(() => {});

      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
