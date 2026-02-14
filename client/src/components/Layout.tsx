import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Phone, Mail, MapPin, Send, X, Menu } from "lucide-react";
import { FloatingContact } from "@/components/FloatingContact";
import { FloatingPromo } from "@/components/FloatingPromo";

const NAV_ITEMS = [
  { label: "Главная", anchor: "hero" },
  { label: "Номера", anchor: "rooms" },
  { label: "Об отеле", anchor: "about" },
  { label: "All Inclusive", anchor: "uai" },
  { label: "Питание", anchor: "food" },
  { label: "Пляж", anchor: "beach" },
  { label: "Инфраструктура", anchor: "infrastructure" },
  { label: "Контакты", anchor: "contacts" },
];

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.48 2 2 6.04 2 11c0 2.8 1.5 5.28 3.84 6.88L4.5 22l4.2-2.12C9.76 20.28 10.86 20.5 12 20.5c5.52 0 10-4.04 10-9S17.52 2 12 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

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

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg border-b border-border/30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
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

            <div className="hidden xl:flex items-center gap-4 text-sm text-muted-foreground shrink-0">
              <a href="tel:+79184710374" className="flex items-center gap-1.5 hover:text-primary transition-colors" data-testid="link-phone">
                <Phone className="w-3.5 h-3.5" />
                <span>+7 (918) 471-03-74</span>
              </a>
              <a href="mailto:almare@hotelalmare.ru" className="flex items-center gap-1.5 hover:text-primary transition-colors" data-testid="link-email">
                <Mail className="w-3.5 h-3.5" />
                <span>almare@hotelalmare.ru</span>
              </a>
              <div className="flex items-center gap-2">
                <a href="https://t.me/Al_Mare_komplex" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" data-testid="link-telegram" title="Telegram" aria-label="Написать в Telegram">
                  <Send className="w-4 h-4" />
                </a>
                <a href="https://max.ru/chat/+79184710374" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" data-testid="link-max" title="MAX" aria-label="Написать в MAX">
                  <MaxIcon className="w-4 h-4" />
                </a>
              </div>
              <a href="https://yandex.ru/maps/?rtext=~45.326978,37.290373&rtt=auto&text=ст. Голубицкая, ул. Набережная, д. 7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" data-testid="link-address-header">
                <MapPin className="w-3.5 h-3.5" />
                ст. Голубицкая, ул. Набережная, д. 7
              </a>
            </div>

            <div className="lg:hidden">
              <MobileMenu onNavClick={handleNavClick} />
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

      <footer className="bg-slate-900 text-white py-16 md:py-20" data-testid="section-footer">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">AL MARE</h2>
              <p className="text-slate-300 max-w-md leading-relaxed text-sm md:text-base">
                AL MARE — курортный отель в станице Голубицкая для спокойного отдыха у моря.
                Комфортные номера, продуманная инфраструктура и внимательное отношение к гостям.
              </p>
              <div className="space-y-4 md:space-y-5 pt-2">
                <a href="https://yandex.ru/maps/?rtext=~45.326978,37.290373&rtt=auto&text=ст. Голубицкая, ул. Набережная, д. 7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-primary transition-colors" data-testid="link-address-footer">
                  <MapPin className="text-primary w-5 h-5 shrink-0" />
                  <span className="text-sm md:text-base">ст. Голубицкая, ул. Набережная, д. 7</span>
                </a>
                <a href="tel:+79184710374" className="flex items-center gap-4 text-slate-300 hover:text-primary transition-colors">
                  <Phone className="text-primary w-5 h-5 shrink-0" />
                  <span className="text-sm md:text-base">+7 (918) 471-03-74</span>
                </a>
                <a href="mailto:almare@hotelalmare.ru" className="flex items-center gap-4 text-slate-300 hover:text-primary transition-colors">
                  <Mail className="text-primary w-5 h-5 shrink-0" />
                  <span className="text-sm md:text-base">almare@hotelalmare.ru</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-display font-bold text-primary mb-4 md:mb-6">Разделы сайта</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:gap-y-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.anchor}
                    onClick={() => handleNavClick(item.anchor)}
                    className="text-slate-300 hover:text-primary transition-colors text-sm md:text-base leading-relaxed text-left py-1"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 md:mt-16 pt-6 md:pt-8 text-center text-slate-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} AL MARE Resort. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileMenu({ onNavClick }: { onNavClick: (anchor: string) => void }) {
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
              <a href="tel:+79184710374" className="flex items-center gap-3 text-sm text-muted-foreground py-2 min-h-[44px]">
                <Phone className="w-4 h-4 shrink-0" /> +7 (918) 471-03-74
              </a>
              <a href="mailto:almare@hotelalmare.ru" className="flex items-center gap-3 text-sm text-muted-foreground py-2 min-h-[44px]">
                <Mail className="w-4 h-4 shrink-0" /> almare@hotelalmare.ru
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
