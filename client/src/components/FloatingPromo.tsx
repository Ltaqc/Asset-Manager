import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "almare_promo_dismissed";

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

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
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
            className="mt-4 w-full h-12 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0C3C39, #0F4F4A)",
              boxShadow: "0 4px 16px rgba(12,60,57,0.25)",
            }}
            data-testid="promo-popup-cta"
          >
            <span className="pointer-events-none">Рассчитать стоимость проживания</span>
          </button>
        </div>
      </div>
    </div>
  );
}
