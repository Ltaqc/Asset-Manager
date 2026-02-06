import { Calculator } from "@/components/Calculator";
import { SectionHeading } from "@/components/SectionHeading";
import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Phone, Waves, Utensils, Sun, Umbrella, Users, Car, TreePine, ShowerHead, MessageCircle, Footprints } from "lucide-react";

export default function Home() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-2xl font-display font-bold text-primary tracking-tight">
            AL MARE
          </span>
          <Button data-testid="button-nav-book" variant="ghost" onClick={scrollToCalculator} className="text-primary font-semibold">
            Рассчитать стоимость
          </Button>
        </div>
      </nav>

      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center -z-10 opacity-30" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-80 z-0" />

        <div className="container px-4 text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-primary mb-4">
              AL MARE
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-light tracking-widest uppercase">
              Ultra All Inclusive Resort
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              data-testid="button-hero-calculate"
              onClick={scrollToCalculator}
              size="lg"
              className="text-lg px-10 py-8 rounded-full bg-primary text-white shadow-xl transition-all duration-300"
            >
              Рассчитать стоимость
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white"></path>
          </svg>
        </div>
      </header>

      <main className="flex-grow bg-white">
        <section className="py-24 container mx-auto px-4 relative z-10 -mt-20">
          <Calculator />
        </section>

        <section className="py-24 bg-secondary/20" data-testid="section-about">
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
                Отель подходит для семей с детьми, пар и небольших компаний. Мы стремимся к тому, чтобы каждый гость чувствовал себя как дома, но лучше — потому что дома нет моря за окном.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary/30" data-testid="section-rooms">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Наши номера"
              subtitle="Элегантность и комфорт в каждой детали. Выберите подходящий вариант размещения для идеального отдыха."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Стандарт",
                  cap: 2,
                  desc: "Уютный номер с двуспальной кроватью и балконом. Современный интерьер и вид на сад.",
                  img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop",
                  price: "от 4 600 \u20BD / сутки"
                },
                {
                  title: "Стандарт семейный",
                  cap: 3,
                  desc: "Просторный номер с балконом для небольших семей. Удобные спальные места и зона отдыха.",
                  img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop",
                  price: "от 7 000 \u20BD / сутки"
                },
                {
                  title: "Джуниор Сьют",
                  cap: 4,
                  desc: "Роскошный сьют с расширенной гостиной зоной и приватным балконом. Премиальная отделка.",
                  img: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?w=800&auto=format&fit=crop",
                  price: "от 9 200 \u20BD / сутки"
                },
                {
                  title: "Апартаменты",
                  cap: 6,
                  desc: "Просторные апартаменты с видом на бассейн. Идеальны для большой семьи или компании друзей.",
                  img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
                  price: "от 14 000 \u20BD / сутки"
                }
              ].map((room, i) => (
                <RoomCard
                  key={i}
                  title={room.title}
                  capacity={room.cap}
                  description={room.desc}
                  image={room.img}
                  price={room.price}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground italic">
                * Все категории номеров включают обслуживание Ultra All Inclusive
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden text-white" data-testid="section-food">
          <div className="absolute inset-0 bg-primary -z-20" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay -z-10" />

          <div className="container mx-auto px-4">
            <SectionHeading
              title="Питание Ultra All Inclusive"
              subtitle="Кулинарное путешествие без ограничений. Изысканные блюда со всего мира для вашего удовольствия."
              light
            />

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <Utensils className="w-12 h-12 mb-6 text-secondary" />
                <h3 className="text-2xl font-display font-bold mb-4">Завтрак, обед, ужин</h3>
                <p className="text-white/80 leading-relaxed">
                  Полноценное трёхразовое питание по меню: шведский стол с широким выбором блюд, свежая выпечка, горячие блюда и десерты.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <Sun className="w-12 h-12 mb-6 text-secondary" />
                <h3 className="text-2xl font-display font-bold mb-4">Перекусы и напитки</h3>
                <p className="text-white/80 leading-relaxed">
                  В течение дня доступны лёгкие закуски, безалкогольные и алкогольные напитки, мороженое, свежие фрукты и выпечка.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <Waves className="w-12 h-12 mb-6 text-secondary" />
                <h3 className="text-2xl font-display font-bold mb-4">Барбекю-зоны</h3>
                <p className="text-white/80 leading-relaxed">
                  Специально оборудованные зоны для барбекю на территории отеля. Приготовление на углях в уютной атмосфере на свежем воздухе.
                </p>
              </div>
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-xl font-display font-bold mb-6 text-center">Стоимость питания в сутки</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">4 500 &#8381;</div>
                    <div className="text-white/70 text-sm mt-1">Взрослый (18+)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4 500 &#8381;</div>
                    <div className="text-white/70 text-sm mt-1">Подросток (13-18)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3 000 &#8381;</div>
                    <div className="text-white/70 text-sm mt-1">Ребёнок (2-13)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">Бесплатно</div>
                    <div className="text-white/70 text-sm mt-1">Малыш (0-2)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-blue-50/50" data-testid="section-beach">
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

        <section className="py-24 container mx-auto px-4" data-testid="section-infrastructure">
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
        </section>

        <section className="py-2 bg-black" data-testid="section-gallery">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {[
              "https://images.unsplash.com/photo-1571896349842-68c2531b26f5?w=600&h=600&fit=crop",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=600&fit=crop",
              "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=600&fit=crop",
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=600&fit=crop"
            ].map((src, i) => (
              <div key={i} className="aspect-square relative group overflow-hidden">
                <img
                  src={src}
                  alt="Галерея"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 bg-secondary/20" data-testid="section-contacts">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Контакты"
              subtitle="Свяжитесь с нами любым удобным способом"
            />
            <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-3 p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg">Телефон</h3>
                <p className="text-muted-foreground">+7 (800) 123-45-67</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg">WhatsApp / Telegram</h3>
                <p className="text-muted-foreground">+7 (800) 123-45-67</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg">Адрес</h3>
                <p className="text-muted-foreground">Приморский бульвар, 1, Побережье</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-white py-16" data-testid="section-footer">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-display font-bold text-primary">AL MARE</h2>
                <p className="text-slate-400 max-w-md">
                  Откройте для себя безграничный комфорт курортного отеля AL MARE.
                  Там, где небо встречается с морем, начинается ваш идеальный отпуск.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <MapPin className="text-primary w-5 h-5 shrink-0" />
                    <span>Приморский бульвар, 1, Побережье</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <Phone className="text-primary w-5 h-5 shrink-0" />
                    <span>+7 (800) 123-45-67</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-4">Навигация</h3>
                <div className="grid grid-cols-2 gap-4 text-slate-400">
                  <a href="#" className="hover:text-primary transition-colors">Главная</a>
                  <a href="#" className="hover:text-primary transition-colors">Номера</a>
                  <a href="#" className="hover:text-primary transition-colors">Питание</a>
                  <a href="#" className="hover:text-primary transition-colors">Пляж</a>
                  <a href="#" className="hover:text-primary transition-colors">Инфраструктура</a>
                  <a href="#" className="hover:text-primary transition-colors">Контакты</a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} AL MARE Resort. Все права защищены.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
