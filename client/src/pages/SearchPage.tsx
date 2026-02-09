import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomImageCarousel } from "@/components/RoomImageCarousel";
import { Users, AlertCircle, Loader2, Maximize2, Star, ArrowRightLeft, ChevronDown, ChevronUp } from "lucide-react";
import { GuestCounter } from "@/components/GuestCounter";
import { useCreateBooking } from "@/hooks/use-bookings";
import {
  ROOM_DATA, RoomCategory,
  formatPrice, nightsLabel,
  getDefaultCheckIn, getDefaultCheckOut,
  isEarlyBooking, applyEarlyDiscount,
  generateRecommendations, RoomCombo,
  calculateRoomTotalPrice, calculateFoodCost,
  calculateAccommodationCost,
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
  const [adults, setAdults] = useState(Number(params.get("adults")) || 2);
  const [teens, setTeens] = useState(Number(params.get("teens")) || 0);
  const [children, setChildren] = useState(Number(params.get("children")) || 0);
  const [toddlers, setToddlers] = useState(Number(params.get("toddlers")) || 0);

  const [selectedCombo, setSelectedCombo] = useState<RoomCombo | null>(null);
  const [confirmingCombo, setConfirmingCombo] = useState<RoomCombo | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [showAllRooms, setShowAllRooms] = useState(false);

  const createBooking = useCreateBooking();

  const earlyBooking = useMemo(() => isEarlyBooking(checkIn), [checkIn]);

  const recommendations = useMemo(() => {
    return generateRecommendations(checkIn, checkOut, adults, teens, children, toddlers);
  }, [checkIn, checkOut, adults, teens, children, toddlers]);

  const handleBook = (combo: RoomCombo) => {
    setSelectedCombo(combo);
  };

  const handleConfirmAlternative = (combo: RoomCombo) => {
    setConfirmingCombo(combo);
  };

  const handleProceedToBooking = () => {
    if (!confirmingCombo) return;
    setSelectedCombo(confirmingCombo);
    setConfirmingCombo(null);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCombo) return;

    const roomLabel = selectedCombo.rooms.length === 1
      ? selectedCombo.rooms[0].category
      : selectedCombo.rooms.map(r => ROOM_DATA[r.category].shortTitle).join(" + ");

    const finalPrice = earlyBooking ? applyEarlyDiscount(selectedCombo.totalPrice) : selectedCombo.totalPrice;

    createBooking.mutate({
      roomCategory: roomLabel,
      checkIn,
      checkOut,
      adults,
      teens,
      children,
      toddlers,
      totalPrice: finalPrice,
      contactName: contactName || null,
      contactPhone: contactPhone || null,
    }, {
      onSuccess: () => {
        setSelectedCombo(null);
        setContactName("");
        setContactPhone("");
      }
    });
  };

  const finalPrice = (price: number) => earlyBooking ? applyEarlyDiscount(price) : price;

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
                <Input
                  data-testid="search-checkin"
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
                  className="h-12 bg-secondary/30 border-primary/20 w-full"
                />
              </div>
              <div className="min-w-0 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Дата выезда</Label>
                <Input
                  data-testid="search-checkout"
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="h-12 bg-secondary/30 border-primary/20 w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 w-full md:flex-1 md:min-w-0">
              <GuestCounter label="Взрослые (18+)" value={adults} onChange={setAdults} min={1} max={6} data-testid="search-adults" />
              <GuestCounter label="Подростки (13-18)" value={teens} onChange={setTeens} min={0} max={6} data-testid="search-teens" />
              <GuestCounter label="Дети (2-13)" value={children} onChange={setChildren} min={0} max={6} data-testid="search-children" />
              <GuestCounter label="Малыши (0-2)" value={toddlers} onChange={setToddlers} min={0} max={1} data-testid="search-toddlers" />
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
                                {formatPrice(finalPrice(recommendations.primary.totalPrice))}
                              </div>
                              <div className="text-xs font-medium text-green-600" data-testid="discount-recommended">
                                Скидка раннего бронирования
                              </div>
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
                                    {formatPrice(finalPrice(combo.totalPrice))}
                                  </div>
                                  <div className="text-xs font-medium text-green-600">Скидка раннего бронирования</div>
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
                              от {formatPrice(earlyBooking ? applyEarlyDiscount(rc.cost) : rc.cost)}
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
        const displayTotal = finalPrice(combo.totalPrice);

        const grouped: Array<{ category: RoomCategory; count: number; cap: number; totalRoomCost: number }> = [];
        for (const r of combo.rooms) {
          const existing = grouped.find(g => g.category === r.category);
          if (existing) {
            existing.count++;
            existing.totalRoomCost += r.roomCost;
          } else {
            grouped.push({ category: r.category, count: 1, cap: ROOM_DATA[r.category].cap, totalRoomCost: r.roomCost });
          }
        }

        const rawTotal = combo.totalPrice;
        const groupRawPrices = grouped.map(g => Math.round(rawTotal * g.totalRoomCost / combo.rooms.reduce((s, r) => s + r.roomCost, 0)));
        const rawSum = groupRawPrices.reduce((s, p) => s + p, 0);
        groupRawPrices[groupRawPrices.length - 1] += rawTotal - rawSum;
        const groupDisplayPrices = groupRawPrices.map(p => earlyBooking ? applyEarlyDiscount(p) : p);
        const displaySum = groupDisplayPrices.reduce((s, p) => s + p, 0);
        if (displaySum !== displayTotal) {
          groupDisplayPrices[groupDisplayPrices.length - 1] += displayTotal - displaySum;
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

              <div className="space-y-3" data-testid="confirm-rooms-list">
                {grouped.map((g, i) => {
                  const info = ROOM_DATA[g.category];
                  return (
                    <div key={i} className="flex gap-3 items-start bg-secondary/20 rounded-lg p-3" data-testid={`confirm-room-${i}`}>
                      <div className="w-16 h-12 rounded-md overflow-hidden bg-secondary shrink-0">
                        <img src={info.image} alt={g.category} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm" data-testid={`confirm-room-name-${i}`}>
                          {g.count > 1 ? `${g.count}× ${info.shortTitle}` : g.category}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          до {g.cap} гостей{g.count > 1 ? ` × ${g.count} номера` : ""}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary text-sm" data-testid={`confirm-room-price-${i}`}>{formatPrice(groupDisplayPrices[i])}</p>
                        <p className="text-xs text-muted-foreground">за {combo.nights} {nightsLabel(combo.nights)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-primary/5 rounded-xl p-4 space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  {combo.nights} {nightsLabel(combo.nights)}
                  {numRooms > 1 && ` · ${numRooms} ${numRooms === 2 ? "номера" : numRooms <= 4 ? "номера" : "номеров"}`}
                </p>
                {earlyBooking && (
                  <p className="text-sm text-muted-foreground line-through" data-testid="confirm-old-price">{formatPrice(combo.totalPrice)}</p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground">Итоговая стоимость:</span>
                  <span className="text-2xl font-bold font-display text-primary" data-testid="confirm-total-price">{formatPrice(displayTotal)}</span>
                </div>
                {earlyBooking && (
                  <p className="text-xs font-medium text-green-600">Скидка раннего бронирования</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground italic">* Расчёт является предварительным</p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setConfirmingCombo(null)} data-testid="confirm-cancel">Назад</Button>
                <Button className="flex-1" onClick={handleProceedToBooking} data-testid="confirm-book">Забронировать этот вариант</Button>
              </div>
            </div>
          </div>
        );
      })()}

      {selectedCombo && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setSelectedCombo(null)}
          data-testid="modal-overlay"
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-booking"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-primary">Оставить заявку</h3>
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

            <div className="space-y-3 text-sm">
              <p className="font-medium text-foreground" data-testid="modal-room-label">
                {selectedCombo.rooms.length === 1
                  ? selectedCombo.rooms[0].category
                  : selectedCombo.label}
              </p>
              <p className="text-muted-foreground text-xs">
                {checkIn} — {checkOut} · {selectedCombo.nights} {nightsLabel(selectedCombo.nights)}
              </p>
              <div className="bg-secondary/30 rounded-lg p-3 space-y-1.5 text-sm">
                {selectedCombo.rooms.length > 1 && (
                  <div className="space-y-1 pb-1.5 border-b border-border/50">
                    {selectedCombo.rooms.map((r, i) => (
                      <div key={i} className="text-xs text-muted-foreground">
                        {ROOM_DATA[r.category].shortTitle}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  {earlyBooking && (
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span></span>
                      <span className="line-through">{formatPrice(selectedCombo.totalPrice)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 font-bold text-foreground">
                    <span>Итого:</span>
                    <span className="text-primary text-lg" data-testid="modal-total-price">
                      {formatPrice(finalPrice(selectedCombo.totalPrice))}
                    </span>
                  </div>
                  {earlyBooking && (
                    <div className="text-xs text-green-600 text-right">Скидка раннего бронирования</div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="space-y-2">
                <Label>Ваше имя</Label>
                <Input data-testid="booking-name" placeholder="Иван Иванов" value={contactName} onChange={(e) => setContactName(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input data-testid="booking-phone" placeholder="+7 900 123 45 67" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="h-12" inputMode="tel" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedCombo(null)}>Отмена</Button>
                <Button type="submit" className="flex-1" disabled={createBooking.isPending} data-testid="button-submit-booking">
                  {createBooking.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Отправить"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
