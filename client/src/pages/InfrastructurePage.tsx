import { SectionHeading } from "@/components/SectionHeading";
import { Waves, Utensils, Sun, Umbrella, Users, Car, TreePine, ShowerHead } from "lucide-react";

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen">
      <section className="py-24">
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
                alt="Инфраструктура"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
