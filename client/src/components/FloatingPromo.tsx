import { useState } from "react";
import { Gift, X, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/optimized/hero_main_1770643186337.webp";

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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
        data-testid="promo-bar"
      >
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center gap-3 md:gap-5 py-3 md:py-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white cursor-pointer transition-transform duration-200 active:scale-95 hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #2CB7A5, #1FA896)",
                boxShadow: "0 4px 14px rgba(44,183,165,0.35)",
              }}
              aria-label="Подробнее об акции"
              data-testid="promo-gift-button"
            >
              <Gift className="w-5 h-5 md:w-6 md:h-6 pointer-events-none" />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-semibold text-gray-800 leading-tight truncate">
                Раннее бронирование — скидка 10%
              </p>
              <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 hidden sm:block">
                Забронируйте заранее и зафиксируйте лучшую цену
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="shrink-0 rounded-xl md:rounded-2xl text-white font-semibold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #0F4F4A, #14655F)",
                boxShadow: "0 2px 10px rgba(15,79,74,0.25)",
                pointerEvents: "auto",
                position: "relative",
                zIndex: 10,
              }}
              data-testid="promo-book-button"
            >
              <span className="pointer-events-none">ЗАБРОНИРОВАТЬ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          data-testid="promo-modal-overlay"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative w-full sm:max-w-md md:max-w-lg mx-auto bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.15)", maxHeight: "90vh" }}
            data-testid="promo-modal"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
              aria-label="Закрыть"
              data-testid="promo-modal-close"
            >
              <X className="w-5 h-5 pointer-events-none" />
            </button>

            <div className="relative h-40 md:h-48 overflow-hidden">
              <img
                src={heroImage}
                alt="AL MARE Resort"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(15,79,74,0.85) 100%)" }}
              />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-tight">
                  Раннее бронирование — скидка 10%
                </p>
              </div>
            </div>

            <div className="px-5 md:px-7 py-5 md:py-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 12rem)" }}>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Забронируйте отдых заранее и зафиксируйте лучшую цену сезона Ultra All Inclusive
              </p>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Лучшие даты сезона</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Полный пакет All Inclusive</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Бесплатные развлечения и пляж</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Акция действует до 28 февраля 2026 года
              </p>

              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setTimeout(() => scrollToCalculator(), 300);
                }}
                className="mt-5 w-full rounded-xl text-white font-semibold text-base py-3.5 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #0F4F4A, #14655F)",
                  boxShadow: "0 4px 16px rgba(15,79,74,0.3)",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "auto",
                  position: "relative",
                  zIndex: 10,
                }}
                data-testid="promo-modal-cta"
              >
                <span className="pointer-events-none">РАССЧИТАТЬ СТОИМОСТЬ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
