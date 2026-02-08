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
  Users, Maximize2,
  Phone, Mail, MapPin, Navigation,
} from "lucide-react";
import { YandexMap } from "@/components/YandexMap";
import heroImage from "@assets/ChatGPT_Image_7_февр._2026_г.,_13_52_16_1770462591520.png";

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

      {/* 3. Rooms */}
      <section id="rooms" className="py-24 bg-white scroll-mt-16">
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

      {/* 4. Territory */}
      <section id="territory" className="py-24 bg-secondary/20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="На территории комплекса"
            subtitle="Всё для комфортного отдыха — у моря и на территории отеля"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Благоустроенный пляж",
                desc: "Собственный пляж с мелкой галькой и пологим входом в море",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop",
              },
              {
                title: "Бассейн",
                desc: "Открытый бассейн с подогревом и зоной для детей",
                img: "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&auto=format&fit=crop",
              },
              {
                title: "VIP-шезлонги",
                desc: "Комфортные шезлонги у бассейна и на пляже для гостей отеля",
                img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop",
              },
              {
                title: "Lounge-зона",
                desc: "Уютное пространство для отдыха с мягкой мебелью и видом на территорию",
                img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop",
              },
              {
                title: "Ресторан",
                desc: "Трёхразовое питание по меню — свежие блюда и индивидуальная подача",
                img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop",
              },
              {
                title: "Открытая терраса",
                desc: "Зона для завтраков и ужинов на свежем воздухе с видом на море",
                img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop",
              },
              {
                title: "Летний бар",
                desc: "Прохладительные и алкогольные напитки в течение дня — всё включено",
                img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop",
              },
              {
                title: "Детская комната",
                desc: "Игровое пространство для детей с развлечениями и присмотром",
                img: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&auto=format&fit=crop",
              },
              {
                title: "Террасы для отдыха",
                desc: "Уединённые зоны с мягкими креслами и тенью для спокойного отдыха",
                img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop",
              },
            ].map((item, i) => (
              <Card key={i} className="overflow-hidden border-border/50 shadow-md" data-testid={`territory-card-${i}`}>
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base font-display text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contacts */}
      <section id="contacts" className="py-24 bg-blue-50/50 scroll-mt-16">
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
