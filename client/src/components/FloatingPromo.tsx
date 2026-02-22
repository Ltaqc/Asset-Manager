import { useState, useEffect, useRef, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";

function scrollToCalculator() {
  const section = document.getElementById("calculator");
  if (section) {
    const headerHeight = 64;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop - headerHeight, behavior: "smooth" });
    section.classList.add("calculator-highlight");
    setTimeout(() => section.classList.remove("calculator-highlight"), 2000);
  }
}

export function FloatingPromo() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    setVisible(true);
    requestAnimationFrame(() => setAnimating(true));
  }, []);

  const scheduleShow = useCallback((delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(show, delay);
  }, [show]);

  useEffect(() => {
    scheduleShow(10000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scheduleShow]);

  const dismiss = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      scheduleShow(30000);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed left-4 md:left-6 z-50 w-[calc(100%-2rem)] sm:w-[360px] md:w-[380px] transition-all duration-300 ease-out"
      style={{
        bottom: "80px",
        opacity: animating ? 1 : 0,
        transform: animating ? "translateY(0)" : "translateY(20px)",
      }}
      data-testid="promo-popup"
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-400 hover:bg-black/10 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Закрыть"
          data-testid="promo-popup-close"
        >
          <X className="w-4 h-4 pointer-events-none" />
        </button>

        <div className="px-5 pt-5 pb-4">
          <p className="text-base font-display font-bold text-foreground leading-snug pr-8">
            🎁 Специальное предложение для гостей сайта
          </p>

          <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
            Получите персональную выгоду до 30%<br />на отдых в AL MARE
          </p>

          <div className="mt-3.5 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[13px] text-gray-600">Скидки за длительное проживание</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[13px] text-gray-600">Бонусы за раннее бронирование</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[13px] text-gray-600">Дополнительные привилегии при наличии свободных номеров</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              dismiss();
              setTimeout(() => scrollToCalculator(), 350);
            }}
            className="mt-4 w-full h-12 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-[250ms] ease-in-out hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center"
            style={{
              background: "#2EC4B6",
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#23B1A5"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2EC4B6"; }}
            data-testid="promo-popup-cta"
          >
            <span className="pointer-events-none">Забронировать номер</span>
          </button>
        </div>
      </div>
    </div>
  );
}
