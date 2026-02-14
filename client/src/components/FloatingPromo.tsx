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
      {/* Fixed Bottom Bar — full width, no rounding, dark brand color */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "linear-gradient(135deg, #0C3C39 0%, #0F4F4A 100%)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          height: "68px",
        }}
        data-testid="promo-bar"
      >
        <div className="flex items-center justify-center h-full px-4">
          <button
            type="button"
            onClick={() => scrollToCalculator()}
            className="text-white font-semibold text-sm md:text-base px-10 md:px-14 py-3 md:py-3.5 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #1FC7B6, #1AB3A3)",
              boxShadow: "0 2px 14px rgba(31,199,182,0.35)",
              borderRadius: "12px",
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

      {/* Promo block — left side, above bar */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="fixed left-4 md:left-6 z-50 flex items-center gap-0 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
        style={{ bottom: "80px" }}
        data-testid="promo-gift-area"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
          style={{
            background: "linear-gradient(135deg, #C4894D, #B07840)",
            boxShadow: "0 4px 16px rgba(196,137,77,0.4)",
          }}
          data-testid="promo-gift-button"
        >
          <Gift className="w-5 h-5 pointer-events-none" />
        </div>
        <div
          className="text-white text-[11px] md:text-xs font-bold tracking-wider px-3 py-1.5 -ml-1.5"
          style={{
            background: "linear-gradient(135deg, #C4894D, #B07840)",
            borderRadius: "0 16px 16px 0",
            boxShadow: "0 2px 10px rgba(196,137,77,0.3)",
          }}
          data-testid="promo-badge"
        >
          <span className="pointer-events-none">АКЦИЯ</span>
        </div>
      </button>

      {/* Modal */}
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
            className="relative w-full sm:max-w-md md:max-w-lg mx-auto bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden"
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
                style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(12,60,57,0.9) 100%)" }}
              />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-tight">
                  Раннее бронирование — скидка 10%
                </p>
              </div>
            </div>

            <div className="px-5 md:px-7 py-5 md:py-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 12rem)" }}>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Зафиксируйте лучшую цену на летний отдых
                и получите доступ к самым востребованным датам
              </p>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Ultra All Inclusive без дополнительных расходов</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Собственный пляж и аквапарк</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Развлечения и инфраструктура включены</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-700">Количество номеров по акции ограничено</span>
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
                className="mt-5 w-full rounded-xl text-white font-semibold text-base cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #0C3C39, #0F4F4A)",
                  boxShadow: "0 4px 16px rgba(12,60,57,0.3)",
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
                <span className="pointer-events-none">Рассчитать стоимость проживания</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
