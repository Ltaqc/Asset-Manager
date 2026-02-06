import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { roomCategories } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Loader2, Calculator as CalcIcon } from "lucide-react";

type RoomCategory = typeof roomCategories[number];

interface RoomInfo {
  cap: number;
  count: number;
  prices: Record<number, number>;
}

const ROOM_DATA: Record<RoomCategory, RoomInfo> = {
  "Стандарт с двуспальной кроватью и балконом": { cap: 2, count: 9, prices: { 6: 4600, 7: 5700, 8: 5700, 9: 4600 } },
  "Стандарт с раздвижной двуспальной кроватью и балконом": { cap: 2, count: 3, prices: { 6: 4600, 7: 5700, 8: 5700, 9: 4600 } },
  "Стандарт семейный с балконом": { cap: 3, count: 6, prices: { 6: 7000, 7: 8700, 8: 8700, 9: 7000 } },
  "Джуниор Сьют с балконом": { cap: 4, count: 3, prices: { 6: 9200, 7: 11500, 8: 11500, 9: 9200 } },
  "Люкс двухкомнатный без балкона": { cap: 4, count: 3, prices: { 6: 9200, 7: 11500, 8: 11500, 9: 9200 } },
  "Люкс семейный, двухкомнатный": { cap: 5, count: 1, prices: { 6: 11500, 7: 14500, 8: 14500, 9: 11500 } },
  "Апартаменты, 1 этаж, с выходом на бассейн": { cap: 6, count: 1, prices: { 6: 14000, 7: 17500, 8: 17500, 9: 14000 } },
  "Апартаменты, 2 этаж, с видом на бассейн": { cap: 6, count: 1, prices: { 6: 14000, 7: 17500, 8: 17500, 9: 14000 } },
};

const FOOD_RATES = {
  adult: 4500,
  teen: 4500,
  child: 3000,
  toddler: 0,
};

function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU") + " \u20BD";
}

function getDefaultCheckIn(): string {
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

function getDefaultCheckOut(checkIn: string): string {
  const d = new Date(checkIn);
  d.setDate(d.getDate() + 5);
  return d.toISOString().split("T")[0];
}

export function Calculator() {
  const defaultIn = getDefaultCheckIn();
  const [roomCategory, setRoomCategory] = useState<RoomCategory>(roomCategories[0]);
  const [checkIn, setCheckIn] = useState(defaultIn);
  const [checkOut, setCheckOut] = useState(getDefaultCheckOut(defaultIn));
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const createBooking = useCreateBooking();

  const result = useMemo(() => {
    if (!checkIn || !checkOut || !roomCategory) return null;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffMs = outDate.getTime() - inDate.getTime();
    const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (nights < 1) return null;

    const roomInfo = ROOM_DATA[roomCategory];
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
  }, [roomCategory, checkIn, checkOut, adults, teens, children]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || "error" in result) return;

    createBooking.mutate({
      roomCategory,
      checkIn,
      checkOut,
      adults,
      teens,
      children,
      toddlers,
      totalPrice: result.total,
      contactName: contactName || null,
      contactPhone: contactPhone || null,
    });
  };

  const validResult = result && !("error" in result) ? result : null;
  const errorMsg = result && "error" in result ? result.error : null;

  return (
    <div id="calculator" data-testid="calculator-section" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50">
      <div className="bg-primary/5 p-6 md:p-8 border-b border-primary/10">
        <h3 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-2 flex items-center gap-3">
          <CalcIcon className="w-6 h-6 md:w-8 md:h-8" />
          Калькулятор стоимости
        </h3>
        <p className="text-muted-foreground">Рассчитайте стоимость вашего отдыха в AL MARE</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Категория номера</Label>
                <Select
                  onValueChange={(val) => setRoomCategory(val as RoomCategory)}
                  value={roomCategory}
                >
                  <SelectTrigger data-testid="select-room" className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20">
                    <SelectValue placeholder="Выберите номер" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomCategories.map((room) => (
                      <SelectItem key={room} value={room} data-testid={`room-option-${room}`}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата заезда</Label>
                  <Input
                    data-testid="input-checkin"
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value && checkOut <= e.target.value) {
                        const d = new Date(e.target.value);
                        d.setDate(d.getDate() + 1);
                        setCheckOut(d.toISOString().split("T")[0]);
                      }
                    }}
                    className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Дата выезда</Label>
                  <Input
                    data-testid="input-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-primary font-semibold">Состав гостей</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Взрослые (18+)</Label>
                    <Input
                      data-testid="input-adults"
                      type="number"
                      min={1}
                      value={adults}
                      onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                      className="bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Подростки (13-18)</Label>
                    <Input
                      data-testid="input-teens"
                      type="number"
                      min={0}
                      value={teens}
                      onChange={(e) => setTeens(Math.max(0, Number(e.target.value)))}
                      className="bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Дети (2-13)</Label>
                    <Input
                      data-testid="input-children"
                      type="number"
                      min={0}
                      value={children}
                      onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                      className="bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Малыши (0-2)</Label>
                    <Input
                      data-testid="input-toddlers"
                      type="number"
                      min={0}
                      value={toddlers}
                      onChange={(e) => setToddlers(Math.max(0, Number(e.target.value)))}
                      className="bg-secondary/30"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-border/60">
                <p className="text-sm text-muted-foreground mb-4">Хотите забронировать? Укажите контактные данные (необязательно).</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ваше имя</Label>
                    <Input
                      data-testid="input-name"
                      placeholder="Иван Иванов"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input
                      data-testid="input-phone"
                      placeholder="+7 900 123 45 67"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="bg-secondary/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              data-testid="button-submit-booking"
              type="submit"
              className="w-full h-14 text-lg font-bold bg-primary shadow-lg shadow-primary/20 rounded-xl mt-4"
              disabled={createBooking.isPending || !validResult}
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Отправляем...
                </>
              ) : (
                "Оставить заявку"
              )}
            </Button>
          </form>
        </div>

        <div className="bg-primary text-primary-foreground p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-8">
            <h4 className="text-2xl font-display text-primary-foreground/90 border-b border-primary-foreground/20 pb-4">
              Расчёт стоимости
            </h4>

            {errorMsg ? (
              <div className="flex flex-col items-center justify-center text-primary-foreground/70 py-12">
                <CalcIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg text-center">{errorMsg}</p>
              </div>
            ) : validResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center text-primary-foreground/80 text-lg" data-testid="text-nights">
                  {validResult.nights} {validResult.nights === 1 ? "ночь" : validResult.nights < 5 ? "ночи" : "ночей"}
                </div>

                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold font-display tracking-tight" data-testid="text-total">
                    {formatPrice(validResult.total)}
                  </div>
                  <div className="text-sm text-primary-foreground/60 mt-2" data-testid="text-per-night">
                    {formatPrice(validResult.perNight)} за ночь
                  </div>
                </div>

                <p className="text-xs text-primary-foreground/50 mt-8 leading-relaxed">
                  * Расчёт является предварительным. Итоговая стоимость может отличаться в зависимости от наличия номеров и специальных предложений.
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-primary-foreground/50 py-12">
                <CalcIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Укажите даты для расчёта</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
