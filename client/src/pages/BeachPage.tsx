import { SectionHeading } from "@/components/SectionHeading";
import { Footprints, Umbrella, ShowerHead, Users } from "lucide-react";

export default function BeachPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 bg-blue-50/50">
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

      <section className="py-2 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {[
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=600&fit=crop"
          ].map((src, i) => (
            <div key={i} className="aspect-square relative group overflow-hidden">
              <img
                src={src}
                alt="Пляж"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
