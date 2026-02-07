import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { roomCategories } from "@shared/schema";
import { ROOM_DATA, formatPrice, getMinPrice } from "@/lib/roomData";

export default function RoomsPage() {
  return (
    <div className="bg-secondary/10 min-h-screen">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Номера"
            subtitle="Выберите подходящий вариант размещения для комфортного отдыха"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomCategories.map((category) => {
              const info = ROOM_DATA[category];
              return (
                <Card key={category} className="overflow-hidden border-border/50 shadow-md" data-testid={`room-card-${category}`}>
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
                    <Link href="/" className="block">
                      <Button className="w-full" data-testid={`button-calc-${category}`}>
                        Рассчитать стоимость
                      </Button>
                    </Link>
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
    </div>
  );
}
