import { mkdir, readFile, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

const siteUrl = process.env.BOOKING_MONITOR_URL || "https://hotel-almare.ru";
const timeZone = "Europe/Moscow";
const stateDirectory =
  process.env.BOOKING_MONITOR_STATE_DIR || "/var/lib/almare-booking-monitor";

const scheduledDates = [
  "2026-07-29",
  "2026-07-30",
  "2026-07-31",
  "2026-08-01",
  "2026-08-02",
  "2026-08-03",
  "2026-08-04",
  "2026-08-05",
  "2026-08-06",
  "2026-08-07",
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const now = new Date();
const runDate = formatDate(now);
const runNumber = scheduledDates.indexOf(runDate) + 1;

if (runNumber === 0) {
  console.log(`No AL MARE booking-form check scheduled for ${runDate}.`);
  process.exit(0);
}

await mkdir(stateDirectory, { recursive: true });
const stateFile = path.join(stateDirectory, `${runDate}.sent`);

if (await fileExists(stateFile)) {
  const previousResult = await readFile(stateFile, "utf8");
  console.log(`AL MARE booking-form check already completed: ${previousResult.trim()}`);
  process.exit(0);
}

const checkInDate = new Date(now);
checkInDate.setUTCDate(checkInDate.getUTCDate() + 30);
const checkOutDate = new Date(checkInDate);
checkOutDate.setUTCDate(checkOutDate.getUTCDate() + 1);

const payload = {
  roomCategory: "Стандарт с двуспальной кроватью и балконом",
  checkIn: formatDate(checkInDate),
  checkOut: formatDate(checkOutDate),
  adults: 2,
  teens: 0,
  children: 0,
  toddlers: 0,
  totalPrice: 1,
  contactName: `АВТОТЕСТ ФОРМЫ САЙТА ${runNumber}/10 — НЕ ОБРАБАТЫВАТЬ`,
  contactPhone: "+7 (900) 000-00-00",
};

const endpoint = new URL("/api/bookings", siteUrl);
const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "AL-MARE-booking-form-monitor/1.0",
  },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(30_000),
});

const responseText = await response.text();

if (response.status !== 201) {
  throw new Error(
    `Booking form returned HTTP ${response.status}: ${responseText.slice(0, 500)}`,
  );
}

let bookingId = "unknown";
try {
  bookingId = String(JSON.parse(responseText).id ?? "unknown");
} catch {
  // HTTP 201 is the authoritative success condition.
}

const result = `${runDate} run=${runNumber}/10 booking_id=${bookingId}`;
await writeFile(stateFile, `${result}\n`, { encoding: "utf8", mode: 0o600 });
console.log(`AL MARE booking-form check succeeded: ${result}`);
