import { useState, useEffect, useRef, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";
import promoFamilyImg from "@assets/promo_family_beach.png";

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

const benefits = [
  "Ultra All Inclusive уже входит в стоимость",
  "собственный песчаный пляж рядом",
  "питание, напитки и развлечения без лишних затрат",
  "семейный отдых с комфортом",
  "дополнительные скидки при подтверждении бронирования",
];

export function FloatingPromo() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [autoShown, setAutoShown] = useState(false);
  const [showGiftButton, setShowGiftButton] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  const openPopup = useCallback(() => {
    setPopupVisible(true);
    requestAnimationFrame(() => setAnimating(true));
  }, []);

  const cancelAutoPopup = useCallback(() => {
    if (interactedRef.current) return;
    interactedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAutoShown(true);
    setShowGiftButton(true);
  }, []);

  useEffect(() => {
    if (!autoShown) {
      timerRef.current = setTimeout(() => {
        if (!interactedRef.current) {
          setAutoShown(true);
          openPopup();
        }
      }, 15000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [autoShown, openPopup]);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const inCalc = target.closest("#calculator");
      const inBookingModal = target.closest("[data-testid='modal-booking']");
      const inConfirmModal = target.closest("[data-testid='modal-confirm']");
      if (inCalc || inBookingModal || inConfirmModal) {
        cancelAutoPopup();
      }
    };
    document.addEventListener("click", handler, true);
    document.addEventListener("focusin", handler, true);
    return () => {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("focusin", handler, true);
    };
  }, [cancelAutoPopup]);

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
      <style>{`
        @keyframes promo-glow {
          0%, 100% { box-shadow: 0 4px 18px rgba(255,107,53,0.45), 0 0 0 0 rgba(255,107,53,0.3); }
          50% { box-shadow: 0 6px 28px rgba(255,107,53,0.65), 0 0 0 6px rgba(255,107,53,0.08); }
        }
        .promo-btn-glow { animation: promo-glow 2.2s ease-in-out infinite; }
      `}</style>

      {showGiftButton && !popupVisible && (
        <button
          type="button"
          onClick={handleGiftClick}
          className="promo-btn-glow fixed left-4 md:left-6 bottom-[34px] md:bottom-20 z-50 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-white text-xs md:text-sm font-bold cursor-pointer transition-transform duration-200 hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #FF3CAC 100%)",
          }}
          data-testid="promo-gift-button"
        >
          <span className="pointer-events-none text-base leading-none">🔥</span>
          <span className="pointer-events-none">Лучшая цена сегодня</span>
        </button>
      )}

      {popupVisible && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleOverlayClick}
          data-testid="promo-overlay"
        >
          <div className="absolute inset-0 bg-black/30" style={{ pointerEvents: "none" }} />

          <div
            className="relative w-full sm:max-w-[720px] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden transition-all duration-300 ease-out flex flex-col sm:flex-row"
            style={{
              boxShadow: "0 12px 48px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.06)",
              opacity: animating ? 1 : 0,
              transform: animating ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
              maxHeight: "90vh",
            }}
            data-testid="promo-popup"
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Закрыть"
              data-testid="promo-popup-close"
            >
              <X className="w-4 h-4 pointer-events-none" />
            </button>

            <div className="hidden sm:block sm:w-[280px] shrink-0">
              <img
                src={promoFamilyImg}
                alt="Семейный отдых на пляже"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
                loading="eager"
              />
            </div>

            <div className="sm:hidden w-full h-[200px] overflow-hidden">
              <img
                src={promoFamilyImg}
                alt="Семейный отдых на пляже"
                className="w-full h-full object-cover"
                style={{ objectPosition: "50% 30%" }}
                loading="eager"
              />
            </div>

            <div className="flex-1 px-5 md:px-7 pt-5 md:pt-6 pb-5 flex flex-col justify-center">
              <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-snug pr-6">
                Горящее предложение у моря
              </h3>

              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                Успейте забронировать отдых по сниженной цене
              </p>

              <div className="mt-4 space-y-2">
                {benefits.map((text, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-[#2EC4B6] shrink-0" />
                    <span className="text-[13px] md:text-sm text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCtaClick}
                className="mt-5 w-full h-12 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-[250ms] ease-in-out hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                style={{
                  background: "#2EC4B6",
                  boxShadow: "0 6px 18px rgba(46,196,182,0.3)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#23B1A5"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2EC4B6"; }}
                data-testid="promo-popup-cta"
              >
                <span className="pointer-events-none">Подобрать выгодный вариант</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
