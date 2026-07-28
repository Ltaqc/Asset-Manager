import nodemailer from "nodemailer";
import { request as httpsRequest } from "https";

export interface RoomBreakdownItem {
  category: string;
  shortTitle: string;
  capacity: number;
  maxToddlers: number;
  roomCost: number;
}

export interface NotificationData {
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

type NotificationChannel = "email" | "telegram";

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

function formatDateLong(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getGuestLines(booking: NotificationData) {
  const guests: string[] = [];
  if (booking.adults > 0) guests.push(`Взрослые: ${booking.adults}`);
  if (booking.teens > 0) guests.push(`Подростки: ${booking.teens}`);
  if (booking.children > 0) guests.push(`Дети: ${booking.children}`);
  if (booking.toddlers > 0) guests.push(`Малыши: ${booking.toddlers}`);
  return guests;
}

function getNights(booking: NotificationData) {
  const checkInDate = new Date(`${booking.checkIn}T00:00:00`);
  const checkOutDate = new Date(`${booking.checkOut}T00:00:00`);
  return Math.round(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getEmailConfig() {
  if (process.env.BOOKING_EMAIL_ENABLED?.toLowerCase() === "false") {
    return null;
  }

  const host = process.env.SMTP_HOST?.trim();
  // Authenticated Mail.ru SMTP requires the envelope sender to match the
  // authenticated mailbox, so prefer SMTP_USER over an optional alias.
  const from = (process.env.SMTP_USER || process.env.SMTP_FROM)?.trim();
  const recipients = (process.env.BOOKING_EMAIL_TO || "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  if (!host || !from || recipients.length === 0) return null;

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if ((user && !pass) || (!user && pass)) {
    throw new Error("SMTP_USER and SMTP_PASS must be configured together");
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT || "465"),
    from,
    recipients,
    user,
    pass,
  };
}

function createEmailHtml(booking: NotificationData) {
  const guests = getGuestLines(booking);
  const nights = getNights(booking);
  const prepayment =
    booking.prepayment
    || (nights > 0 ? Math.round(booking.totalPrice / nights) : booking.totalPrice);
  const now = new Date();
  const requestDate = now.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Moscow",
  });
  const requestTime = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  });

  const rowStyle = `style="border-bottom:1px solid #f0f0f0;"`;
  const labelStyle = `style="padding:10px 12px;color:#888;font-size:14px;white-space:nowrap;vertical-align:top;"`;
  const valueStyle = `style="padding:10px 12px;font-weight:600;font-size:14px;"`;

  let roomBreakdownHtml = "";
  if (booking.roomBreakdown && booking.roomBreakdown.length > 1) {
    const roomRows = booking.roomBreakdown.map((room) => {
      const guestInfo = room.maxToddlers > 0
        ? `до ${room.capacity} гостей + ${room.maxToddlers} ${room.maxToddlers === 1 ? "малыш" : "малыша"}`
        : `до ${room.capacity} гостей`;

      return `
        <tr ${rowStyle}>
          <td ${labelStyle}>${escapeHtml(room.shortTitle)}</td>
          <td ${valueStyle}>
            ${escapeHtml(room.category)}<br/>
            <span style="color:#888;font-weight:400;font-size:13px;">${guestInfo}</span><br/>
            <span style="color:#888;font-weight:400;font-size:13px;">${formatDateLong(booking.checkIn)} — ${formatDateLong(booking.checkOut)} · ${nights} ${nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей"}</span><br/>
            <span style="color:#2EC4B6;font-weight:700;">${room.roomCost.toLocaleString("ru-RU")} ₽</span>
          </td>
        </tr>`;
    }).join("");

    roomBreakdownHtml = `
      <tr><td colspan="2" style="padding:14px 12px 6px;font-weight:700;font-size:15px;color:#333;border-bottom:2px solid #2EC4B6;">Размещение по номерам</td></tr>
      ${roomRows}`;
  }

