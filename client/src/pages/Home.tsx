import { Calculator } from "@/components/Calculator";
import { SectionHeading } from "@/components/SectionHeading";
import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Phone, Waves, Utensils, Sun, Umbrella, Users, Dumbbell, TreePine } from "lucide-react";

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

        <section className="py-24 bg-secondary/30">
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

        <section className="py-24 relative overflow-hidden text-white">
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
                <h3 className="text-2xl font-display font-bold mb-4">Гастрономия</h3>
                <p className="text-white/80 leading-relaxed">
                  Безлимитный доступ к основному шведскому столу и 3 ресторанам a la carte. Свежие морепродукты, местные деликатесы и блюда мировой кухни.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="w-12 h-12 mb-6 text-secondary flex items-center justify-center font-bold text-2xl border-2 border-secondary rounded-full">24</div>
                <h3 className="text-2xl font-display font-bold mb-4">Круглосуточный сервис</h3>
                <p className="text-white/80 leading-relaxed">
                  Обслуживание номеров и лобби-бар работают 24/7. Закуски, напитки премиум-класса и авторские коктейли доступны в любое время.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <Waves className="w-12 h-12 mb-6 text-secondary" />
                <h3 className="text-2xl font-display font-bold mb-4">Бары у воды</h3>
                <p className="text-white/80 leading-relaxed">
                  Освежайтесь, не покидая бассейн. Swim-up бар и пляжное обслуживание — всё для вашего комфорта и удовольствия.
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

        <section className="py-24 container mx-auto px-4">
          <SectionHeading
            title="Инфраструктура"
            subtitle="Всё необходимое для незабываемого отдыха на территории отеля"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Waves, label: "5 бассейнов" },
              { icon: Umbrella, label: "Собственный пляж" },
              { icon: Sun, label: "СПА и велнес" },
              { icon: Users, label: "Детский клуб" },
              { icon: Dumbbell, label: "Фитнес-центр" },
              { icon: TreePine, label: "Зелёная территория" },
              { icon: Utensils, label: "3 ресторана" },
              { icon: Waves, label: "Водные развлечения" },
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

        <section className="py-2 bg-black">
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

        <footer className="bg-slate-900 text-white py-16">
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
                  <a href="#" className="hover:text-primary transition-colors">СПА</a>
                  <a href="#" className="hover:text-primary transition-colors">Мероприятия</a>
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
