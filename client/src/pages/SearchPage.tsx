import { useState, useMemo } from "react";
import { useSearch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { Users, AlertCircle, Loader2 } from "lucide-react";
import { roomCategories } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import {
  ROOM_DATA, FOOD_RATES, RoomCategory,
  formatPrice, calculateStay, isRoomSuitable, nightsLabel,
  getDefaultCheckIn, getDefaultCheckOut, CalcResult,
  isEarlyBooking, applyEarlyDiscount,
} from "@/lib/roomData";

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

  const [selectedRoom, setSelectedRoom] = useState<RoomCategory | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const createBooking = useCreateBooking();

  const earlyBooking = useMemo(() => isEarlyBooking(checkIn), [checkIn]);

  const suitableRooms = useMemo(() => {
    const results: Array<{ category: RoomCategory; result: CalcResult }> = [];

    for (const category of roomCategories) {
      const info = ROOM_DATA[category];
      if (!isRoomSuitable(category, adults, teens, children, toddlers)) continue;

      const calc = calculateStay(category, checkIn, checkOut, adults, teens, children);
      if (!calc || "error" in calc) continue;

      results.push({ category, result: calc });
    }

    return results;
  }, [checkIn, checkOut, adults, teens, children, toddlers]);

  const seasonError = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const calc = calculateStay(roomCategories[0], checkIn, checkOut, adults, teens, children);
    if (calc && "error" in calc) return calc.error;
    return null;
  }, [checkIn, checkOut, adults, teens, children]);

  const handleBook = (category: RoomCategory) => {
    setSelectedRoom(category);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    const calc = calculateStay(selectedRoom, checkIn, checkOut, adults, teens, children);
    if (!calc || "error" in calc) return;

    const finalPrice = earlyBooking ? applyEarlyDiscount(calc.total) : calc.total;

    createBooking.mutate({
      roomCategory: selectedRoom,
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
        setSelectedRoom(null);
        setContactName("");
        setContactPhone("");
      }
    });
  };

  return (
    <div className="bg-secondary/10 min-h-screen">
      <section className="py-12 bg-white border-b border-border/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8">Подбор номеров</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-1.5">
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
                className="bg-secondary/30 border-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Дата выезда</Label>
              <Input
                data-testid="search-checkout"
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-secondary/30 border-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Взрослые (18+)</Label>
              <Input data-testid="search-adults" type="number" min={1} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))} className="bg-secondary/30" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Подростки (13-18)</Label>
              <Input data-testid="search-teens" type="number" min={0} value={teens} onChange={(e) => setTeens(Math.max(0, Number(e.target.value)))} className="bg-secondary/30" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Дети (2-13)</Label>
              <Input data-testid="search-children" type="number" min={0} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))} className="bg-secondary/30" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Малыши (0-2)</Label>
              <Input data-testid="search-toddlers" type="number" min={0} value={toddlers} onChange={(e) => setToddlers(Math.max(0, Number(e.target.value)))} className="bg-secondary/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {seasonError ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Нет доступных номеров</h2>
              <p className="text-muted-foreground text-lg">{seasonError}</p>
            </div>
          ) : suitableRooms.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Нет подходящих номеров</h2>
              <p className="text-muted-foreground text-lg">
                Для указанного состава гостей подходящих номеров не найдено. Попробуйте изменить параметры поиска.
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8" data-testid="text-results-count">
                Найдено подходящих категорий: {suitableRooms.length}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suitableRooms.map(({ category, result }) => {
                  const info = ROOM_DATA[category];
                  return (
                    <Card key={category} className="room-card overflow-hidden border-border/50 shadow-md flex flex-col" data-testid={`card-room-${category}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <img
                          src={info.image}
                          alt={category}
                          className="room-card-img w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-bold shadow-sm">
                            <Users className="w-3 h-3 mr-1" /> до {info.cap} чел.
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 gap-4">
                        <h3 className="text-lg font-bold font-display text-foreground">{category}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{info.description}</p>

                        <div className="bg-primary/5 rounded-xl p-4 space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {result.nights} {nightsLabel(result.nights)}
                          </div>
                          {earlyBooking ? (
                            <>
                              <div className="text-base text-muted-foreground line-through" data-testid={`price-old-${category}`}>
                                {formatPrice(result.total)}
                              </div>
                              <div className="text-2xl font-bold font-display text-primary" data-testid={`price-total-${category}`}>
                                {formatPrice(applyEarlyDiscount(result.total))}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatPrice(Math.round(applyEarlyDiscount(result.total) / result.nights))} за ночь
                              </div>
                              <div className="text-xs font-medium text-green-600" data-testid={`discount-label-${category}`}>
                                Скидка раннего бронирования
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-2xl font-bold font-display text-primary" data-testid={`price-total-${category}`}>
                                {formatPrice(result.total)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatPrice(result.perNight)} за ночь
                              </div>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground italic">
                          * Расчёт является предварительным
                        </p>

                        <Button
                          data-testid={`button-select-${category}`}
                          className="w-full mt-auto"
                          onClick={() => handleBook(category)}
                        >
                          Выбрать номер
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()} data-testid="modal-booking">
            <h3 className="text-xl font-display font-bold text-primary">Оставить заявку</h3>
            <p className="text-sm text-muted-foreground">{selectedRoom}</p>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="space-y-2">
                <Label>Ваше имя</Label>
                <Input data-testid="booking-name" placeholder="Иван Иванов" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input data-testid="booking-phone" placeholder="+7 900 123 45 67" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedRoom(null)}>Отмена</Button>
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
