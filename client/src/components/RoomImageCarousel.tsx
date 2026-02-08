import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export function RoomImageCarousel({ images, alt, className = "", loading = "lazy" }: RoomImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }, [images.length]);

  const handlePrevClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    prev();
  }, [prev]);

  const handleNextClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    next();
  }, [next]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || images.length <= 1) return;

    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let swiping = false;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      deltaX = 0;
      swiping = false;
    }

    function onTouchMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      deltaX = dx;

      if (!swiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        swiping = true;
      }

      if (swiping) {
        e.preventDefault();
      }
    }

    function onTouchEnd() {
      if (swiping) {
        const threshold = 40;
        if (deltaX < -threshold) {
          setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
        } else if (deltaX > threshold) {
          setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
        }
      }
      swiping = false;
      deltaX = 0;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [images.length]);

  if (images.length <= 1) {
    return <img src={images[0]} alt={alt} className={className} loading={loading} decoding="async" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full group"
      style={{ touchAction: "pan-y pinch-zoom" }}
      data-testid="room-image-carousel"
    >
      <img
        src={images[current]}
        alt={`${alt} — ${current + 1}`}
        className={`${className} transition-opacity duration-300 select-none pointer-events-none`}
        loading={loading}
        decoding="async"
        draggable={false}
      />

      <button
        onClick={handlePrevClick}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Предыдущее фото"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNextClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Следующее фото"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); goTo(i); }}
            className={`rounded-full transition-all ${
              i === current
                ? "bg-white w-4 h-2"
                : "bg-white/50 w-2 h-2"
            }`}
            aria-label={`Фото ${i + 1}`}
            data-testid={`button-carousel-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