  const discountRow =
    booking.discountAmount && booking.discountAmount > 0
      ? `<tr ${rowStyle}><td ${labelStyle}>Скидка раннего бронирования</td><td style="padding:10px 12px;font-weight:600;font-size:14px;color:#16a34a;">−${booking.discountAmount.toLocaleString("ru-RU")} ₽</td></tr>`
      : "";

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#2EC4B6;padding:24px 20px;border-radius:8px 8px 0 0;">
        <h2 style="color:#ffffff;margin:0;font-size:20px;">Новая заявка на бронирование</h2>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">Сайт AL MARE — ${requestDate}, ${requestTime} (МСК)</p>
      </div>
      <div style="padding:4px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr ${rowStyle}><td ${labelStyle}>Гость</td><td ${valueStyle}>${escapeHtml(booking.contactName || "Не указано")}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Телефон</td><td ${valueStyle}>${escapeHtml(booking.contactPhone || "Не указан")}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Тип номера</td><td ${valueStyle}>${escapeHtml(booking.roomCategory)}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Даты</td><td ${valueStyle}>${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Ночей</td><td ${valueStyle}>${nights}</td></tr>
          <tr ${rowStyle}><td ${labelStyle}>Гости</td><td ${valueStyle}>${guests.join(", ")}</td></tr>
          ${roomBreakdownHtml}
          ${discountRow}
          <tr ${rowStyle}><td ${labelStyle}>Итого</td><td style="padding:10px 12px;font-weight:700;font-size:18px;color:#2EC4B6;">${booking.totalPrice.toLocaleString("ru-RU")} ₽</td></tr>
          <tr><td ${labelStyle}>Предоплата (1 ночь)</td><td ${valueStyle}>${prepayment.toLocaleString("ru-RU")} ₽</td></tr>
        </table>
      </div>
    </div>`;
}

async function sendEmailNotification(booking: NotificationData) {
  const config = getEmailConfig();
  if (!config) throw new Error("Email notification is not configured");

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    name: process.env.SMTP_HELO_NAME || "hotelalmare.ru",
    auth: config.user && config.pass
      ? { user: config.user, pass: config.pass }
      : undefined,
  });

  try {
    const info = await transporter.sendMail({
      from: `"AL MARE — заявки с сайта" <${config.from}>`,
      to: config.recipients,
      subject: "🔔 Новая заявка на бронирование — AL MARE",
      html: createEmailHtml(booking),
    });

    if (!info.accepted.length) {
      throw new Error("SMTP server did not accept any notification recipients");
    }

    console.log(
      `Email notification accepted for ${info.accepted.length} recipient(s); rejected: ${info.rejected.length}`,
    );
  } finally {
    transporter.close();
  }
}

async function sendTelegramNotification(booking: NotificationData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram notification is not configured");

  const guests = getGuestLines(booking);
  const nights = getNights(booking);
  const nightsWord = nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей";

  const lines = [
    "🏨 Новая заявка на бронирование",
    "",
    `👤 Гость: ${booking.contactName || "Не указано"}`,
    `📱 Телефон: ${booking.contactPhone || "Не указан"}`,
    "",
    `🏠 Номер: ${booking.roomCategory}`,
    `📅 Даты: ${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)} (${nights} ${nightsWord})`,
    `👥 Гости: ${guests.join(", ")}`,
  ];

  if (booking.roomBreakdown && booking.roomBreakdown.length > 1) {
    lines.push("", "📋 Разбивка по номерам:");
    for (const room of booking.roomBreakdown) {
      lines.push(`  • ${room.category} — ${room.roomCost.toLocaleString("ru-RU")} ₽`);
    }
  }

  if (booking.discountAmount && booking.discountAmount > 0) {
    lines.push(`🏷 Скидка: −${booking.discountAmount.toLocaleString("ru-RU")} ₽`);
  }

  lines.push(`💰 Итого: ${booking.totalPrice.toLocaleString("ru-RU")} ₽`);
  if (booking.prepayment) {
    lines.push(`💳 Предоплата: ${booking.prepayment.toLocaleString("ru-RU")} ₽`);
  }

  const result = await telegramApiRequest(token, "sendMessage", {
    chat_id: chatId,
    text: lines.join("\n"),
  }) as {
    ok?: boolean;
    description?: string;
    result?: { message_id?: number };
  };

  if (!result.ok) {
    throw new Error(`Telegram API rejected notification: ${result.description || "unknown error"}`);
  }

  console.log(`Telegram notification sent, message_id: ${result.result?.message_id}`);
}

function telegramApiRequest(
  token: string,
  method: string,
  body: Record<string, unknown>,
) {
  const apiHostname = "api.telegram.org";
  const connectHostname = process.env.TELEGRAM_API_IP?.trim() || apiHostname;
  const payload = JSON.stringify(body);

  return new Promise<unknown>((resolve, reject) => {
    const request = httpsRequest({
      hostname: connectHostname,
      servername: apiHostname,
      port: 443,
      path: `/bot${token}/${method}`,
      method: "POST",
      headers: {
        Host: apiHostname,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      timeout: 15_000,
    }, (response) => {
      let responseBody = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        responseBody += chunk;
      });
      response.on("end", () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch {
          reject(new Error(`Telegram API returned HTTP ${response.statusCode} with invalid JSON`));
        }
      });
    });

    request.on("timeout", () => {
      request.destroy(new Error("Telegram API connection timed out"));
    });
    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

export async function sendBookingNotifications(
  booking: NotificationData,
): Promise<NotificationChannel[]> {
  const attempts: Array<{
    channel: NotificationChannel;
    run: () => Promise<void>;
  }> = [];

  if (getEmailConfig()) {
    attempts.push({ channel: "email", run: () => sendEmailNotification(booking) });
  }
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    attempts.push({ channel: "telegram", run: () => sendTelegramNotification(booking) });
  }

  if (attempts.length === 0) {
    throw new Error("No booking notification channel is configured");
  }

  const results = await Promise.allSettled(attempts.map((attempt) => attempt.run()));
  const delivered = results.flatMap((result, index) => {
    if (result.status === "fulfilled") return [attempts[index].channel];
    console.error(`${attempts[index].channel} notification failed:`, result.reason);
    return [];
  });

  if (delivered.length === 0) {
    throw new Error("All booking notification channels failed");
  }

  return delivered;
}
