import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SeasonCalendar } from "@/components/SeasonCalendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { RoomImageCarousel } from "@/components/RoomImageCarousel";
import { ROOM_DATA } from "@/lib/roomData";
import { roomCategories } from "@shared/schema";
import {
  Users, Utensils, Maximize2,
  RectangleVertical,
  Phone, Mail, MapPin, Navigation, Send,
  CheckCircle2, CircleDot,
  Waves, UtensilsCrossed, Droplets, Sparkles, Wine, Trophy, PartyPopper, MessageCircle,
} from "lucide-react";
import { GuestCounter } from "@/components/GuestCounter";
import {
  GlassIcon, ChickenWingIcon, PopsicleIcon,
  SunloungerIcon, RopeParkIcon, BilliardIcon, MiniGolfIcon,
  LoungeChairIcon, TreeLeafIcon, PoolIcon, KidsRoomIcon, KidsAnimationIcon,
  AquaparkIcon, BeachCafeIcon, VolleyballIcon,
} from "@/components/CustomIcons";
import { YandexMap } from "@/components/YandexMap";

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.48 2 2 6.04 2 11c0 2.8 1.5 5.28 3.84 6.88L4.5 22l4.2-2.12C9.76 20.28 10.86 20.5 12 20.5c5.52 0 10-4.04 10-9S17.52 2 12 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
import heroImage from "@assets/optimized/hero_main_1770643186337.webp";
import foodPhoto1 from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_18_05_56_1770563622557.webp";
import foodPhoto2 from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_16_20_50_1770563622554.webp";
import foodPhoto3 from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_16_21_25_1770563622555.webp";
import foodPhoto4 from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_15_58_53_1770563622551.webp";
import beachPetanque from "@assets/optimized/beach_petanque_wide_1770566998764.webp";
import beachKubb from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_19_09_28_1770566998766.webp";
import beachRopePark from "@assets/optimized/ChatGPT_Image_5_февр._2026_г.,_13_40_37_1770566998762.webp";
import beachLoungeMain from "@assets/optimized/beach_lounge_main_1770570903453.webp";
import beachLoungeAlt from "@assets/optimized/beach_lounge_alt_1770570903455.webp";
import beachSeaSparkling from "@assets/optimized/beach_sea_sparkling_1770571117379.webp";
import beachCafe from "@assets/optimized/beach_cafe_1770640618446.webp";
import beachAquapark from "@assets/optimized/beach_aquapark_1770641467286.webp";

const FOOD_GALLERY = [foodPhoto1, foodPhoto2, foodPhoto3, foodPhoto4];
const BEACH_GALLERY = [
  beachLoungeMain,
  beachSeaSparkling,
  beachCafe,
  beachAquapark,
  beachLoungeAlt,
  beachPetanque,
  beachKubb,
  beachRopePark,
];

import infraMain from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_12_38_02_1770569019465.webp";
import infraKidsRoom from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_19_12_15_1770569019466.webp";
import infraBilliard from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_19_16_58_1770569019467.webp";
import infraMiniGolf from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_19_20_08_1770569019468.webp";
import infraPool from "@assets/optimized/ChatGPT_Image_8_февр._2026_г.,_19_27_57_1770569019469.webp";
import infraBbq from "@assets/optimized/infra_bbq_1770569019471.webp";
import infraLounge from "@assets/optimized/WhatsApp_Image_2019-05-16_at_20.39.10_1770569019472.webp";
import infraTerrace from "@assets/optimized/WhatsApp_Image_2019-05-16_at_20.43.38_1770569019472.webp";
import infraRopePark from "@assets/optimized/ChatGPT_Image_5_февр._2026_г.,_13_40_37_1770569019473.webp";
import infraHotel from "@assets/optimized/ChatGPT_Image_7_февр._2026_г.,_13_52_16_1770569019474.webp";

const TERRITORY_GALLERY = [
  infraMain,
  infraHotel,
  infraPool,
  infraBilliard,
  infraMiniGolf,
  infraRopePark,
  infraKidsRoom,
  infraLounge,
  infraTerrace,
  infraBbq,
];

