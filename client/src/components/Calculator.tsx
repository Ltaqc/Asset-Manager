import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GuestCounter } from "@/components/GuestCounter";
import { roomCategories } from "@shared/schema";
import { Calculator as CalcIcon, AlertCircle } from "lucide-react";
import { showSeasonStatus } from "@/components/SeasonStatusModal";
import {
  RoomCategory,
  calculateRoomTotalPrice,
  formatPrice,
  getDefaultCheckIn,
  getDefaultCheckOut,
  isRoomSuitable,
  ROOM_DATA,
} from "@/lib/roomData";

type _RoomCategory = RoomCategory;

const CALC_SEASON_END = "2026-08-21";
const CALC_MAX_CHECKIN = "2026-08-20";
const SEASON_PREVIEW_MODE = true;

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
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const suitable = useMemo(() => isRoomSuitable(roomCategory, adults, teens, children, toddlers), [roomCategory, adults, teens, children, toddlers]);

  const capacityWarning = useMemo(() => {
    if (suitable) return null;
    const info = ROOM_DATA[roomCategory];
    const mainGuests = adults + teens + children;
    if (mainGuests > info.cap) return `Этот номер вмещает до ${info.cap} гостей (без учёта малышей). Выберите номер большей вместимости или перейдите в подбор номеров.`;
    if (toddlers > info.maxToddlers) return `В этом номере можно разместить не более ${info.maxToddlers} ${info.maxToddlers === 1 ? "малыша" : "малышей"}. Выберите другой номер или перейдите в подбор номеров.`;
    return null;
  }, [suitable, roomCategory, adults, teens, children, toddlers]);

  const result = useMemo(() => {
    if (!suitable) return null;
    if (!checkIn || !checkOut || !roomCategory) return null;
    return calculateRoomTotalPrice(roomCategory, checkIn, checkOut, adults, teens, children, toddlers);
  }, [suitable, roomCategory, checkIn, checkOut, adults, teens, children, toddlers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSeasonStatus();
  };

  const validResult = result && !("error" in result) ? result : null;
  const errorMsg = result && "error" in result ? result.error : null;

  return (
    <div id="calculator" data-testid="calculator-section" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50">
      <div className="bg-primary/5 p-6 md:p-8 border-b border-primary/10">
        <h3 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-2 flex items-center gap-3">
          <CalcIcon className="w-6 h-6 md:w-8 md:h-8" />
          Предварительная стоимость
        </h3>
        <p className="text-muted-foreground">Расчёт предварительной стоимости на сезон 2027 будет доступен в ближайшее время</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 pointer-events-none opacity-45">
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
                    max={CALC_MAX_CHECKIN}
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
                    max={CALC_SEASON_END}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-primary font-semibold">Состав гостей</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <GuestCounter label="Взрослые (18+)" value={adults} onChange={setAdults} min={1} max={6} data-testid="input-adults" />
                  <GuestCounter label="Подростки (13-18)" value={teens} onChange={setTeens} min={0} max={6} data-testid="input-teens" />
                  <GuestCounter label="Дети (2-13)" value={children} onChange={setChildren} min={0} max={6} data-testid="input-children" />
                  <GuestCounter label="Малыши (0-2)" value={toddlers} onChange={setToddlers} min={0} max={1} data-testid="input-toddlers" />
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

                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Оплата непосредственно на сайте не осуществляется. Бронирование, окончательная стоимость и порядок оплаты подтверждаются менеджером после обращения гостя.
                </p>

                <label className={`flex items-start gap-2.5 mt-4 cursor-pointer group ${consentError ? "text-red-600" : ""}`}>
                  <input
                    type="checkbox"
                    data-testid="input-consent"
                    checked={consentChecked}
                    onChange={(e) => { setConsentChecked(e.target.checked); if (e.target.checked) setConsentError(false); }}
                    className="mt-0.5 shrink-0 w-4 h-4 accent-primary"
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                    Я даю{" "}
                    <a href="/privacy" className="text-primary underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>согласие на обработку персональных данных</a>
                    {" "}и подтверждаю, что ознакомлен(а) с{" "}
                    <a href="/privacy" className="text-primary underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Политикой в отношении обработки персональных данных</a>.
                  </span>
                </label>
                {consentError && (
                  <p className="text-xs text-red-600 mt-1">Необходимо согласие на обработку персональных данных</p>
                )}
              </div>
            </div>

            <Button
              data-testid="button-submit-booking"
              type="submit"
              className="w-full h-14 text-lg font-bold bg-primary shadow-lg shadow-primary/20 rounded-xl mt-4"
              disabled={false}
            >
              Узнать об открытии продаж
            </Button>
          </form>
        </div>

        <div className="bg-primary text-primary-foreground p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-8">
            <h4 className="text-2xl font-display text-primary-foreground/90 border-b border-primary-foreground/20 pb-4">
              Предварительная стоимость
            </h4>

            {SEASON_PREVIEW_MODE ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-primary-foreground/80">
                <CalcIcon className="mb-4 h-16 w-16 opacity-50" />
                <p className="max-w-sm text-lg leading-relaxed">
                  Расчёт предварительной стоимости на сезон 2027 будет доступен в ближайшее время.
                </p>
              </div>
            ) : capacityWarning ? (
              <div className="flex flex-col items-center justify-center text-primary-foreground/70 py-12">
                <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-base text-center leading-relaxed">{capacityWarning}</p>
              </div>
            ) : errorMsg ? (
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
