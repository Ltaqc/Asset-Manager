
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import nodemailer from "nodemailer";

interface RoomBreakdownItem {
  category: string;
  shortTitle: string;
  capacity: number;
  maxToddlers: number;
  roomCost: number;
}

interface NotificationData {
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
  roomBreakdown?: RoomBreakdownItem[];
  discountAmount?: number;
  prepayment?: number;
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function formatDateLong(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

async function sendEmailNotification(booking: NotificationData) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return;

  const guests: string[] = [];
  if (booking.adults > 0) guests.push(`Взрослые: ${booking.adults}`);
  if (booking.teens > 0) guests.push(`Подростки: ${booking.teens}`);
  if (booking.children > 0) guests.push(`Дети: ${booking.children}`);
  if (booking.toddlers > 0) guests.push(`Малыши: ${booking.toddlers}`);

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const prepayment = booking.prepayment || (nights > 0 ? Math.round(booking.totalPrice / nights) : booking.totalPrice);
  const now = new Date();
  const requestDate = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  const requestTime = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" });

  const rowStyle = `style="border-bottom:1px solid #f0f0f0;"`;
  const labelStyle = `style="padding:10px 12px;color:#888;font-size:14px;white-space:nowrap;vertical-align:top;"`;
  const valueStyle = `style="padding:10px 12px;font-weight:600;font-size:14px;"`;

  let roomBreakdownHtml = "";
  if (booking.roomBreakdown && booking.roomBreakdown.length > 1) {
    const roomRows = booking.roomBreakdown.map(r => {
      const guestInfo = r.maxToddlers > 0
        ? `до ${r.capacity} гостей + ${r.maxToddlers} ${r.maxToddlers === 1 ? "малыш" : "малыша"}`
        : `до ${r.capacity} гостей`;
      return `
        <tr ${rowStyle}>
          <td ${labelStyle}>${r.shortTitle}</td>
          <td ${valueStyle}>
            ${r.category}<br/>
            <span style="color:#888;font-weight:400;font-size:13px;">${guestInfo}</span><br/>
            <span style="color:#888;font-weight:400;font-size:13px;">${formatDateLong(booking.checkIn)} — ${formatDateLong(booking.checkOut)} · ${nights} ${nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей"}</span><br/>
            <span style="color:#2EC4B6;font-weight:700;">${r.roomCost.toLocaleString("ru-RU")} ₽</span>
          </td>
        </tr>`;
    }).join("");

    roomBreakdownHtml = `
      <tr><td colspan="2" style="padding:14px 12px 6px;font-weight:700;font-size:15px;color:#333;border-bottom:2px solid #2EC4B6;">Размещение по номерам</td></tr>
      ${roomRows}`;
  }

  let discountRow = "";
  if (booking.discountAmount && booking.discountAmount > 0) {
    discountRow = `<tr ${rowStyle}><td ${labelStyle}>Скидка раннего бронирования</td><td style="padding:10px 12px;font-weight:600;font-size:14px;color:#16a34a;">−${booking.discountAmount.toLocaleString("ru-RU")} ₽</td></tr>`;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#2EC4B6;padding:24px 20px;border-radius:8px 8px 0 0;">
        <h2 style="color:#ffffff;margin:0;font-size:20px;">Новая заявка на бронирование</h2>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">Сайт AL MARE — ${requestDate}, ${requestTime} (МСК)</p>
      </div>
      <div style="padding:4px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr ${rowStyle}><td ${labelStyle}>Гость</td><td ${valueStyle}>${booking.contactName || "Не указано"}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Телефон</td><td ${valueStyle}>${booking.contactPhone || "Не указан"}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Тип номера</td><td ${valueStyle}>${booking.roomCategory}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Даты</td><td ${valueStyle}>${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Ночей</td><td ${valueStyle}>${nights}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Гости</td><td ${valueStyle}>${guests.join(", ")}</td></tr>
          ${roomBreakdownHtml}
          ${discountRow}
          <tr ${rowStyle}><td ${labelStyle}>Итого</td><td style="padding:10px 12px;font-weight:700;font-size:18px;color:#2EC4B6;">${booking.totalPrice.toLocaleString("ru-RU")} ₽</td></tr>
          <tr><td ${labelStyle}>Предоплата (1 ночь)</td><td ${valueStyle}>${prepayment.toLocaleString("ru-RU")} ₽</td></tr>
        </table>
      </div>
    </div>
  `;

  const transporter = createSmtpTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"AL MARE — заявки с сайта" <${user}>`,
      to: "almare@hotelalmare.ru, Troyan.nastasya@mail.ru",
      subject: `🔔 Новая заявка на бронирование — AL MARE`,
      html,
    });
    console.log("Email notification sent");
  } catch (err) {
    console.error("Email notification failed:", err);
  }
}

function createSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}


async function sendTelegramNotification(booking: NotificationData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const guests: string[] = [];
  if (booking.adults > 0) guests.push(`Взрослые: ${booking.adults}`);
  if (booking.teens > 0) guests.push(`Подростки: ${booking.teens}`);
  if (booking.children > 0) guests.push(`Дети: ${booking.children}`);
  if (booking.toddlers > 0) guests.push(`Малыши: ${booking.toddlers}`);

  const rawPhone = booking.contactPhone || "";
  const phoneDisplay = rawPhone || "Не указан";

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const nightsWord = nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей";

  const lines = [
    `🏨 *Новая заявка на бронирование*`,
    ``,
    `👤 *Гость:* ${booking.contactName || "Не указано"}`,
    `📱 *Телефон:* ${phoneDisplay}`,
    ``,
    `🏠 *Номер:* ${booking.roomCategory}`,
    `📅 *Даты:* ${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)} (${nights} ${nightsWord})`,
    `👥 *Гости:* ${guests.join(", ")}`,
  ];

  if (booking.roomBreakdown && booking.roomBreakdown.length > 1) {
    lines.push(``);
    lines.push(`📋 *Разбивка по номерам:*`);
    for (const r of booking.roomBreakdown) {
      lines.push(`  • ${r.category} — ${r.roomCost.toLocaleString("ru-RU")} ₽`);
    }
  }

  if (booking.discountAmount && booking.discountAmount > 0) {
    lines.push(`🏷 *Скидка:* −${booking.discountAmount.toLocaleString("ru-RU")} ₽`);
  }

  lines.push(`💰 *Итого:* ${booking.totalPrice.toLocaleString("ru-RU")} ₽`);

  if (booking.prepayment) {
    lines.push(`💳 *Предоплата:* ${booking.prepayment.toLocaleString("ru-RU")} ₽`);
  }

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
      const { roomBreakdown, discountAmount, prepayment, ...bookingFields } = req.body;
      const input = api.bookings.create.input.parse(bookingFields);
      const booking = await storage.createBooking(input);

      const notificationData: NotificationData = {
        ...input,
        contactName: input.contactName ?? null,
        contactPhone: input.contactPhone ?? null,
        roomBreakdown: Array.isArray(roomBreakdown) ? roomBreakdown : undefined,
        discountAmount: typeof discountAmount === "number" ? discountAmount : undefined,
        prepayment: typeof prepayment === "number" ? prepayment : undefined,
      };
      sendTelegramNotification(notificationData).catch(() => {});
      sendEmailNotification(notificationData).catch(() => {});

      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      console.error("Booking create failed:", err);

      return res.status(503).json({
        message: "Заявка временно не может быть отправлена. Попробуйте ещё раз чуть позже.",
      });
    }
  });

  return httpServer;
}
