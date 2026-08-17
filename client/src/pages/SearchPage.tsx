import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearch } from "wouter";
import { metrikaGoal, metrikaHit } from "@/lib/metrika";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeasonCalendar } from "@/components/SeasonCalendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomImageCarousel } from "@/components/RoomImageCarousel";
import { Users, AlertCircle, Loader2, Maximize2, Star, ArrowRightLeft, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { GuestCounter } from "@/components/GuestCounter";
import { useCreateBooking } from "@/hooks/use-bookings";
import {
  ROOM_DATA, RoomCategory,
  formatPrice, nightsLabel,
  getDefaultCheckIn, getDefaultCheckOut,
  generateRecommendations, RoomCombo,
  calculateRoomTotalPrice, calculateFoodCost,
  calculateAccommodationCost, isRoomSuitable,
} from "@/lib/roomData";

function ComboRoomCards({ combo }: { combo: RoomCombo }) {
  return (
    <div className="space-y-3">
      {combo.rooms.map((room, idx) => {
        const info = ROOM_DATA[room.category];
        return (
          <div key={idx} className="flex gap-4 items-start" data-testid={`combo-room-${idx}`}>
            <div className="w-24 h-18 md:w-32 md:h-24 rounded-lg overflow-hidden bg-secondary shrink-0">
              <img
                src={info.image}
                alt={room.category}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm md:text-base truncate">{info.shortTitle}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> до {info.cap} гостей
                </span>
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" /> {info.area} м²
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{room.category}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SearchPage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  const defaultIn = getDefaultCheckIn();
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || defaultIn);
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || getDefaultCheckOut(defaultIn));

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const sYear = today.getFullYear();
  const seasonStartDate = new Date(sYear, 6, 1);
  const seasonEndDate = new Date(sYear, 7, 21);
  const SEASON_START = today > seasonEndDate ? `${sYear + 1}-07-01` : `${sYear}-07-01`;
  const SEASON_END = today > seasonEndDate ? `${sYear + 1}-08-21` : `${sYear}-08-21`;
  const MAX_CHECKIN = today > seasonEndDate ? `${sYear + 1}-08-20` : `${sYear}-08-20`;
  const minCheckIn = todayStr > SEASON_START && todayStr <= SEASON_END ? todayStr : SEASON_START;
  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };
  const MIN_NIGHTS = 1;
  const minCheckOut = checkIn ? addDays(checkIn, MIN_NIGHTS) : addDays(SEASON_START, MIN_NIGHTS);
  const [adults, setAdults] = useState(Number(params.get("adults")) || 2);
  const [teens, setTeens] = useState(Number(params.get("teens")) || 0);
  const [children, setChildren] = useState(Number(params.get("children")) || 0);
  const [toddlers, setToddlers] = useState(Number(params.get("toddlers")) || 0);

  const [selectedCombo, setSelectedCombo] = useState<RoomCombo | null>(null);
  const [confirmingCombo, setConfirmingCombo] = useState<RoomCombo | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name: boolean; phone: boolean }>({ name: false, phone: false });
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const createBooking = useCreateBooking();

  const earlyBooking = false;
  const discountBreakdownLabel = "уточняется менеджером";

  const recommendations = useMemo(() => {
    return generateRecommendations(checkIn, checkOut, adults, teens, children, toddlers);
  }, [checkIn, checkOut, adults, teens, children, toddlers]);

  const handleBook = (combo: RoomCombo) => {
    metrikaGoal("booking_open");
    metrikaHit("/booking/open");
    setFieldErrors({ name: false, phone: false });
    setValidationError(null);
    setConsentChecked(false);
    setConsentError(false);
    setSelectedCombo(combo);
  };

  const handleConfirmAlternative = (combo: RoomCombo) => {
    setConfirmingCombo(combo);
  };

  const handleProceedToBooking = () => {
    if (!confirmingCombo) return;
    metrikaGoal("booking_open");
    metrikaHit("/booking/open");
    setFieldErrors({ name: false, phone: false });
    setValidationError(null);
    setSelectedCombo(confirmingCombo);
    setConfirmingCombo(null);
  };

  const isPhoneValid = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 11;
  }, []);

  const [toastFading, setToastFading] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!validationError) return;
    setToastFading(false);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastFading(true);
      setTimeout(() => {
        setValidationError(null);
        setToastFading(false);
      }, 300);
    }, 2500);
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [validationError]);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCombo || createBooking.isPending) return;

    const nameMissing = !contactName.trim();
    const phoneMissing = !isPhoneValid(contactPhone);

    if (nameMissing || phoneMissing) {
      setFieldErrors({ name: nameMissing, phone: phoneMissing });
      const msg = nameMissing && phoneMissing
        ? "Введите имя и номер телефона"
        : nameMissing ? "Введите имя" : "Введите номер телефона";
      setValidationError((prev) => prev === msg ? msg + " " : msg);
      requestAnimationFrame(() => {
        if (nameMissing) nameInputRef.current?.focus();
        else phoneInputRef.current?.focus();
      });
      return;
    }

    if (!consentChecked) {
      setConsentError(true);
      const msg = "Необходимо согласие на обработку персональных данных";
      setValidationError((prev) => prev === msg ? msg + " " : msg);
      return;
    }

    const roomLabel = selectedCombo.rooms.length === 1
      ? selectedCombo.rooms[0].category
      : selectedCombo.rooms.map(r => ROOM_DATA[r.category].shortTitle).join(" + ");

    const displayTotal = finalPrice(selectedCombo);
    const discountAmount = earlyBooking ? selectedCombo.totalPrice - displayTotal : 0;
    const prepaymentAmount = Math.round(displayTotal / selectedCombo.nights);

    let roomBreakdown: { category: string; shortTitle: string; capacity: number; maxToddlers: number; roomCost: number }[] | undefined;
    if (selectedCombo.rooms.length > 1) {
      const totalAccom = selectedCombo.rooms.reduce((s, r) => s + r.roomCost, 0);
      let remainingTotal = selectedCombo.totalPrice;
      roomBreakdown = selectedCombo.rooms.map((r, i) => {
        let share: number;
        if (i === selectedCombo.rooms.length - 1) {
          share = remainingTotal;
        } else {
          share = Math.round(selectedCombo.totalPrice * r.roomCost / totalAccom);
          remainingTotal -= share;
        }
        return {
          category: r.category,
          shortTitle: ROOM_DATA[r.category].shortTitle,
          capacity: ROOM_DATA[r.category].cap,
          maxToddlers: ROOM_DATA[r.category].maxToddlers,
          roomCost: share,
        };
      });
    }

    createBooking.mutate({
      roomCategory: roomLabel,
      checkIn,
      checkOut,
      adults,
      teens,
      children,
      toddlers,
      totalPrice: displayTotal,
      contactName: contactName || null,
      contactPhone: contactPhone || null,
      roomBreakdown,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      prepayment: prepaymentAmount,
    }, {
      onSuccess: () => {
        setSelectedCombo(null);
        setContactName("");
        setContactPhone("");
        setBookingSuccess(true);
      }
    });
  };

  const finalPrice = (combo: RoomCombo): number => combo.totalPrice;

  const hasResults = recommendations.primary !== null;
  const hasAlternatives = recommendations.alternatives.length > 0;

  return (
    <div className="bg-secondary/10 min-h-screen overflow-x-hidden">
      <section className="py-12 bg-white border-b border-border/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8" data-testid="heading-search">Подбор номеров</h1>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="grid grid-cols-2 gap-2 md:gap-4 w-full md:w-auto md:shrink-0">
              <div className="min-w-0 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Дата заезда</Label>
                <SeasonCalendar
                  testId="search-checkin"
                  value={checkIn}
                  onChange={(val) => {
                    setCheckIn(val);
                    if (val && checkOut && checkOut < addDays(val, MIN_NIGHTS)) {
                      setCheckOut("");
                    }
                  }}
                  minDate={minCheckIn}
                  maxDate={MAX_CHECKIN}
                  seasonStart={SEASON_START}
                  seasonEnd={SEASON_END}
                  placeholder="Заезд"
                />
              </div>
              <div className="min-w-0 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Дата выезда</Label>
                <SeasonCalendar
                  testId="search-checkout"
                  value={checkOut}
                  onChange={(val) => setCheckOut(val)}
                  minDate={minCheckOut}
                  maxDate={SEASON_END}
                  seasonStart={SEASON_START}
                  seasonEnd={SEASON_END}
                  placeholder="Выезд"
                  disabled={!checkIn}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 w-full md:flex-1 md:min-w-0">
              <GuestCounter label="Взрослые (18+)" value={adults} onChange={setAdults} min={1} max={6} data-testid="search-adults" />
              <GuestCounter label="Подростки (13-18)" value={teens} onChange={setTeens} min={0} max={6} data-testid="search-teens" />
              <GuestCounter label="Дети (2-13)" value={children} onChange={setChildren} min={0} max={6} data-testid="search-children" />
              <GuestCounter label="Малыши (0-2)" value={toddlers} onChange={setToddlers} min={0} max={4} data-testid="search-toddlers" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {hasResults && (
            <div className="mb-6 flex items-center gap-2 flex-wrap text-sm text-muted-foreground md:hidden" data-testid="guest-summary-mobile">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span className="font-medium text-foreground">
                {[
                  adults > 0 && `${adults} ${adults === 1 ? "взрослый" : adults < 5 ? "взрослых" : "взрослых"}`,
                  teens > 0 && `${teens} ${teens === 1 ? "подросток" : teens < 5 ? "подростка" : "подростков"}`,
                  children > 0 && `${children} ${children === 1 ? "ребёнок" : children < 5 ? "ребёнка" : "детей"}`,
                  toddlers > 0 && `${toddlers} ${toddlers === 1 ? "малыш" : "малыша"}`,
                ].filter(Boolean).join(" • ")}
              </span>
              <a
                href="#"
                className="text-primary underline underline-offset-2 text-xs ml-auto shrink-0"
                data-testid="link-change-guests"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Изменить
              </a>
            </div>
          )}
          {recommendations.seasonError ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2" data-testid="text-no-rooms">Нет доступных номеров</h2>
              <p className="text-muted-foreground text-lg">{recommendations.seasonError}</p>
            </div>
          ) : !hasResults ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2" data-testid="text-no-rooms">Нет подходящих вариантов</h2>
              <p className="text-muted-foreground text-lg">
                К сожалению, для указанного состава гостей подходящих вариантов размещения не найдено. Попробуйте изменить параметры.
              </p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {recommendations.primary && (
                <div data-testid="block-recommended">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">Рекомендованный вариант</h2>
                  </div>

                  <Card className="overflow-hidden border-primary/20 shadow-lg border-2">
                    <div className="md:flex">
                      <div className="md:w-2/5 lg:w-1/3">
                        <div className="aspect-[4/3] overflow-hidden bg-secondary">
                          {recommendations.primary.rooms.length === 1 ? (
                            (() => {
                              const info = ROOM_DATA[recommendations.primary!.rooms[0].category];
                              return info.images && info.images.length > 1
                                ? <RoomImageCarousel images={info.images} alt={recommendations.primary!.rooms[0].category} className="w-full h-full object-cover" />
                                : <img src={info.image} alt={recommendations.primary!.rooms[0].category} className="w-full h-full object-cover" loading="lazy" decoding="async" />;
                            })()
                          ) : (
                            <img
                              src={ROOM_DATA[recommendations.primary.rooms[0].category].image}
                              alt="Рекомендованный вариант"
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                        </div>
                      </div>

                      <div className="p-5 md:p-6 flex flex-col flex-1 gap-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold font-display text-foreground" data-testid="text-recommended-title">
                            {recommendations.primary.rooms.length === 1
                              ? recommendations.primary.rooms[0].category
                              : recommendations.primary.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1" data-testid="text-recommended-why">
                            {recommendations.primary.why}
                          </p>
                        </div>

                        {recommendations.primary.rooms.length > 1 && (
                          <ComboRoomCards combo={recommendations.primary} />
                        )}

                        {recommendations.primary.rooms.length === 1 && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Maximize2 className="w-3.5 h-3.5 text-primary/60" />
                              {ROOM_DATA[recommendations.primary.rooms[0].category].area} м²
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-primary/60" />
                              до {recommendations.primary.totalCapacity} гостей
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            вмещает до {recommendations.primary.totalCapacity} гостей
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {recommendations.primary.nights} {nightsLabel(recommendations.primary.nights)}
                          </Badge>
                          {recommendations.primary.rooms.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {recommendations.primary.rooms.length} {recommendations.primary.rooms.length === 2 ? "номера" : "номеров"}
                            </Badge>
                          )}
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {recommendations.primary.nights} {nightsLabel(recommendations.primary.nights)}
                            {recommendations.primary.rooms.length > 1 && ` · ${recommendations.primary.rooms.length} ${recommendations.primary.rooms.length === 2 ? "номера" : "номеров"}`}
                          </div>
                          {earlyBooking ? (
                            <>
                              <div className="text-sm text-muted-foreground line-through" data-testid="price-recommended-old">
                                {formatPrice(recommendations.primary.totalPrice)}
                              </div>
                              <div className="text-2xl md:text-3xl font-bold font-display text-primary" data-testid="price-recommended">
                                {formatPrice(finalPrice(recommendations.primary))}
                              </div>
                              <div className="text-xs font-medium text-green-600" data-testid="discount-recommended">
                                Цена с учётом скидки: {discountBreakdownLabel}
                              </div>
                              <p className="text-xs font-medium text-green-600/80 mt-1">Финальная цена может быть ниже при подтверждении бронирования</p>
                            </>
                          ) : (
                            <div className="text-2xl md:text-3xl font-bold font-display text-primary" data-testid="price-recommended">
                              {formatPrice(recommendations.primary.totalPrice)}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground italic">* Расчёт является предварительным</p>

                        <Button
                          data-testid="button-book-recommended"
                          className="w-full md:w-auto mt-auto"
                          onClick={() => handleBook(recommendations.primary!)}
                        >
                          Забронировать этот вариант
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {hasAlternatives && (
                <div data-testid="block-alternatives">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <ArrowRightLeft className="w-5 h-5 text-primary/70" />
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">Альтернативные варианты размещения</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.alternatives.map((combo, idx) => {
                      const isSingle = combo.rooms.length === 1;
                      const firstRoom = combo.rooms[0];
                      const info = ROOM_DATA[firstRoom.category];

                      return (
                        <Card key={idx} className="overflow-hidden border-border/50 shadow-md flex flex-col" data-testid={`card-alternative-${idx}`}>
                          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                            {isSingle && info.images && info.images.length > 1 ? (
                              <RoomImageCarousel images={info.images} alt={firstRoom.category} className="w-full h-full object-cover" />
                            ) : (
                              <img src={info.image} alt={combo.label} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            )}
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-bold shadow-sm text-xs">
                                <Users className="w-3 h-3 mr-1" /> до {combo.totalCapacity} чел.
                              </Badge>
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-1 gap-3">
                            <h3 className="text-base font-bold font-display text-foreground">
                              {isSingle ? firstRoom.category : combo.label}
                            </h3>
                            <p className="text-xs text-muted-foreground">{combo.why}</p>

                            {!isSingle && <ComboRoomCards combo={combo} />}

                            {isSingle && (
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Maximize2 className="w-3 h-3 text-primary/60" /> {info.area} м²
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-primary/60" /> до {info.cap} гостей
                                </span>
                              </div>
                            )}

                            <div className="bg-primary/5 rounded-xl p-3 space-y-1 mt-auto">
                              <div className="text-xs text-muted-foreground">
                                {combo.nights} {nightsLabel(combo.nights)}
                                {!isSingle && ` · ${combo.rooms.length} ${combo.rooms.length === 2 ? "номера" : "номеров"}`}
                              </div>
                              {earlyBooking ? (
                                <>
                                  <div className="text-xs text-muted-foreground line-through">
                                    {formatPrice(combo.totalPrice)}
                                  </div>
                                  <div className="text-xl font-bold font-display text-primary" data-testid={`price-alt-${idx}`}>
                                    {formatPrice(finalPrice(combo))}
                                  </div>
                                  <div className="text-xs font-medium text-green-600">Цена с учётом скидки: {discountBreakdownLabel}</div>
                                  <p className="text-xs font-medium text-green-600/80 mt-1">Финальная цена может быть ниже при подтверждении бронирования</p>
                                </>
                              ) : (
                                <div className="text-xl font-bold font-display text-primary" data-testid={`price-alt-${idx}`}>
                                  {formatPrice(combo.totalPrice)}
                                </div>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              data-testid={`button-book-alt-${idx}`}
                              className="w-full"
                              onClick={() => handleConfirmAlternative(combo)}
                            >
                              Выбрать этот вариант
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <div data-testid="block-all-rooms">
                <button
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                  onClick={() => setShowAllRooms(!showAllRooms)}
                  data-testid="button-toggle-all-rooms"
                >
                  {showAllRooms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {showAllRooms ? "Скрыть все категории номеров" : "Показать все категории номеров"}
                  </span>
                </button>

                {showAllRooms && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Object.entries(ROOM_DATA).map(([category, info]) => {
                      const cat = category as RoomCategory;
                      if (!isRoomSuitable(cat, adults, teens, children, toddlers)) return null;
                      const calcResult = calculateRoomTotalPrice(cat, checkIn, checkOut, adults, teens, children, toddlers);
                      if (!calcResult || "error" in calcResult) return null;
                      const rc = { cost: calcResult.total, nights: calcResult.nights };

                      return (
                        <Card key={category} className="overflow-hidden border-border/50 shadow-sm flex flex-col" data-testid={`card-allroom-${cat}`}>
                          <div className="aspect-[4/3] overflow-hidden bg-secondary">
                            <img src={info.image} alt={category} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                          <div className="p-4 flex flex-col flex-1 gap-2">
                            <h4 className="text-sm font-bold text-foreground">{info.shortTitle}</h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span><Users className="w-3 h-3 inline mr-1" />до {info.cap}</span>
                              <span><Maximize2 className="w-3 h-3 inline mr-1" />{info.area} м²</span>
                            </div>
                            <div className="text-sm font-semibold text-primary mt-auto">
                              от {formatPrice(rc.cost)}
                              <span className="text-xs text-muted-foreground font-normal"> / {rc.nights} {nightsLabel(rc.nights)}</span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {confirmingCombo && (() => {
        const combo = confirmingCombo;
        const numRooms = combo.rooms.length;
        const confirmDisplayTotal = finalPrice(combo);
        const confirmDiscountAmount = earlyBooking ? combo.totalPrice - confirmDisplayTotal : 0;


        const formatDateShortConfirm = (d: string) => {
          const date = new Date(d + "T00:00:00");
          return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
        };

        const confirmPerRoomPrices: number[] = [];
        const totalAccomConfirm = combo.rooms.reduce((s, r) => s + r.roomCost, 0);
        let remainingConfirm = combo.totalPrice;
        for (let i = 0; i < combo.rooms.length; i++) {
          if (i === combo.rooms.length - 1) {
            confirmPerRoomPrices.push(remainingConfirm);
          } else {
            const share = Math.round(combo.totalPrice * combo.rooms[i].roomCost / totalAccomConfirm);
            confirmPerRoomPrices.push(share);
            remainingConfirm -= share;
          }
        }

        return (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
            onClick={() => setConfirmingCombo(null)}
            data-testid="modal-confirm-overlay"
          >
            <div
              className="bg-white rounded-t-2xl md:rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-confirm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-primary" data-testid="confirm-title">Вы выбрали вариант размещения</h3>
                <button
                  onClick={() => setConfirmingCombo(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground active:bg-secondary/50"
                  aria-label="Закрыть"
                  data-testid="confirm-close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {numRooms > 1 ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">Размещение:</p>

                  <div className="space-y-3" data-testid="confirm-rooms-list">
                    {combo.rooms.map((r, i) => {
                      const info = ROOM_DATA[r.category];
                      const guestLine = info.maxToddlers > 0
                        ? `до ${info.cap} ${info.cap < 5 ? "гостя" : "гостей"}${toddlers > 0 ? `, ${Math.min(toddlers, info.maxToddlers)} ${Math.min(toddlers, info.maxToddlers) === 1 ? "малыш" : "малыша"}` : ""}`
                        : `до ${info.cap} ${info.cap < 5 ? "гостя" : "гостей"}`;
                      return (
                        <div key={i} className="bg-secondary/20 border border-border/40 rounded-xl p-4" data-testid={`confirm-room-${i}`}>
                          <p className="font-bold text-foreground text-[15px] leading-snug" data-testid={`confirm-room-name-${i}`}>{r.category}</p>
                          <p className="text-xs text-muted-foreground mt-1">{guestLine}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDateShortConfirm(checkIn)} — {formatDateShortConfirm(checkOut)} · {combo.nights} {nightsLabel(combo.nights)}
                          </p>
                          <p className="text-sm font-bold text-primary mt-2" data-testid={`confirm-room-price-${i}`}>
                            {formatPrice(confirmPerRoomPrices[i])}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">Итого:</span>
                      <span className="text-2xl font-bold font-display text-primary" data-testid="confirm-total-price">{formatPrice(confirmDisplayTotal)}</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-secondary/20 border border-border/40 rounded-xl p-4">
                    <p className="font-bold text-foreground text-[15px]">{combo.rooms[0].category}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateShortConfirm(checkIn)} — {formatDateShortConfirm(checkOut)} · {combo.nights} {nightsLabel(combo.nights)}
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4">
                    {earlyBooking && (
                      <p className="text-sm text-muted-foreground line-through mb-1" data-testid="confirm-old-price">{formatPrice(combo.totalPrice)}</p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">Итого:</span>
                      <span className="text-2xl font-bold font-display text-primary" data-testid="confirm-total-price">{formatPrice(confirmDisplayTotal)}</span>
                    </div>
                    {earlyBooking && (
                      <>
                        <p className="text-xs font-medium text-green-600 mt-1">Цена с учётом скидки: {discountBreakdownLabel}</p>
                        <p className="text-xs font-medium text-green-600/80 mt-1">Финальная цена может быть ниже при подтверждении бронирования</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground italic">* Расчёт является предварительным</p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setConfirmingCombo(null)} data-testid="confirm-cancel">Назад</Button>
                <Button className="flex-1" onClick={handleProceedToBooking} data-testid="confirm-book">Забронировать этот вариант</Button>
              </div>
            </div>
          </div>
        );
      })()}

      {selectedCombo && (() => {
        const guestParts = [
          adults > 0 && `${adults} ${adults === 1 ? "взрослый" : "взрослых"}`,
          teens > 0 && `${teens} ${teens === 1 ? "подросток" : teens < 5 ? "подростка" : "подростков"}`,
          children > 0 && `${children} ${children === 1 ? "ребёнок" : children < 5 ? "ребёнка" : "детей"}`,
          toddlers > 0 && `${toddlers} ${toddlers === 1 ? "малыш" : toddlers < 5 ? "малыша" : "малышей"}`,
        ].filter(Boolean).join(", ");

        const formatDateShort = (d: string) => {
          const date = new Date(d + "T00:00:00");
          return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
        };

        const isMultiRoom = selectedCombo.rooms.length > 1;
        const comboDisplayTotal = finalPrice(selectedCombo);
        const comboDiscountAmount = earlyBooking ? selectedCombo.totalPrice - comboDisplayTotal : 0;


        const perRoomPrices: number[] = [];
        if (isMultiRoom) {
          const totalAccom = selectedCombo.rooms.reduce((s, r) => s + r.roomCost, 0);
          let remaining = selectedCombo.totalPrice;
          for (let i = 0; i < selectedCombo.rooms.length; i++) {
            if (i === selectedCombo.rooms.length - 1) {
              perRoomPrices.push(remaining);
            } else {
              const share = Math.round(selectedCombo.totalPrice * selectedCombo.rooms[i].roomCost / totalAccom);
              perRoomPrices.push(share);
              remaining -= share;
            }
          }
        }

        return (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
            onClick={() => setSelectedCombo(null)}
            data-testid="modal-overlay"
          >
            <div
              className="bg-white rounded-t-2xl md:rounded-2xl max-w-md w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-booking"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-foreground">Забронировать номер</h3>
                <button
                  onClick={() => setSelectedCombo(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground active:bg-secondary/50"
                  aria-label="Закрыть"
                  data-testid="modal-close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isMultiRoom ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground" data-testid="modal-room-label">Размещение:</p>

                  <div className="space-y-3">
                    {selectedCombo.rooms.map((r, i) => {
                      const info = ROOM_DATA[r.category];
                      const guestLine = info.maxToddlers > 0
                        ? `${info.cap} ${info.cap === 1 ? "гость" : info.cap < 5 ? "гостя" : "гостей"}${toddlers > 0 ? `, ${Math.min(toddlers, info.maxToddlers)} ${Math.min(toddlers, info.maxToddlers) === 1 ? "малыш" : "малыша"}` : ""}`
                        : `${info.cap} ${info.cap === 1 ? "гость" : info.cap < 5 ? "гостя" : "гостей"}`;
                      return (
                        <div key={i} className="bg-secondary/20 border border-border/40 rounded-xl p-4" data-testid={`modal-room-${i}`}>
                          <p className="font-bold text-foreground text-[15px] leading-snug">{r.category}</p>
                          <p className="text-xs text-muted-foreground mt-1">{guestLine}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDateShort(checkIn)} — {formatDateShort(checkOut)} · {selectedCombo.nights} {nightsLabel(selectedCombo.nights)}
                          </p>
                          <p className="text-sm font-bold text-primary mt-2" data-testid={`modal-room-price-${i}`}>
                            {formatPrice(perRoomPrices[i])}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-foreground">Итого:</span>
                      <span className="text-2xl font-bold text-primary" data-testid="modal-total-price">
                        {formatPrice(comboDisplayTotal)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground italic">* Расчёт является предварительным</p>
                </div>
              ) : (
                <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 space-y-3">
                  <p className="text-base font-bold text-foreground leading-snug" data-testid="modal-room-label">
                    {selectedCombo.rooms[0].category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateShort(checkIn)} — {formatDateShort(checkOut)} · {selectedCombo.nights} {nightsLabel(selectedCombo.nights)}
                  </p>
                  <p className="text-sm text-muted-foreground">{guestParts}</p>

                  <div className="border-t border-border/50 pt-3 mt-1 space-y-3">
                    <div>
                      {earlyBooking && (
                        <p className="text-sm text-muted-foreground line-through text-right">{formatPrice(selectedCombo.totalPrice)}</p>
                      )}
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Итого:</span>
                        <span className="text-2xl font-bold text-primary" data-testid="modal-total-price">
                          {formatPrice(comboDisplayTotal)}
                        </span>
                      </div>
                      {earlyBooking && (
                        <p className="text-xs font-medium text-green-600 mt-1">Цена с учётом скидки: {discountBreakdownLabel}</p>
                      )}
                      {earlyBooking && (
                        <p className="text-xs font-medium text-green-600/80 mt-1">Финальная цена может быть ниже при подтверждении бронирования</p>
                      )}
                    </div>

                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Имя</Label>
                  <Input
                    ref={nameInputRef}
                    data-testid="booking-name"
                    placeholder="Как к вам обращаться"
                    value={contactName}
                    onChange={(e) => {
                      setContactName(e.target.value);
                      if (fieldErrors.name && e.target.value.trim()) setFieldErrors(prev => ({ ...prev, name: false }));
                    }}
                    className={`h-12 text-base transition-colors ${fieldErrors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Телефон</Label>
                  <Input
                    ref={phoneInputRef}
                    data-testid="booking-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={contactPhone}
                    onChange={(e) => {
                      let raw = e.target.value.replace(/[^\d+]/g, "");
                      if (raw === "8") raw = "+7";
                      if (raw.startsWith("8") && raw.length > 1) raw = "+7" + raw.slice(1);
                      if (raw.length > 0 && !raw.startsWith("+")) raw = "+7" + raw;
                      const digits = raw.replace(/\D/g, "");
                      if (digits.length === 0) { setContactPhone(""); return; }
                      let formatted = "+7";
                      const d = digits.slice(1).slice(0, 10);
                      if (d.length > 0) formatted += " (" + d.slice(0, 3);
                      if (d.length >= 3) formatted += ") ";
                      else if (d.length > 0) formatted += "";
                      if (d.length > 3) formatted += d.slice(3, 6);
                      if (d.length > 6) formatted += "-" + d.slice(6, 8);
                      if (d.length > 8) formatted += "-" + d.slice(8, 10);
                      setContactPhone(formatted);
                      if (fieldErrors.phone && digits.length === 11) setFieldErrors(prev => ({ ...prev, phone: false }));
                    }}
                    onFocus={(e) => { if (!e.target.value) setContactPhone("+7 ("); }}
                    onBlur={() => { if (contactPhone.replace(/\D/g, "").length <= 1) setContactPhone(""); }}
                    className={`h-12 text-base transition-colors ${fieldErrors.phone ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Оплата непосредственно на сайте не осуществляется. Бронирование и порядок оплаты подтверждаются менеджером.
                  </p>

                  <label className={`flex items-start gap-2.5 cursor-pointer group ${consentError ? "text-red-600" : ""}`}>
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
                      {" "}и ознакомлен(а) с{" "}
                      <a href="/privacy" className="text-primary underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Политикой персональных данных</a>.
                    </span>
                  </label>
                  {consentError && (
                    <p className="text-xs text-red-600 -mt-1">Необходимо согласие на обработку персональных данных</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 cursor-pointer touch-manipulation select-none"
                    disabled={createBooking.isPending}
                    data-testid="button-submit-booking"
                  >
                    <span className="pointer-events-none">
                      {createBooking.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Забронировать номер"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 text-sm rounded-xl"
                    onClick={() => { setSelectedCombo(null); setConsentChecked(false); setConsentError(false); }}
                  >
                    Отмена
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-1 leading-relaxed">Менеджер свяжется с вами для подтверждения бронирования</p>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {validationError && (
        <div
          className="fixed inset-x-0 top-[40%] z-[60] flex justify-center pointer-events-none px-4"
          data-testid="toast-validation"
        >
          <div
            className={`pointer-events-auto inline-flex items-center gap-2.5 bg-foreground/90 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${toastFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0 animate-in fade-in slide-in-from-bottom-2 duration-300"}`}
            data-testid="toast-validation-content"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-white/80" />
            <span className="text-sm font-medium" data-testid="text-validation-message">{validationError.trim()}</span>
          </div>
        </div>
      )}

      {bookingSuccess && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setBookingSuccess(false)}
          data-testid="modal-success-overlay"
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl max-w-md w-full p-8 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-success"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">Заявка отправлена!</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Спасибо за ваш интерес к AL MARE! Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
            </p>
            <Button
              className="w-full mt-2"
              onClick={() => setBookingSuccess(false)}
              data-testid="button-success-close"
            >
              Отлично
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
