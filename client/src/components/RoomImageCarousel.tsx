import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function RoomImageCarousel({ images, alt, className = "" }: RoomImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }, [images.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }, [images.length]);

  if (images.length <= 1) {
    return <img src={images[0]} alt={alt} className={className} />;
  }

  return (
    <div className="relative w-full h-full group" data-testid="room-image-carousel">
      <img
        src={images[current]}
        alt={`${alt} — ${current + 1}`}
        className={`${className} transition-opacity duration-300`}
      />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Предыдущее фото"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Следующее фото"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current
                ? "bg-white w-3"
                : "bg-white/50"
            }`}
            aria-label={`Фото ${i + 1}`}
            data-testid={`button-carousel-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
