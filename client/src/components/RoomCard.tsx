import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface RoomCardProps {
  title: string;
  capacity: number;
  description?: string;
  image?: string;
  price?: string;
}

export function RoomCard({ title, capacity, description, image, price }: RoomCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-primary/30 font-display text-4xl">AL MARE</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-bold shadow-sm">
            <Users className="w-3 h-3 mr-1" /> до {capacity} чел.
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-muted-foreground text-sm line-clamp-3">
            {description}
          </p>
        )}
        {price && (
          <p className="mt-3 text-primary font-semibold text-sm">
            {price}
          </p>
        )}
      </div>
    </Card>
  );
}
