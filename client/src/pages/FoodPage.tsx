import { SectionHeading } from "@/components/SectionHeading";
import { Utensils, Sun, Waves } from "lucide-react";

export default function FoodPage() {
  return (
    <div className="min-h-screen">
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
    </div>
  );
}
