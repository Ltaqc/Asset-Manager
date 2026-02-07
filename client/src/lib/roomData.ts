import { roomCategories } from "@shared/schema";
import stdSlidingMain from "@assets/гостевой_дом_АЛЬМАРЕ-105_1770476132083.png";
import stdSlidingTwin from "@assets/ChatGPT_Image_7_февр._2026_г.,_18_26_02_1770478435931.png";
import stdSlidingTv from "@assets/ChatGPT_Image_7_февр._2026_г.,_14_26_30_1770476132078.png";
import stdSlidingDesk from "@assets/ChatGPT_Image_7_февр._2026_г.,_14_21_45_1770476132077.png";
import stdSlidingBath from "@assets/ChatGPT_Image_7_февр._2026_г.,_15_04_47_1770476132081.png";
import stdSlidingShower from "@assets/ChatGPT_Image_7_февр._2026_г.,_15_12_24_1770476132082.png";

export type RoomCategory = typeof roomCategories[number];

export interface RoomInfo {
  cap: number;
  count: number;
  maxToddlers: number;
  prices: Record<number, number>;
  description: string;
  area: number;
  shortTitle: string;
  image: string;
  images?: string[];
}

export const ROOM_DATA: Record<RoomCategory, RoomInfo> = {
  "Стандарт с двуспальной кроватью и балконом": {
    cap: 2, count: 9, maxToddlers: 1,
    prices: { 6: 4600, 7: 5700, 8: 5700, 9: 4600 },
    description: "Светлое пространство для двоих с видом на курортную территорию. Двуспальная кровать, продуманная эргономика и собственный балкон создают идеальные условия для спокойного отдыха у моря.",
    area: 16,
    shortTitle: "Стандарт",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop",
  },
  "Стандарт с раздвижной двуспальной кроватью и балконом": {
    cap: 2, count: 3, maxToddlers: 1,
    prices: { 6: 4600, 7: 5700, 8: 5700, 9: 4600 },
    description: "Тёплое, уютное пространство для спокойного отдыха вдвоём. Раздвижная двуспальная кровать позволяет гибко настроить комфорт, а балкон наполняет номер светом и ощущением курортной свободы.",
    area: 16,
    shortTitle: "Стандарт (раздвижная кровать)",
    image: stdSlidingTwin,
    images: [stdSlidingTwin, stdSlidingMain, stdSlidingTv, stdSlidingDesk, stdSlidingBath, stdSlidingShower],
  },
  "Стандарт семейный с балконом": {
    cap: 3, count: 6, maxToddlers: 1,
    prices: { 6: 7000, 7: 8700, 8: 8700, 9: 7000 },
    description: "Номер для небольшой семьи или компании из трёх гостей. Двуспальная кровать дополнена комфортной дизайнерской софой, а балкон становится приятным продолжением жилого пространства.",
    area: 20,
    shortTitle: "Стандарт семейный",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop",
  },
  "Джуниор Сьют с балконом": {
    cap: 4, count: 3, maxToddlers: 1,
    prices: { 6: 9200, 7: 11500, 8: 11500, 9: 9200 },
    description: "Просторное решение для тех, кому важен воздух и свобода движения. Раздвижная двуспальная кровать и мягкий диван формируют две зоны — для сна и дневного отдыха. Балкон наполняет номер естественным светом и морским настроением.",
    area: 28,
    shortTitle: "Джуниор Сьют",
    image: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?w=800&auto=format&fit=crop",
  },
  "Люкс двухкомнатный без балкона": {
    cap: 4, count: 3, maxToddlers: 1,
    prices: { 6: 9200, 7: 11500, 8: 11500, 9: 9200 },
    description: "Две отдельные комнаты — спальня и гостиная — обеспечивают приватность и удобство для пар или семей. Спальня с двуспальной кроватью отделена от зоны отдыха с мягким диваном, что позволяет каждому найти своё пространство.",
    area: 25,
    shortTitle: "Люкс двухкомнатный",
    image: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?w=800&auto=format&fit=crop",
  },
  "Люкс семейный, двухкомнатный": {
    cap: 5, count: 1, maxToddlers: 1,
    prices: { 6: 11500, 7: 14500, 8: 14500, 9: 11500 },
    description: "Самый просторный номер для семейного отдыха с детьми. Отдельная спальня с двуспальной кроватью и детской кроваткой, гостиная с дизайнерской софой и раскладным диваном, а также балкон с видом на территорию курорта.",
    area: 41,
    shortTitle: "Люкс семейный",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
  },
  "Апартаменты, 1 этаж, с выходом на бассейн": {
    cap: 6, count: 1, maxToddlers: 2,
    prices: { 6: 14000, 7: 17500, 8: 17500, 9: 14000 },
    description: "Полноценное курортное жильё с двумя спальнями, гостиной и собственной кухней-столовой. Прямой выход к бассейну превращает каждое утро в начало идеального дня — без лифтов, лестниц и лишних шагов.",
    area: 55,
    shortTitle: "Апартаменты (1 этаж)",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
  },
  "Апартаменты, 2 этаж, с видом на бассейн": {
    cap: 6, count: 1, maxToddlers: 2,
    prices: { 6: 14000, 7: 17500, 8: 17500, 9: 14000 },
    description: "Панорамный вид на бассейн и территорию курорта с двух балконов. Две отдельные спальни, гостиная и кухня-столовая создают ощущение собственной резиденции — с полным комфортом и приватностью для всей семьи.",
    area: 52,
    shortTitle: "Апартаменты (2 этаж)",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
  },
};

