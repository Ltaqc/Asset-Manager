import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { getDefaultCheckIn, getDefaultCheckOut, ROOM_DATA } from "@/lib/roomData";
import { roomCategories } from "@shared/schema";
import {
  Users, Utensils, Sun, Flame, Coffee,
  Footprints, Umbrella, ShowerHead,
  Waves, Car, TreePine,
  Phone, Mail, MapPin, Navigation,
} from "lucide-react";
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
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
      </header>

      {/* 2. Calculator */}
      <section id="calculator" className="py-10 bg-white" data-testid="section-search-form">
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

      {/* 3. About */}
      <section id="about" className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Об отеле"
            subtitle="Ваш идеальный отдых у моря в формате Ultra All Inclusive"
          />
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              AL MARE — курортный отель на побережье, созданный для тех, кто ценит комфорт и спокойный отдых у моря. Современные номера, ухоженная территория и продуманный сервис делают пребывание по-настоящему приятным.
            </p>
            <p>
              Формат Ultra All Inclusive означает, что всё включено с момента заезда: питание в ресторанах, напитки, пользование инфраструктурой, пляжные удобства и развлечения на территории. Никаких скрытых доплат — вы просто отдыхаете.
            </p>
            <p>
              AL MARE — это уютный курортный отель для спокойного отдыха у моря с комфортными номерами и продуманной инфраструктурой.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Rooms */}
      <section id="rooms" className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Наши номера"
            subtitle="Элегантность и комфорт в каждой детали. Выберите подходящий вариант размещения для идеального отдыха."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomCategories.map((category) => {
              const info = ROOM_DATA[category];
              return (
                <Card key={category} className="overflow-hidden border-border/50 shadow-md flex flex-col group transition-all duration-[350ms] ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-black/8" data-testid={`room-card-${category}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={info.image} alt={category} className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-bold shadow-sm">
                        <Users className="w-3 h-3 mr-1" /> до {info.cap} чел.
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <h3 className="text-lg font-bold font-display text-foreground">{category}</h3>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Вместимость: до {info.cap} {info.cap < 5 ? "гостей" : "гостей"}
                    </p>
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

      {/* 5. Food */}
      <section id="food" className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Питание Ultra All Inclusive"
            subtitle="Всё включено с момента заезда — без доплат и ограничений"
          />
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Формат Ultra All Inclusive означает, что всё питание включено в стоимость проживания.
                  Завтрак, обед и ужин — шведский стол с широким выбором горячих блюд, салатов, выпечки и десертов.
                </p>
                <p>
                  В течение дня доступны лёгкие закуски, безалкогольные и алкогольные напитки, мороженое, свежие фрукты и выпечка.
                  На территории отеля работают барбекю-зоны для приготовления на углях.
                </p>
                <p>
                  Питание подходит для взрослых и детей — есть отдельное детское меню.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Utensils, label: "Трёхразовое питание" },
                  { icon: Coffee, label: "Напитки весь день" },
                  { icon: Flame, label: "Барбекю на свежем воздухе" },
                  { icon: Sun, label: "Перекусы и мороженое" },
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
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop"
                alt="Питание AL MARE"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Beach */}
      <section id="beach" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Пляж AL MARE"
            subtitle="Спокойный отдых у самого моря"
          />
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Отель AL MARE расположен рядом с морем — до пляжа можно дойти пешком.
                  Гостей ждёт спокойный пляжный отдых: просторная береговая линия, комфортный вход в море и возможность провести весь день у воды.
                </p>
                <p>
                  Для гостей предусмотрены лежаки и базовая пляжная инфраструктура.
                  После моря можно вернуться в отель, принять душ и продолжить отдых в формате Ultra All Inclusive.
                </p>
                <p>
                  Пляж подходит для семей с детьми и для гостей, ценящих размеренный отдых.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Footprints, label: "Пешком до моря" },
                  { icon: Umbrella, label: "Спокойная пляжная зона" },
                  { icon: ShowerHead, label: "Душ и удобства на территории" },
                  { icon: Users, label: "Комфортно для детей и взрослых" },
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

      {/* 7. Infrastructure */}
      <section id="infrastructure" className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Инфраструктура"
            subtitle="Всё необходимое для незабываемого отдыха на территории отеля"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Car, label: "Парковка включена" },
              { icon: Waves, label: "Бассейн" },
              { icon: TreePine, label: "Зоны отдыха" },
              { icon: Users, label: "Детский клуб" },
              { icon: ShowerHead, label: "Душ и туалет" },
              { icon: Umbrella, label: "Лежаки" },
              { icon: Sun, label: "Мини-гольф" },
              { icon: Utensils, label: "3 ресторана" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-24 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-secondary/20 rounded-2xl p-8 space-y-4">
                <h3 className="text-xl font-display font-bold text-primary">Для взрослых</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Бассейн с подогревом</li>
                  <li>Зона барбекю</li>
                  <li>Мини-гольф</li>
                  <li>Бесплатная парковка</li>
                  <li>Wi-Fi на территории</li>
                </ul>
              </div>
              <div className="bg-secondary/20 rounded-2xl p-8 space-y-4">
                <h3 className="text-xl font-display font-bold text-primary">Для детей</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Детский клуб с аниматорами</li>
                  <li>Детский бассейн</li>
                  <li>Игровая площадка</li>
                  <li>Детское меню в ресторанах</li>
                  <li>Безопасная территория</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contacts */}
      <section id="contacts" className="py-24 bg-blue-50/50">
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
                    <a href="https://yandex.ru/maps/org/al_mare/70147997197/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors leading-relaxed" data-testid="contact-address">
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
                    <a href="tel:+78001234567" className="text-muted-foreground hover:text-primary transition-colors text-base" data-testid="contact-phone">
                      +7 (800) 123-45-67
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
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?z=16&ol=biz&oid=70147997197"
                    width="100%"
                    height="400"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    title="AL MARE на карте"
                    data-testid="contacts-map"
                  />
                </div>
                <a
                  href="https://yandex.ru/maps/org/al_mare/70147997197/"
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
