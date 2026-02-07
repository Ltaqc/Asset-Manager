import { roomCategories } from "@shared/schema";

export type RoomCategory = typeof roomCategories[number];

export interface RoomInfo {
  cap: number;
  count: number;
  maxToddlers: number;
  prices: Record<number, number>;
  description: string;
  shortTitle: string;
  image: string;
}

export const ROOM_DATA: Record<RoomCategory, RoomInfo> = {
  "Стандарт с двуспальной кроватью и балконом": {
    cap: 2, count: 9, maxToddlers: 1,
    prices: { 6: 4600, 7: 5700, 8: 5700, 9: 4600 },
    description: "Уютный номер площадью 16 м², рассчитанный на комфортное проживание двух гостей. В номере предусмотрена двуспальная кровать, а балкон добавляет ощущение воздуха и курортного настроения.",
    shortTitle: "Стандарт",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop",
  },
  "Стандарт с раздвижной двуспальной кроватью и балконом": {
    cap: 2, count: 3, maxToddlers: 1,
    prices: { 6: 4600, 7: 5700, 8: 5700, 9: 4600 },
    description: "Уютный номер площадью 16 м², рассчитанный на комфортное проживание двух гостей. В номере предусмотрена двуспальная раздвижная кровать, а балкон добавляет ощущение воздуха и курортного настроения.",
    shortTitle: "Стандарт (раздвижная кровать)",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop",
  },
  "Стандарт семейный с балконом": {
    cap: 3, count: 6, maxToddlers: 1,
    prices: { 6: 7000, 7: 8700, 8: 8700, 9: 7000 },
    description: "Однокомнатный номер площадью 20 м², подходящий для комфортного размещения до трёх гостей. В номере предусмотрена удобная зона отдыха с мягкой софой и выход на балкон, создающий дополнительное пространство для отдыха.",
    shortTitle: "Стандарт семейный",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop",
  },
  "Джуниор Сьют с балконом": {
    cap: 4, count: 3, maxToddlers: 1,
    prices: { 6: 9200, 7: 11500, 8: 11500, 9: 9200 },
    description: "Просторный однокомнатный номер площадью 28 м², созданный для комфортного отдыха до четырёх гостей. В номере расположена двуспальная раздвижная кровать и диван для отдыха, а балкон наполняет пространство светом и ощущением курорта.",
    shortTitle: "Джуниор Сьют",
    image: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?w=800&auto=format&fit=crop",
  },
  "Люкс двухкомнатный без балкона": {
    cap: 4, count: 3, maxToddlers: 1,
    prices: { 6: 9200, 7: 11500, 8: 11500, 9: 9200 },
    description: "Уютный двухкомнатный номер площадью 25 м² для размещения до четырёх гостей. Номер включает отдельную спальню с двуспальной кроватью и гостиную с комфортным диваном, обеспечивая удобное зонирование для отдыха и сна.",
    shortTitle: "Люкс двухкомнатный",
    image: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?w=800&auto=format&fit=crop",
  },
  "Люкс семейный, двухкомнатный": {
    cap: 5, count: 1, maxToddlers: 1,
    prices: { 6: 11500, 7: 14500, 8: 14500, 9: 11500 },
    description: "Просторный двухкомнатный номер площадью 41 м² с уютной спальней, светлой гостиной и балконом. В номере предусмотрена двуспальная кровать, детская кроватка, мягкая софа и раскладной диван, что делает его отличным выбором для семейного отдыха.",
    shortTitle: "Люкс семейный",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
  },
  "Апартаменты, 1 этаж, с выходом на бассейн": {
    cap: 6, count: 1, maxToddlers: 2,
    prices: { 6: 14000, 7: 17500, 8: 17500, 9: 14000 },
    description: "Комфортабельные апартаменты площадью 55 м² с двумя спальнями, уютной гостиной и собственной кухней-столовой. Прямой выход к бассейну и балкону создаёт ощущение приватного курортного пространства и максимального комфорта.",
    shortTitle: "Апартаменты (1 этаж)",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
  },
  "Апартаменты, 2 этаж, с видом на бассейн": {
    cap: 6, count: 1, maxToddlers: 2,
    prices: { 6: 14000, 7: 17500, 8: 17500, 9: 14000 },
    description: "Уютные апартаменты площадью 52 м² с двумя спальнями, гостиной и кухней-столовой. Два балкона и открывающийся вид на бассейн наполняют пространство светом и создают атмосферу спокойного курортного отдыха.",
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
