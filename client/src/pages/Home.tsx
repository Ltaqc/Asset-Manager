import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { RoomImageCarousel } from "@/components/RoomImageCarousel";
import { getDefaultCheckIn, getDefaultCheckOut, ROOM_DATA } from "@/lib/roomData";
import { roomCategories } from "@shared/schema";
import {
  Users, Utensils, Maximize2,
  RectangleVertical,
  Phone, Mail, MapPin, Navigation,
  CheckCircle2, CircleDot,
} from "lucide-react";
import {
  GlassIcon, ChickenWingIcon, PopsicleIcon,
  SunloungerIcon, RopeParkIcon, BilliardIcon, MiniGolfIcon,
  LoungeChairIcon, TreeLeafIcon, PoolIcon, KidsRoomIcon,
} from "@/components/CustomIcons";
import { YandexMap } from "@/components/YandexMap";
import heroImage from "@assets/ChatGPT_Image_7_февр._2026_г.,_13_52_16_1770462591520.png";
import foodPhoto1 from "@assets/ChatGPT_Image_8_февр._2026_г.,_18_05_56_1770563622557.png";
import foodPhoto2 from "@assets/ChatGPT_Image_8_февр._2026_г.,_16_20_50_1770563622554.png";
import foodPhoto3 from "@assets/ChatGPT_Image_8_февр._2026_г.,_16_21_25_1770563622555.png";
import foodPhoto4 from "@assets/ChatGPT_Image_8_февр._2026_г.,_15_58_53_1770563622551.png";

const FOOD_GALLERY = [foodPhoto1, foodPhoto2, foodPhoto3, foodPhoto4];

import territoryBeach from "@/assets/images/territory-beach.jpg";
import territoryPool from "@/assets/images/territory-pool.jpg";
import territoryVip from "@/assets/images/territory-vip-loungers.jpg";
import territoryLounge from "@/assets/images/territory-lounge.jpg";
import territoryRestaurant from "@/assets/images/territory-restaurant.jpg";
import territoryTerrace from "@/assets/images/territory-terrace.jpg";
import territoryBar from "@/assets/images/territory-bar.jpg";
import territoryKids from "@/assets/images/territory-kids.jpg";
import territoryRestTerrace from "@/assets/images/territory-rest-terrace.jpg";

const TERRITORY_GALLERY = [
  territoryBeach,
  territoryPool,
  territoryVip,
  territoryLounge,
  territoryRestaurant,
  territoryTerrace,
  territoryBar,
  territoryKids,
  territoryRestTerrace,
];

