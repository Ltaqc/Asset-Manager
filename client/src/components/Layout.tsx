import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { Phone, Mail, MapPin, X, Menu } from "lucide-react";
import { CookieConsent } from "@/components/CookieConsent";
import { FloatingContact } from "@/components/FloatingContact";
import { FloatingPromo } from "@/components/FloatingPromo";
import { SeasonStatusModal, showSeasonStatus } from "@/components/SeasonStatusModal";

const NAV_ITEMS = [
  { label: "Главная", anchor: "hero" },
  { label: "Номера", anchor: "rooms" },
  { label: "Об отеле", anchor: "about" },
  { label: "All Inclusive", anchor: "uai" },
  { label: "Питание", anchor: "food" },
  { label: "Пляж", anchor: "beach" },
  { label: "Территория", anchor: "infrastructure" },
  { label: "Контакты", anchor: "contacts" },
];

function scrollToSection(anchor: string) {
  if (anchor === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(anchor);
  if (el) {
    const navHeight = 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  const handleNavClick = (anchor: string) => {
    if (location !== "/") {
      setLocation("/");
      setTimeout(() => scrollToSection(anchor), 100);
    } else {
      scrollToSection(anchor);
    }
  };

  const handleBookClick = () => {
    showSeasonStatus();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg border-b border-border/30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            <button onClick={() => handleNavClick("hero")} className="text-2xl font-display font-bold text-primary tracking-tight shrink-0" data-testid="link-logo">
              AL MARE
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.anchor}
                  onClick={() => handleNavClick(item.anchor)}
                  data-testid={`nav-${item.anchor}`}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-foreground/70 hover:text-primary hover:bg-primary/5"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0">
              <a href="tel:+79184710374" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-phone">
                <Phone className="w-3.5 h-3.5" />
                <span>+7 (918) 471-03-74</span>
              </a>
              <button
                onClick={handleBookClick}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer touch-manipulation select-none transition-all duration-[250ms] ease-in-out hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "#2EC4B6",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#23B1A5"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2EC4B6"; }}
                data-testid="button-header-book"
              >
                <span className="pointer-events-none">Следить за открытием продаж</span>
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2 shrink-0">
              <a href="tel:+79184710374" className="w-10 h-10 rounded-full flex items-center justify-center text-primary" data-testid="link-phone-mobile" aria-label="Позвонить">
                <Phone className="w-5 h-5" />
              </a>
              <MobileMenu onNavClick={handleNavClick} onBookClick={handleBookClick} />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {children}
      </main>

      {location === "/" && (
        <>
          <FloatingPromo />
          <FloatingContact />
        </>
      )}

      <footer className="bg-slate-900 text-white py-16 md:py-20 relative z-50" data-testid="section-footer">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {/* Brand + contacts */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">AL MARE</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                Уютный семейный курорт на Азовском побережье в станице Голубицкая.
                Всё включено: питание, пляж, развлечения и вечерние программы.
              </p>
              <div className="space-y-4 pt-1">
                <a href="https://yandex.ru/maps/?rtext=~45.326978,37.290373&rtt=auto&text=ст. Голубицкая, ул. Набережная, д. 7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors" data-testid="link-address-footer">
                  <MapPin className="text-primary w-4 h-4 shrink-0" />
                  <span className="text-sm">ст. Голубицкая, ул. Набережная, д. 7</span>
                </a>
                <a href="tel:+79184710374" className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors">
                  <Phone className="text-primary w-4 h-4 shrink-0" />
                  <span className="text-sm">+7 (918) 471-03-74</span>
                </a>
                <a href="mailto:almare@hotelalmare.ru" className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors">
                  <Mail className="text-primary w-4 h-4 shrink-0" />
                  <span className="text-sm">almare@hotelalmare.ru</span>
                </a>
              </div>
            </div>

            {/* Nav */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Разделы сайта</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.anchor}
                    href={`#${item.anchor}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.anchor); }}
                    className="text-slate-300 hover:text-primary transition-colors text-sm py-1.5 cursor-pointer block w-full relative z-[1]"
                    style={{ WebkitTapHighlightColor: "rgba(46,196,182,0.15)" }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Документы</h3>
              <div className="space-y-2">
                <Link href="/legal" className="block text-slate-300 hover:text-primary transition-colors text-sm py-1.5">Правовая информация</Link>
                <Link href="/privacy" className="block text-slate-300 hover:text-primary transition-colors text-sm py-1.5">Политика персональных данных</Link>
                <Link href="/booking-rules" className="block text-slate-300 hover:text-primary transition-colors text-sm py-1.5">Правила бронирования и отмены</Link>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-slate-500 leading-relaxed">
                  ИП Коноян Эдуард Георгиевич<br />
                  ИНН 235500777991 · ОГРНИП 319237500088304<br />
                  Реестровый номер: С232024013948
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 md:mt-14 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-slate-500 text-xs">
            <span>&copy; {new Date().getFullYear()} AL MARE Resort. Все права защищены.</span>
            <Link href="/legal" className="hover:text-slate-400 transition-colors">ИП Коноян Э.Г. · ИНН 235500777991 · ОГРНИП 319237500088304</Link>
          </div>
        </div>
      </footer>
      <CookieConsent />
      <SeasonStatusModal />
    </div>
  );
}

function MobileMenu({ onNavClick, onBookClick }: { onNavClick: (anchor: string) => void; onBookClick: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
        data-testid="button-mobile-menu"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
      >
        {open ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-16 bg-black/30 z-40" onClick={close} />
          <div className="fixed right-0 top-16 w-72 max-w-[85vw] bg-white rounded-bl-2xl shadow-2xl border-l border-b border-border/50 py-3 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.anchor}
                onClick={() => {
                  onNavClick(item.anchor);
                  close();
                }}
                className="block w-full text-left px-5 py-3.5 text-base text-foreground/80 active:bg-primary/10 transition-colors min-h-[44px]"
                data-testid={`mobile-nav-${item.anchor}`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-border/30 mt-2 pt-3 px-5 space-y-3 pb-2">
              <button
                onClick={() => {
                  onBookClick();
                  close();
                }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm cursor-pointer touch-manipulation select-none transition-all duration-[250ms] ease-in-out active:scale-[0.97]"
                style={{
                  background: "#2EC4B6",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
                data-testid="button-mobile-book"
              >
                <span className="pointer-events-none">Следить за открытием продаж</span>
              </button>
              <a href="tel:+79184710374" className="flex items-center gap-3 text-sm text-muted-foreground py-2 min-h-[44px]">
                <Phone className="w-4 h-4 shrink-0" /> +7 (918) 471-03-74
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
