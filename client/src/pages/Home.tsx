import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Users, Utensils, Sun, Waves, Footprints, Umbrella, Car, TreePine, ShowerHead, Wifi, Phone, Mail, MapPin, Send } from "lucide-react";
import { getDefaultCheckIn, getDefaultCheckOut, ROOM_DATA, formatPrice, getMinPrice } from "@/lib/roomData";
import { roomCategories } from "@shared/schema";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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

  return (
    <>
      <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 -z-[5]" />

        <div className="container px-4 text-center z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white mb-4 text-shadow-lg">
              AL MARE
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-widest uppercase">
              Ultra All Inclusive Resort
            </p>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Спокойный, комфортный отдых у моря для всей семьи
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-4"
          >
            <Button
              variant="outline"
              className="border-white/40 text-white bg-white/10 backdrop-blur-sm text-lg px-8"
              onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-hero-calc"
            >
              Рассчитать стоимость проживания
            </Button>
          </motion.div>
        </div>
      </header>

      <section id="calculator" className="py-16 bg-white" data-testid="section-search-form">
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

      <section id="about" className="py-20 bg-secondary/20" data-testid="section-about">
        <div className="container mx-auto px-4">
          <SectionHeading title="Отель AL MARE" />
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Мы создаём пространство спокойного, комфортного отдыха у моря.
            </p>
            <p>
              AL MARE — это уютный курортный отель, где всё продумано для семейного и размеренного отдыха: удобные номера, питание в формате Ultra All Inclusive и атмосфера, в которую хочется возвращаться.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-rooms-preview">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Номера"
            subtitle="Выберите подходящий вариант размещения"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomCategories.slice(0, 6).map((category) => {
              const info = ROOM_DATA[category];
              return (
                <Card key={category} className="overflow-hidden border-border/50 shadow-md" data-testid={`home-room-${category}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={info.image}
                      alt={category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold font-display text-foreground">{category}</h3>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                    <p className="text-primary font-semibold text-sm">
                      от {formatPrice(getMinPrice(category))} / сутки
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/rooms">
              <Button variant="outline" data-testid="button-all-rooms">
                Все номера
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden text-white" data-testid="section-food-preview">
        <div className="absolute inset-0 bg-primary -z-20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay -z-10" />
        <div className="container mx-auto px-4">
          <SectionHeading title="Питание Ultra All Inclusive" light />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Utensils, label: "Завтрак, обед и ужин по меню" },
              { icon: Sun, label: "Перекусы в течение дня" },
              { icon: Waves, label: "Напитки, мороженое" },
              { icon: TreePine, label: "Барбекю-зоны" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <item.icon className="w-10 h-10 text-secondary" />
                <span className="font-medium text-white/90">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/food">
              <Button variant="outline" className="border-white/40 text-white bg-white/10 backdrop-blur-sm" data-testid="button-more-food">
                Подробнее о питании
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50/50" data-testid="section-beach-preview">
        <div className="container mx-auto px-4">
          <SectionHeading title="Пляж" />
          <div className="max-w-4xl mx-auto">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4 mb-8">
              <p>
                Отель AL MARE расположен в пешей доступности от моря.
                Пляж подойдёт для спокойного отдыха, прогулок у воды и отдыха с детьми.
              </p>
              <p>
                После моря гости могут вернуться в отель, принять душ и продолжить отдых в комфортной атмосфере.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Footprints, label: "Пешком до моря" },
                { icon: Umbrella, label: "Спокойная пляжная зона" },
                { icon: Users, label: "Подходит для семейного отдыха" },
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
      </section>

      <section className="py-20" data-testid="section-infra-preview">
        <div className="container mx-auto px-4">
          <SectionHeading title="Инфраструктура" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Car, label: "Парковка (включена)" },
              { icon: Sun, label: "Мини-гольф" },
              { icon: TreePine, label: "Зоны отдыха" },
              { icon: ShowerHead, label: "Душ, туалет, лежаки" },
              { icon: Wifi, label: "Wi-Fi" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20" data-testid="section-contacts-preview">
        <div className="container mx-auto px-4">
          <SectionHeading title="Контакты" />
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-xl font-display font-bold text-foreground">Адреса</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                  <span>ст. Голубицкая, пер. Радужный, д. 2/1</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                  <span>ст. Голубицкая, ул. Набережная, д. 7</span>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-xl font-display font-bold text-foreground">Свяжитесь с нами</h3>
              <div className="space-y-3">
                <a href="tel:+78001234567" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="text-primary w-5 h-5 shrink-0" />
                  <span>+7 (800) 123-45-67</span>
                </a>
                <a href="https://wa.me/78001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <WhatsAppIcon className="text-primary w-5 h-5 shrink-0" />
                  <span>WhatsApp</span>
                </a>
                <a href="https://t.me/almare" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Send className="text-primary w-5 h-5 shrink-0" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