export default function Home() {
  const [, navigate] = useLocation();
  const defaultIn = getDefaultCheckIn();
  const [checkIn, setCheckIn] = useState(defaultIn);
  const [checkOut, setCheckOut] = useState(getDefaultCheckOut(defaultIn));
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn, checkOut,
      adults: String(adults),
      teens: String(teens),
      children: String(children),
      toddlers: String(toddlers),
    });
    navigate(`/search?${params.toString()}`);
  };

  const scrollToCalculator = () => {
    const el = document.getElementById("calculator");
    if (el) {
      const navHeight = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 1. Hero */}
      <header id="hero" className="relative h-[42vh] overflow-hidden">
        <img
          src={heroImage}
          alt="AL MARE — отель с бассейном"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="relative px-16 py-10">
            <div className="absolute inset-0 rounded-full bg-black/60 blur-3xl scale-125 pointer-events-none" />
            <h1 className="relative text-5xl md:text-6xl font-display font-bold text-white tracking-tight" data-testid="text-hero-title">
              AL MARE
            </h1>
            <p className="relative text-xs md:text-sm text-white/85 mt-3 font-light tracking-[0.3em] uppercase" data-testid="text-hero-subtitle">
              Ultra All Inclusive Resort
            </p>
          </div>
        </div>
      </header>

      {/* 2. Calculator */}
      <section id="calculator" className="pt-16 pb-10 bg-white scroll-mt-16" data-testid="section-search-form">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Рассчитайте стоимость проживания"
            subtitle="Укажите даты и состав гостей, чтобы увидеть подходящие номера с ценами"
          />

          <form onSubmit={handleCalculate} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-border/50 p-6 md:p-8 space-y-6">
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
                  className="h-12 bg-secondary/30 border-primary/20"
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
                  className="h-12 bg-secondary/30 border-primary/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-primary font-semibold">Состав гостей</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Взрослые (18+)</Label>
                  <Input data-testid="input-adults" type="number" min={1} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))} className="bg-secondary/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Подростки (13-18)</Label>
                  <Input data-testid="input-teens" type="number" min={0} value={teens} onChange={(e) => setTeens(Math.max(0, Number(e.target.value)))} className="bg-secondary/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Дети (2-13)</Label>
                  <Input data-testid="input-children" type="number" min={0} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))} className="bg-secondary/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Малыши (0-2)</Label>
                  <Input data-testid="input-toddlers" type="number" min={0} value={toddlers} onChange={(e) => setToddlers(Math.max(0, Number(e.target.value)))} className="bg-secondary/30" />
                </div>
              </div>
            </div>

            <Button
              data-testid="button-calculate"
              type="submit"
              className="w-full h-14 text-lg font-bold bg-primary shadow-lg shadow-primary/20 rounded-xl"
            >
              Рассчитать стоимость проживания
            </Button>
          </form>
        </div>
      </section>

      {/* 3. Rooms (moved up) */}
      <section id="rooms" className="py-24 bg-secondary/20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Наши номера"
            subtitle="Элегантность и комфорт в каждой детали. Выберите подходящий вариант размещения для идеального отдыха."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomCategories.map((category) => {
              const info = ROOM_DATA[category];
              return (
                <Card key={category} className="room-card overflow-hidden border-border/50 shadow-md flex flex-col" data-testid={`room-card-${category}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {info.images && info.images.length > 1 ? (
                      <RoomImageCarousel images={info.images} alt={category} className="room-card-img w-full h-full object-cover" />
                    ) : (
                      <img src={info.image} alt={category} className="room-card-img w-full h-full object-cover" />
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-bold shadow-sm">
                        <Users className="w-3 h-3 mr-1" /> до {info.cap} чел.
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <h3 className="text-lg font-bold font-display text-foreground">{category}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5" data-testid={`text-area-${category}`}>
                        <Maximize2 className="w-3.5 h-3.5 text-primary/60" />
                        {info.area} м²
                      </span>
                      <span className="flex items-center gap-1.5" data-testid={`text-capacity-${category}`}>
                        <Users className="w-3.5 h-3.5 text-primary/60" />
                        до {info.cap} гостей
                      </span>
                    </div>
                    <Button className="w-full mt-auto" data-testid={`button-calc-${category}`} onClick={scrollToCalculator}>
                      Рассчитать стоимость
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground italic">
              * Все категории номеров включают обслуживание Ultra All Inclusive
            </p>
          </div>
        </div>
      </section>

      {/* 4. About */}
      <section id="about" className="py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Об отеле"
            subtitle="Современный курортный отель для комфортного отдыха у моря"
          />
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              AL MARE — это современный курортный отель у моря, созданный для спокойного, комфортного и продуманного отдыха.
            </p>
            <p>
              Мы делаем акцент на уютной атмосфере, внимательном сервисе и формате отдыха, где всё уже включено в стоимость проживания.
            </p>
            <p>
              Отель подойдёт для пар, семей и гостей, которые ценят комфорт, тишину и качественный сервис.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Ultra All Inclusive */}
      <section id="uai" className="py-24 bg-secondary/20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Ultra All Inclusive в AL MARE"
            subtitle="Отдых без лишних доплат и постоянных расчётов"
          />
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>
                Формат Ultra All Inclusive в AL MARE — это отдых без лишних доплат и постоянных расчётов.
                Вы отдыхаете, а мы заранее позаботились обо всём необходимом.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-base font-semibold text-foreground">В стоимость проживания включено:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Проживание в выбранной категории номера",
                  "Трёхразовое питание по меню (завтрак, обед, ужин)",
                  "Напитки в течение дня",
                  "Пользование пляжем и шезлонгами",
                  "Доступ к инфраструктуре отеля",
                  "Верёвочный парк для гостей отеля",
                  "Развлечения и активности для гостей",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Food */}
      <section id="food" className="py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Питание в AL MARE"
            subtitle="Индивидуальное обслуживание по меню — свежесть и качество в каждом блюде"
          />
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  В AL MARE питание организовано в формате обслуживания по меню.
                  Гости выбирают блюда, а мы готовим их индивидуально — это позволяет сохранить высокое качество, свежесть и красивую подачу.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-base font-semibold text-foreground">В течение дня для гостей доступны:</p>
                <div className="space-y-3">
                  {[
                    { icon: Utensils, label: "Завтрак, обед и ужин по меню" },
                    { icon: GlassIcon, label: "Напитки без ограничений в течение дня" },
                    { icon: ChickenWingIcon, label: "Зона барбекю для уютных вечеров" },
                    { icon: PopsicleIcon, label: "Мороженое для взрослых и детей" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <RoomImageCarousel
                images={FOOD_GALLERY}
                alt="Ресторан AL MARE"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Beach */}
      <section id="beach" className="py-24 bg-secondary/20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Пляж и отдых у моря"
            subtitle="Комфортный отдых у воды"
          />
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Для гостей AL MARE пляж — это часть комфортного отдыха.
                  Мы позаботились о том, чтобы вы могли просто наслаждаться морем.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-base font-semibold text-foreground">Включено:</p>
                <div className="space-y-3">
                  {[
                    { icon: GlassIcon, label: "Напитки без ограничений в течение дня" },
                    { icon: PopsicleIcon, label: "Мороженое для взрослых и детей" },
                    { icon: ChickenWingIcon, label: "Зона барбекю для уютных вечеров" },
                    { icon: SunloungerIcon, label: "Шезлонги для гостей отеля на пляже" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-base font-semibold text-foreground">Игры на песке для гостей отеля:</p>
                <div className="space-y-3">
                  {[
                    { icon: CircleDot, label: "Петанк — игра с металлическими шарами на песке" },
                    { icon: RectangleVertical, label: "Кубб — скандинавская игра с деревянными брусками" },
                    { icon: RopeParkIcon, label: "Верёвочный парк — активный отдых и развлечения для детей и взрослых" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"
                alt="Пляж AL MARE"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Infrastructure & Territory (merged) */}
      <section id="infrastructure" className="py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Инфраструктура и развлечения"
            subtitle="Развлечения для спокойного и активного отдыха"
          />

          <div className="max-w-6xl mx-auto space-y-10">
            <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              На территории отеля предусмотрена продуманная инфраструктура для комфортного отдыха всей семьи — от расслабляющих зон до активных развлечений на свежем воздухе.
            </p>

            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { icon: BilliardIcon, label: "Бильярд", desc: "Спокойный отдых в уютной атмосфере" },
                  { icon: MiniGolfIcon, label: "Мини-гольф", desc: "Увлекательное развлечение для всей семьи" },
                  { icon: RopeParkIcon, label: "Верёвочный парк", desc: "Яркие эмоции для детей и взрослых" },
                  { icon: LoungeChairIcon, label: "Зоны отдыха", desc: "Комфортные пространства для расслабления" },
                  { icon: TreeLeafIcon, label: "Ухоженная территория", desc: "Зелёная и аккуратная территория отеля" },
                  { icon: PoolIcon, label: "Бассейн", desc: "Подогреваемый бассейн для отдыха взрослых и детей" },
                  { icon: KidsRoomIcon, label: "Детская комната", desc: "Игровое пространство для детей с безопасной средой" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-2xl" data-testid={`infra-icon-${i}`}>
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground leading-snug">{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
                <RoomImageCarousel
                  images={TERRITORY_GALLERY}
                  alt="Территория AL MARE"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Contacts */}
      <section id="contacts" className="py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Контакты"
            subtitle="Свяжитесь с нами любым удобным способом"
          />

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Адрес</h3>
                    <a href="https://yandex.ru/maps/?rtext=~45.326978,37.290373&rtt=auto&text=ст. Голубицкая, ул. Набережная, д. 7" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors leading-relaxed" data-testid="contact-address">
                      ст. Голубицкая, ул. Набережная, д. 7
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Телефон</h3>
                    <a href="tel:+79184710374" className="text-muted-foreground hover:text-primary transition-colors text-base" data-testid="contact-phone">
                      +7 (918) 471-03-74
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Email</h3>
                    <a href="mailto:info@almare.ru" className="text-muted-foreground hover:text-primary transition-colors text-base" data-testid="contact-email">
                      info@almare.ru
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border/30">
                  <YandexMap className="w-full h-[400px]" />
                </div>
                <a
                  href="https://yandex.ru/maps/?rtext=~45.326978,37.290373&rtt=auto&text=ст. Голубицкая, ул. Набережная, д. 7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full" data-testid="button-route">
                    <Navigation className="w-4 h-4 mr-2" />
                    Построить маршрут
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
