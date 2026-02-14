import { useState, useRef, useEffect } from "react";
import { Gift, X } from "lucide-react";

function scrollToCalculator() {
  const el = document.getElementById("calculator");
  if (el) {
    const navHeight = 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
    el.classList.add("calculator-highlight");
    setTimeout(() => el.classList.remove("calculator-highlight"), 2000);
  }
}

export function FloatingPromo() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={cardRef} className="md:hidden fixed left-4 z-50" style={{ bottom: "96px" }} data-testid="floating-promo">
      <div
        className={`absolute left-0 bottom-16 w-[calc(100vw-2rem)] max-w-[420px] transition-all duration-300 origin-bottom-left ${
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className="rounded-[20px] px-5 py-6 relative"
          style={{
            background: "linear-gradient(135deg, #0F4F4A 0%, #14655F 50%, #1A7A73 100%)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/70 hover:bg-white/25 transition-colors cursor-pointer"
            aria-label="Закрыть"
            data-testid="floating-promo-close"
          >
            <X className="w-4 h-4 pointer-events-none" />
          </button>

          <p className="text-lg font-display font-bold text-white tracking-tight leading-tight pr-8">
            Раннее бронирование — скидка 10%
          </p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            Забронируйте отдых заранее и зафиксируйте лучшую цену сезона
          </p>
          <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Акция действует до 28 февраля 2026 года
          </p>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              scrollToCalculator();
            }}
            className="mt-5 block w-full rounded-xl text-white font-semibold text-base py-3.5 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "#1FC7B6",
              boxShadow: "0 0 16px rgba(31,199,182,0.35), 0 4px 12px rgba(0,0,0,0.15)",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              position: "relative",
              zIndex: 10,
            }}
            data-testid="floating-promo-button"
          >
            <span className="pointer-events-none">Рассчитать стоимость</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
          open
            ? "bg-gray-800 text-white"
            : "text-white active:scale-95"
        }`}
        style={open ? {} : {
          background: "#2CB7A5",
          boxShadow: "0 4px 16px rgba(44,183,165,0.4)",
        }}
        aria-label={open ? "Закрыть акцию" : "Акция: скидка 10%"}
        data-testid="floating-promo-toggle"
      >
        <div className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
          {open ? <X className="w-6 h-6 pointer-events-none" /> : <Gift className="w-6 h-6 pointer-events-none" />}
        </div>
      </button>
    </div>
  );
}