export const EARLY_BOOKING_DAYS = 30;
export const EARLY_BOOKING_DISCOUNT = 0.10;

export function isEarlyBooking(checkIn: string): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const inDate = new Date(checkIn);
  const diffMs = inDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > EARLY_BOOKING_DAYS;
}

export function applyEarlyDiscount(total: number): number {
  return Math.round(total * (1 - EARLY_BOOKING_DISCOUNT));
}

export const FOOD_RATES = {
  adult: 4500,
  teen: 4500,
  child: 3000,
  toddler: 0,
};

export function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU") + " \u20BD";
}

export function getMinPrice(category: RoomCategory): number {
  const prices = Object.values(ROOM_DATA[category].prices);
  return Math.min(...prices);
}

export function getDefaultCheckIn(): string {
  const now = new Date();
  const year = now.getFullYear();
  const june1 = new Date(year, 5, 1);
  if (now < june1) return `${year}-06-15`;
  if (now.getMonth() >= 5 && now.getMonth() <= 8) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }
  return `${year + 1}-06-15`;
}

export function getDefaultCheckOut(checkIn: string): string {
  const d = new Date(checkIn);
  d.setDate(d.getDate() + 5);
  return d.toISOString().split("T")[0];
}

export function nightsLabel(n: number): string {
  if (n === 1) return "ночь";
  if (n >= 2 && n <= 4) return "ночи";
  return "ночей";
}

export interface CalcResult {
  nights: number;
  total: number;
  perNight: number;
}

export interface CalcError {
  error: string;
}

export function calculateStay(
  category: RoomCategory,
  checkIn: string,
  checkOut: string,
  adults: number,
  teens: number,
  children: number,
): CalcResult | CalcError | null {
  if (!checkIn || !checkOut) return null;

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffMs = outDate.getTime() - inDate.getTime();
  const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (nights < 1) return null;

  const roomInfo = ROOM_DATA[category];
  let roomCost = 0;

  for (let i = 0; i < nights; i++) {
    const d = new Date(inDate);
    d.setDate(d.getDate() + i);
    const monthNum = d.getMonth() + 1;
    if (monthNum < 6 || monthNum > 9) {
      return { error: "Бронирование доступно только в летний сезон (июнь — сентябрь)" };
    }
    const rate = roomInfo.prices[monthNum];
    if (!rate) return { error: "Нет данных о ценах для выбранного месяца" };
    roomCost += rate;
  }

  const foodPerNight = (adults * FOOD_RATES.adult) + (teens * FOOD_RATES.teen) + (children * FOOD_RATES.child);
  const foodCost = foodPerNight * nights;
  const total = roomCost + foodCost;
  const perNight = Math.round(total / nights);

  return { nights, total, perNight };
}

export function isRoomSuitable(category: RoomCategory, adults: number, teens: number, childrenCount: number, toddlers: number): boolean {
  const info = ROOM_DATA[category];
  if (toddlers > info.maxToddlers) return false;
  const mainGuests = adults + teens + childrenCount;
  return mainGuests <= info.cap;
}
