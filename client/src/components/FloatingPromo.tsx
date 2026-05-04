import { useState, useEffect, useRef, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";
import promoBeachImg from "@assets/promo_beach_sunbeds.png";

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
  "специальные условия на выбранные даты",
  "Ultra All Inclusive уже входит в стоимость",
  "собственный песчаный пляж рядом",
  "питание, напитки и развлечения включены",
  "семейный отдых у моря без лишних затрат",
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
        @keyframes fp-glow {
          0%,100% { box-shadow: 0 4px 20px rgba(190,120,10,0.45), 0 0 0 0 rgba(230,170,20,0); }
          50%      { box-shadow: 0 6px 30px rgba(210,140,15,0.65), 0 0 0 5px rgba(230,170,20,0.1); }
        }
        @keyframes fp-flick {
          0%,100% { transform: scaleY(1) scaleX(1); opacity: 1; }
          40%      { transform: scaleY(1.1) scaleX(0.95); opacity: 0.85; }
          70%      { transform: scaleY(0.93) scaleX(1.04); opacity: 0.92; }
        }
        .fp-glow  { animation: fp-glow 2.6s ease-in-out infinite; }
        .fp-flick { animation: fp-flick 2.4s ease-in-out infinite; transform-origin: 50% 90%; }
        .fp-btn   { transition: transform 0.18s ease; }
        .fp-btn:hover  { transform: translateY(-2px) scale(1.04); }
        .fp-btn:active { transform: scale(0.97); }
      `}</style>

      {showGiftButton && !popupVisible && (
        <button
          type="button"
          onClick={handleGiftClick}
          className="fp-glow fp-btn fixed left-4 md:left-6 bottom-[34px] md:bottom-20 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #ae6c08 0%, #d08c0e 38%, #e6a41a 62%, #c07e0a 100%)",
            border: "1px solid rgba(255,195,50,0.42)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
          data-testid="promo-gift-button"
        >
          {/* Premium SVG flame */}
          <svg className="fp-flick shrink-0" width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fpFG" x1="10" y1="2" x2="10" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%"  stopColor="#FFE055" />
                <stop offset="50%" stopColor="#FF9818" />
                <stop offset="100%" stopColor="#D44A08" />
              </linearGradient>
              <linearGradient id="fpFI" x1="10" y1="10" x2="10" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%"  stopColor="#FFF8A0" />
                <stop offset="100%" stopColor="#FFD030" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path d="M10 2C10 2 6.5 6.5 6.5 10.2C6.5 12.3 7.7 14.1 9.4 14.7 9.4 14.7 8.6 12.4 10 11.7 10 11.7 9 9.6 10.5 7 10.5 7 11.8 9.4 12 11.4 12.8 10.5 13 8.9 12.4 7.8 14.1 9 15.2 11.3 15.2 13.6 15.2 16.3 12.9 18 10 18 7.1 18 4.8 16.3 4.8 13.6 4.8 9 10 2 10 2Z" fill="url(#fpFG)" />
            <path d="M10 16C9 16 8.3 15.2 8.3 14.2 8.3 13 9.1 12.1 10 11.8 10 11.8 9.6 13.2 10.5 13.8 10.5 13.8 11.3 12.9 11.1 14.2 10.9 15.2 10.9 16 10 16Z" fill="url(#fpFI)" />
          </svg>
          <span className="text-white text-xs md:text-sm font-semibold whitespace-nowrap pointer-events-none" style={{ letterSpacing: "0.01em" }}>
            Горящие даты июня
          </span>
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

            {/* Desktop photo — left panel */}
            <div className="hidden sm:block sm:w-[300px] shrink-0 overflow-hidden">
              <picture className="block w-full h-full">
                <source srcSet="/promo-beach-lg.webp" type="image/webp" />
                <img
                  src={promoBeachImg}
                  alt="Пляж AL MARE — шезлонги и тент"
                  width={1100}
                  height={733}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 55%" }}
                  loading="lazy"
                />
              </picture>
            </div>

            {/* Mobile photo — top strip */}
            <div
              className="sm:hidden w-full overflow-hidden rounded-t-2xl"
              style={{ height: "200px", flexShrink: 0 }}
            >
              <picture className="block w-full h-full">
                <source srcSet="/promo-beach-sm.webp" type="image/webp" />
                <img
                  src={promoBeachImg}
                  alt="Пляж AL MARE — шезлонги и тент"
                  width={720}
                  height={480}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 45%" }}
                  loading="lazy"
                />
              </picture>
            </div>

            <div className="flex-1 px-5 md:px-7 pt-5 md:pt-6 pb-5 flex flex-col justify-center">

              {/* 30% pill */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(118deg, rgba(255,198,38,0.2) 0%, rgba(255,155,15,0.14) 100%)",
                    color: "#C8820A",
                    border: "1px solid rgba(225,170,30,0.45)",
                    boxShadow: "0 0 10px 2px rgba(255,195,40,0.12)",
                  }}
                >
                  выгода до 30%
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-snug pr-6">
                Горящие даты июня — выгода до 30%
              </h3>

              <p className="mt-1.5 text-sm text-muted-foreground leading-snug">
                Забронируйте отдых у моря и получите специальные условия при подтверждении бронирования.
              </p>

              <div className="mt-3.5 space-y-2">
                {benefits.map((text, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-[17px] h-[17px] mt-[1px] shrink-0" style={{ color: "#C8820A" }} />
                    <span className="text-[13px] md:text-sm text-gray-700 leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCtaClick}
                className="mt-5 w-full h-12 rounded-xl text-white font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #a86208 0%, #cc8a0c 35%, #e8a41a 60%, #be7c0a 100%)",
                  boxShadow: "0 4px 20px rgba(210,130,15,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                }}
                data-testid="promo-popup-cta"
              >
                <span className="pointer-events-none">Посмотреть выгодные даты</span>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
