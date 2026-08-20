import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { RoomImageCarousel } from "@/components/RoomImageCarousel";
import { Users, Maximize2 } from "lucide-react";
import { roomCategories } from "@shared/schema";
import { ROOM_DATA } from "@/lib/roomData";
import { showSeasonStatus } from "@/components/SeasonStatusModal";

export default function RoomsPage() {
  return (
    <div className="bg-secondary/10 min-h-screen">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Наши номера"
            subtitle="Элегантность и комфорт в каждой детали. Выберите подходящий вариант размещения для идеального отдыха."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomCategories.map((category) => {
              const info = ROOM_DATA[category];
              return (
                <Card key={category} className="overflow-hidden border-border/50 shadow-md flex flex-col" data-testid={`room-card-${category}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {info.images && info.images.length > 1 ? (
                      <RoomImageCarousel images={info.images} alt={category} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={info.image}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
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
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-primary/60" />
                        {info.area} м²
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary/60" />
                        до {info.cap} гостей
                      </span>
                    </div>
                    <Button className="w-full mt-auto" data-testid={`button-calc-${category}`} onClick={showSeasonStatus}>
                      Следить за открытием продаж
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
    </div>
  );
}