export default function Home() {
  const [, navigate] = useLocation();
  const MIN_NIGHTS = 3;

  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const year = today.getFullYear();

  const seasonStartDate = new Date(year, 5, 1);
  const seasonEndDate = new Date(year, 8, 15);

  let SEASON_START: string;
  let SEASON_END: string;
  let defaultCheckIn: string;

  if (today < seasonStartDate) {
    SEASON_START = `${year}-06-01`;
    SEASON_END = `${year}-09-15`;
    defaultCheckIn = SEASON_START;
  } else if (today > seasonEndDate) {
    SEASON_START = `${year + 1}-06-01`;
    SEASON_END = `${year + 1}-09-15`;
    defaultCheckIn = SEASON_START;
  } else {
    SEASON_START = `${year}-06-01`;
    SEASON_END = `${year}-09-15`;
    defaultCheckIn = todayStr;
  }

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);
  const [dateError, setDateError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const minCheckIn = todayStr > SEASON_START && todayStr <= SEASON_END ? todayStr : SEASON_START;
  const minCheckOut = checkIn ? addDays(checkIn, MIN_NIGHTS) : addDays(SEASON_START, MIN_NIGHTS);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      showToast("Выберите даты проживания");
      return;
    }
    if (checkIn < SEASON_START || checkIn > SEASON_END) {
      setDateError("Дата заезда должна быть в пределах сезона");
      return;
    }
    if (checkOut <= checkIn || checkOut > SEASON_END) {
      setDateError("Дата выезда должна быть в пределах сезона");
      return;
    }
    const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    if (nights < MIN_NIGHTS) {
      setDateError(`Минимальный срок проживания — ${MIN_NIGHTS} ночи`);
      return;
    }
    setDateError("");
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
      <header id="hero" className="relative h-[36vh] md:h-[42vh] overflow-hidden">
        <img
          src={heroImage}
          alt="AL MARE — отель с бассейном"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 65% at 50% 48%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="relative text-4xl md:text-6xl font-display font-bold text-white tracking-tight" data-testid="text-hero-title">
            AL MARE
          </h1>
          <p className="relative text-[10px] md:text-sm text-white/85 mt-2 md:mt-3 font-light tracking-[0.25em] md:tracking-[0.3em] uppercase" data-testid="text-hero-subtitle">
            Семейный курорт у моря
          </p>
        </div>

      </header>

      {/* 2. UAI Intro */}
      <section className="relative py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center pt-2 md:pt-4">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground leading-tight" data-testid="text-uai-intro-title">
              Ultra All Inclusive на Азовском море
            </h2>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Питание, напитки, пляж, развлечения и ежедневная программа — уже в стоимости проживания
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: Waves, title: "Песчаный пляж и шезлонги", lines: ["Зонты и лежаки уже ждут вас", "Еда и напитки прямо у моря"] },
              { icon: UtensilsCrossed, title: "Ресторан с обслуживанием по меню", lines: ["Блюда готовятся индивидуально", "Широкий выбор блюд на каждый приём"] },
              { icon: Wine, title: "Напитки в течение дня", lines: ["У бассейна, в баре и на побережье", "Без ограничений и доплат"] },
              { icon: Droplets, title: "Аквапарк и верёвочный парк", lines: ["Горки, бассейны, полоса препятствий", "Вход включён в стоимость"] },
              { icon: Trophy, title: "Петанк, кубб и волейбол", lines: ["Оборудованные площадки на побережье", "Весь инвентарь уже на месте"] },
              { icon: PartyPopper, title: "Вечерние и детские программы", lines: ["Анимация днём, живая музыка вечером", "Новые форматы в течение всего сезона"] },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2.5 p-5 md:p-6 rounded-xl bg-secondary/30 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm md:text-base text-foreground font-semibold leading-snug">{item.title}</span>
                <div className="space-y-0.5">
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-xs md:text-sm text-muted-foreground leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 text-center">
            <Button
              type="button"
              onClick={scrollToCalculator}
              className="h-13 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 cursor-pointer touch-manipulation select-none"
              data-testid="button-uai-cta"
            >
              <span className="pointer-events-none">Проверить наличие номеров</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Rooms */}
      <section id="rooms" className="py-14 md:py-24 bg-secondary/20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Наши номера"
            subtitle="Восемь категорий — от уютных стандартов до просторных апартаментов с видом на бассейн"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {roomCategories.map((category) => {
              const info = ROOM_DATA[category];
              return (
                <Card key={category} className="room-card overflow-hidden border-border/50 shadow-md flex flex-col" data-testid={`room-card-${category}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {info.images && info.images.length > 1 ? (
                      <RoomImageCarousel images={info.images} alt={category} className="room-card-img w-full h-full object-cover" />
                    ) : (
                      <img src={info.image} alt={category} className="room-card-img w-full h-full object-cover" loading="lazy" decoding="async" />
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
      <section id="about" className="py-14 md:py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Об отеле"
            subtitle="Курорт на побережье Азовского моря для тех, кто ценит тишину и заботу"
          />
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              AL MARE — камерный курортный отель в станице Голубицкая, созданный для спокойного и продуманного отдыха у моря.
            </p>
            <p>
              Внимательное обслуживание, ухоженная территория и формат «всё включено» позволяют забыть о мелочах и сосредоточиться на главном — настоящем отпуске.
            </p>
            <p>
              Мы принимаем пары, семьи с детьми и небольшие компании, которым важна приватная атмосфера и высокий уровень сервиса.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="pt-10 md:pt-16 pb-8 md:pb-10 bg-secondary/20 scroll-mt-20 transition-shadow duration-500" data-testid="section-search-form">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Подберите отдых Ultra All Inclusive"
            subtitle="Выберите даты проживания и количество гостей"
          />

          <form onSubmit={handleCalculate} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-border/50 p-5 md:p-8 space-y-5 md:space-y-6">
            <p className="text-sm text-muted-foreground text-center -mt-1 mb-1">Отель работает в сезон с 1 июня по 15 сентября</p>
            <p className="text-sm text-muted-foreground text-center -mt-2 mb-1">Минимальный срок проживания — 3 ночи</p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="min-w-0 space-y-2">
                <Label>Дата заезда</Label>
                <SeasonCalendar
                  testId="input-checkin"
                  value={checkIn}
                  onChange={(val) => {
                    setCheckIn(val);
                    setDateError("");
                    if (val && checkOut && checkOut < addDays(val, MIN_NIGHTS)) {
                      setCheckOut("");
                    }
                  }}
                  minDate={minCheckIn}
                  maxDate={SEASON_END}
                  seasonStart={SEASON_START}
                  seasonEnd={SEASON_END}
                  placeholder="Выберите даты"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <Label>Дата выезда</Label>
                <SeasonCalendar
                  testId="input-checkout"
                  value={checkOut}
                  onChange={(val) => { setCheckOut(val); setDateError(""); }}
                  minDate={minCheckOut}
                  maxDate={SEASON_END}
                  seasonStart={SEASON_START}
                  seasonEnd={SEASON_END}
                  placeholder="Выберите даты"
                  disabled={!checkIn}
                />
              </div>
            </div>

            {dateError && (
              <p className="text-sm text-red-500 text-center" data-testid="date-error">{dateError}</p>
            )}

            <div className="space-y-3">
              <Label className="text-primary font-semibold">Состав гостей</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GuestCounter label="Взрослые (18+)" value={adults} onChange={setAdults} min={1} max={6} data-testid="input-adults" />
                <GuestCounter label="Подростки (13-18)" value={teens} onChange={setTeens} min={0} max={6} data-testid="input-teens" />
                <GuestCounter label="Дети (2-13)" value={children} onChange={setChildren} min={0} max={6} data-testid="input-children" />
                <GuestCounter label="Малыши (0-2)" value={toddlers} onChange={setToddlers} min={0} max={4} data-testid="input-toddlers" />
              </div>
            </div>

            <Button
              data-testid="button-calculate"
              type="submit"
              className="w-full h-14 text-lg font-bold bg-primary shadow-lg shadow-primary/20 rounded-xl relative z-[1] cursor-pointer touch-manipulation select-none"
            >
              <span className="pointer-events-none">Рассчитать стоимость проживания</span>
            </Button>
          </form>
        </div>
      </section>

      {/* 5. Ultra All Inclusive */}
      <section id="uai" className="py-14 md:py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Ultra All Inclusive в AL MARE"
            subtitle="Единая стоимость — без доплат, чеков и неожиданностей"
          />
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>
                Вы оплачиваете проживание один раз — всё остальное уже включено.
                Питание, напитки, пляж, развлечения и вся инфраструктура входят в стоимость.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-base font-semibold text-foreground">Что входит в стоимость:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Проживание в выбранной категории номера",
                  "Завтрак, обед и ужин по меню в ресторане",
                  "Напитки без ограничений в течение дня",
                  "Песчаный пляж, шезлонги и зонты",
                  "Бассейн, бильярд, мини-гольф и зоны отдыха",
                  "Верёвочный парк и надувной аквапарк",
                  "Анимация, вечерние программы и спортивные площадки",
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
      <section id="food" className="py-14 md:py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Питание в AL MARE"
            subtitle="Ресторанный формат вместо шведского стола — каждое блюдо готовится для вас"
          />
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1 space-y-5 md:space-y-6">
              <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Вы выбираете блюда из меню, а кухня готовит их персонально.
                  Никаких линий раздачи — только свежая подача, порционное оформление и внимание к деталям.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-base font-semibold text-foreground">Доступно в течение дня:</p>
                <div className="space-y-3">
                  {[
                    { icon: Utensils, label: "Завтрак, обед и ужин — ресторанное обслуживание по меню" },
                    { icon: GlassIcon, label: "Напитки и коктейли без ограничений" },
                    { icon: ChickenWingIcon, label: "Вечерняя зона барбекю на открытом воздухе" },
                    { icon: PopsicleIcon, label: "Мороженое и десерты на территории" },
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
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
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
      <section id="beach" className="py-14 md:py-24 bg-secondary/20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Пляж и побережье"
            subtitle="Собственная береговая линия с полной инфраструктурой — всё по браслету"
          />
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1 space-y-5 md:space-y-6">
              <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Песчаный берег в пешей доступности — с оборудованными зонами для взрослых и детей.
                  Лежаки, навесы, кафе, аквапарк и спортивные площадки работают по системе браслетов без доплат.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-base font-semibold text-foreground">Включено по браслету:</p>
                <div className="space-y-3">
                  {[
                    { icon: SunloungerIcon, label: "Шезлонги и теневые навесы на песке" },
                    { icon: RopeParkIcon, label: "Верёвочный парк с маршрутами разной сложности" },
                    { icon: AquaparkIcon, label: "Надувной аквапарк: горки, бассейны и игровые модули" },
                    { icon: BeachCafeIcon, label: "Кафе у воды — еда и напитки без доплат" },
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
                <p className="text-base font-semibold text-foreground">Спортивные площадки на песке:</p>
                <div className="space-y-3">
                  {[
                    { icon: CircleDot, label: "Петанк — точность и стратегия с металлическими шарами" },
                    { icon: RectangleVertical, label: "Кубб — игра с деревянными фигурами" },
                    { icon: VolleyballIcon, label: "Волейбольная площадка — сетка и мяч всегда наготове" },
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
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <RoomImageCarousel
                images={BEACH_GALLERY}
                alt="Пляж AL MARE"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Infrastructure & Territory (merged) */}
      <section id="infrastructure" className="py-14 md:py-24 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Территория и отдых"
            subtitle="Всё, чем можно заняться между морем и номером"
          />

          <div className="max-w-6xl mx-auto space-y-10">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              Бассейн, детские площадки и тихие уголки для отдыха среди зелени.
            </p>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
              <div className="order-2 md:order-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {[
                  { icon: BilliardIcon, label: "Бильярд", desc: "Партия в тишине и прохладе" },
                  { icon: MiniGolfIcon, label: "Мини-гольф", desc: "Лунки на свежем воздухе для всей семьи" },
                  { icon: RopeParkIcon, label: "Верёвочный парк", desc: "Маршруты для разного возраста и подготовки" },
                  { icon: LoungeChairIcon, label: "Лаунж-зоны", desc: "Тень, кресла и тишина среди зелени" },
                  { icon: TreeLeafIcon, label: "Зелёный двор", desc: "Газоны, дорожки и аккуратный ландшафт" },
                  { icon: PoolIcon, label: "Подогреваемый бассейн", desc: "Чистая вода и комфортная температура каждый день" },
                  { icon: KidsRoomIcon, label: "Детская комната", desc: "Безопасное игровое пространство в помещении" },
                  { icon: KidsAnimationIcon, label: "Ежедневная анимация", desc: "Мастер-классы, квесты и подвижные игры" },
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

              <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
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
      <section id="contacts" className="py-14 md:py-24 bg-white scroll-mt-16">
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

                <a href="tel:+79184710374" className="flex items-center gap-4 group cursor-pointer" data-testid="contact-phone">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Телефон</h3>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors text-base">+7 (918) 471-03-74</span>
                  </div>
                </a>

                <a href="https://t.me/Al_Mare_komplex" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer" data-testid="contact-telegram">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Telegram</h3>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors text-base">Написать в Telegram</span>
                  </div>
                </a>

                <a href="https://max.ru/u/f9LHodD0cOKyZuixF6xW4bLAnYDSqIQ-54OcR3omDgRgkRs2Ji9F1hlf6Rk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer" data-testid="contact-max">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MaxIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">MAX</h3>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors text-base">Написать в MAX</span>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Email</h3>
                    <a href="mailto:almare@hotelalmare.ru" className="text-muted-foreground hover:text-primary transition-colors text-base" data-testid="contact-email">
                      almare@hotelalmare.ru
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border/30">
                  <YandexMap className="w-full h-[280px] md:h-[400px]" />
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

      {/* Toast notification */}
      <div
        data-testid="toast-dates"
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3.5 rounded-2xl text-white text-base font-medium shadow-xl backdrop-blur-sm pointer-events-none transition-all duration-400 ease-in-out ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ background: "rgba(0, 0, 0, 0.85)" }}
      >
        {toast}
      </div>
    </>
  );
}
