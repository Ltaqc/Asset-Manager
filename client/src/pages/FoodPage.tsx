import { SectionHeading } from "@/components/SectionHeading";
import { Utensils, Sun, Flame, Coffee } from "lucide-react";

export default function FoodPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 bg-blue-50/50">
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

          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-border/50 shadow-md">
              <h3 className="text-xl font-display font-bold mb-6 text-center text-foreground">Стоимость питания в сутки</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">4 500 &#8381;</div>
                  <div className="text-muted-foreground text-sm mt-1">Взрослый (18+)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">4 500 &#8381;</div>
                  <div className="text-muted-foreground text-sm mt-1">Подросток (13-18)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">3 000 &#8381;</div>
                  <div className="text-muted-foreground text-sm mt-1">Ребёнок (2-13)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">Бесплатно</div>
                  <div className="text-muted-foreground text-sm mt-1">Малыш (0-2)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-2 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {[
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop"
          ].map((src, i) => (
            <div key={i} className="aspect-square relative group overflow-hidden">
              <img
                src={src}
                alt="Питание"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
