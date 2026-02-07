import { Link, useLocation } from "wouter";
import { Phone, Mail, MapPin, Send, Clock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoSrc from "@assets/AL_MARE_logo_Логотип_вертикальный_без_дескриптора_1770452883279.png";

const NAV_ITEMS = [
  { label: "Главная", path: "/" },
  { label: "О отеле", path: "/#about" },
  { label: "Номера", path: "/rooms" },
  { label: "Питание", path: "/food" },
  { label: "Пляж", path: "/beach" },
  { label: "Инфраструктура", path: "/infrastructure" },
  { label: "Контакты", path: "/contacts" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 3h2l2 4 2-4h2v8h-2v-5l-2 4-2-4v5H7V8z"/>
    </svg>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    if (path === "/#about") {
      if (location === "/") {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hidden md:block bg-foreground text-primary-foreground text-xs" data-testid="top-bar">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <a href="tel:+78001234567" className="flex items-center gap-1.5 hover:text-white/80 transition-colors" data-testid="topbar-phone">
                <Phone className="w-3 h-3" />
                <span>+7 (800) 123-45-67</span>
              </a>
              <a href="mailto:info@almare.ru" className="flex items-center gap-1.5 hover:text-white/80 transition-colors" data-testid="topbar-email">
                <Mail className="w-3 h-3" />
                <span>info@almare.ru</span>
              </a>
            </div>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Круглосуточно
              </span>
              <div className="flex items-center gap-3">
                <a href="https://t.me/almare" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" data-testid="topbar-telegram">
                  <Send className="w-3.5 h-3.5" />
                </a>
                <a href="https://wa.me/78001234567" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" data-testid="topbar-whatsapp">
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="hover:text-white/80 transition-colors" data-testid="topbar-max">
                  <MaxIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border/30 shadow-sm" data-testid="main-nav">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="shrink-0" data-testid="link-logo">
              <img src={logoSrc} alt="AL MARE" className="h-12 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.path === "/#about"
                  ? false
                  : location === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path === "/#about" ? "/" : item.path}
                    data-testid={`nav-${item.path === "/#about" ? "about" : item.path.replace("/", "") || "home"}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:block shrink-0">
              <Link href="/#calculator">
                <Button
                  data-testid="button-header-calc"
                  onClick={() => {
                    if (location === "/") {
                      document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Рассчитать стоимость
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 rounded-md hover:bg-primary/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-border/30 shadow-lg" data-testid="mobile-menu">
            <div className="container mx-auto px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path === "/#about" ? "/" : item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`block px-4 py-2.5 rounded-md text-sm ${
                    location === item.path ? "text-primary bg-primary/5 font-semibold" : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border/30 mt-2 pt-3 px-4 space-y-2">
                <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                  <Phone className="w-3.5 h-3.5" /> +7 (800) 123-45-67
                </a>
                <a href="mailto:info@almare.ru" className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                  <Mail className="w-3.5 h-3.5" /> info@almare.ru
                </a>
                <div className="flex items-center gap-3 py-1">
                  <a href="https://t.me/almare" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Send className="w-4 h-4" />
                  </a>
                  <a href="https://wa.me/78001234567" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <MaxIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="px-4 pt-2 pb-1">
                <Link href="/">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setTimeout(() => {
                        document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
                      }, 300);
                    }}
                    data-testid="button-mobile-calc"
                  >
                    Рассчитать стоимость
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-16" data-testid="section-footer">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <img src={logoSrc} alt="AL MARE" className="h-16 w-auto brightness-0 invert" />
              <p className="text-slate-400 max-w-md">
                Уютный курортный отель, где всё продумано для семейного и размеренного отдыха у моря.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Контакты</h3>
              <div className="space-y-3">
                <a href="tel:+78001234567" className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors">
                  <Phone className="text-primary w-4 h-4 shrink-0" />
                  <span>+7 (800) 123-45-67</span>
                </a>
                <a href="mailto:info@almare.ru" className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors">
                  <Mail className="text-primary w-4 h-4 shrink-0" />
                  <span>info@almare.ru</span>
                </a>
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="text-primary w-4 h-4 shrink-0" />
                  <span>Круглосуточно</span>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <a href="https://t.me/almare" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors" data-testid="footer-telegram">
                    <Send className="w-5 h-5" />
                  </a>
                  <a href="https://wa.me/78001234567" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors" data-testid="footer-whatsapp">
                    <WhatsAppIcon className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors" data-testid="footer-max">
                    <MaxIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Адреса</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                  <span>ст. Голубицкая, пер. Радужный, д. 2/1</span>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                  <span>ст. Голубицкая, ул. Набережная, д. 7</span>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-3">Навигация</h3>
                <div className="grid grid-cols-2 gap-2 text-slate-400 text-sm">
                  {NAV_ITEMS.filter(i => i.path !== "/#about").map((item) => (
                    <Link key={item.path} href={item.path} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} AL MARE Resort. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
