import { useState, useEffect, useRef, useCallback } from "react";
import { X, Gift } from "lucide-react";

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
  const [popupVisible, setPopupVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [autoShown, setAutoShown] = useState(false);
  const [showGiftButton, setShowGiftButton] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPopup = useCallback(() => {
    setPopupVisible(true);
    requestAnimationFrame(() => setAnimating(true));
  }, []);

  useEffect(() => {
    if (!autoShown) {
      timerRef.current = setTimeout(() => {
        setAutoShown(true);
        openPopup();
      }, 15000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [autoShown, openPopup]);

  const closePopup = useCallback(() => {
    setAnimating(false);
    setTimeout(() => {
      setPopupVisible(false);
      setShowGiftButton(true);
    }, 300);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closePopup();
  };

  const handleCtaClick = () => {
    setAnimating(false);
    setTimeout(() => {
      setPopupVisible(false);
      setShowGiftButton(true);
      setTimeout(() => scrollToCalculator(), 100);
    }, 300);
  };

  const handleGiftClick = () => {
    setShowGiftButton(false);
    openPopup();
  };

  return (
    <>
      {showGiftButton && !popupVisible && (
        <button
          type="button"
          onClick={handleGiftClick}
          className="fixed left-4 md:left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs md:text-sm font-semibold cursor-pointer transition-all duration-[250ms] ease-in-out hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]"
          style={{
            bottom: "80px",
            background: "#2EC4B6",
            boxShadow: "0 6px 20px rgba(46,196,182,0.35)",
          }}
          data-testid="promo-gift-button"
        >
          <Gift className="w-4 h-4 pointer-events-none" />
          <span className="pointer-events-none">Выгода до 30%</span>
        </button>
      )}

      {popupVisible && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          onClick={handleOverlayClick}
          data-testid="promo-overlay"
        >
          <div
            className="absolute inset-0 bg-black/30"
            style={{ pointerEvents: "none" }}
          />
          <div
            className="relative w-full sm:max-w-[400px] mx-4 sm:mx-auto bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden transition-all duration-300 ease-out"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)",
              opacity: animating ? 1 : 0,
              transform: animating ? "translateY(0)" : "translateY(20px)",
              maxHeight: "85vh",
            }}
            data-testid="promo-popup"
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-400 hover:bg-black/10 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Закрыть"
              data-testid="promo-popup-close"
            >
              <X className="w-4 h-4 pointer-events-none" />
            </button>

            <div className="px-5 md:px-6 pt-6 pb-5">
              <p className="text-lg md:text-xl font-display font-bold text-foreground leading-snug pr-8">
                Получите лучшее предложение на отдых Ultra All&nbsp;Inclusive
              </p>

              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                Подберём оптимальные даты, номера и варианты размещения
                с максимальной выгодой до 30% для вашей семьи
              </p>

              <button
                type="button"
                onClick={handleCtaClick}
                className="mt-5 w-full h-12 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-[250ms] ease-in-out hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                style={{
                  background: "#2EC4B6",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#23B1A5"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2EC4B6"; }}
                data-testid="promo-popup-cta"
              >
                <span className="pointer-events-none">Подобрать идеальный отдых</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
