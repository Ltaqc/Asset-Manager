import { Link, useLocation } from "wouter";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const NAV_ITEMS = [
  { label: "Главная", path: "/" },
  { label: "Номера", path: "/rooms" },
  { label: "Питание", path: "/food" },
  { label: "Пляж", path: "/beach" },
  { label: "Инфраструктура", path: "/infrastructure" },
  { label: "Контакты", path: "/contacts" },
];

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 7.5c-1.5 0-3 .8-3.5 2" />
    </svg>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg border-b border-border/30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="text-2xl font-display font-bold text-primary tracking-tight shrink-0" data-testid="link-logo">
              AL MARE
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-4 text-sm text-muted-foreground shrink-0">
              <a href="tel:+78001234567" className="flex items-center gap-1.5 hover:text-primary transition-colors" data-testid="link-phone">
                <Phone className="w-3.5 h-3.5" />
                <span>+7 (800) 123-45-67</span>
              </a>
              <a href="mailto:info@almare.ru" className="flex items-center gap-1.5 hover:text-primary transition-colors" data-testid="link-email">
                <Mail className="w-3.5 h-3.5" />
                <span>info@almare.ru</span>
              </a>
              <div className="flex items-center gap-2">
                <a href="https://t.me/almare" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" data-testid="link-telegram">
                  <Send className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-max">
                  <MaxIcon className="w-4 h-4" />
                </a>
              </div>
              <span className="flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                ст. Голубицкая, ул. Набережная, д. 7
              </span>
            </div>

            <div className="lg:hidden">
              <MobileMenu location={location} />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-16" data-testid="section-footer">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-display font-bold text-primary">AL MARE</h2>
              <p className="text-slate-400 max-w-md">
                Откройте для себя безграничный комфорт курортного отеля AL MARE.
                Там, где небо встречается с морем, начинается ваш идеальный отпуск.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <MapPin className="text-primary w-5 h-5 shrink-0" />
                  <span>ст. Голубицкая, ул. Набережная, д. 7</span>
                </div>
                <a href="tel:+78001234567" className="flex items-center gap-4 text-slate-300 hover:text-primary transition-colors">
                  <Phone className="text-primary w-5 h-5 shrink-0" />
                  <span>+7 (800) 123-45-67</span>
                </a>
                <a href="mailto:info@almare.ru" className="flex items-center gap-4 text-slate-300 hover:text-primary transition-colors">
                  <Mail className="text-primary w-5 h-5 shrink-0" />
                  <span>info@almare.ru</span>
                </a>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-4">Навигация</h3>
              <div className="grid grid-cols-2 gap-4 text-slate-400">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.path} href={item.path} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ))}
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

function MobileMenu({ location }: { location: string }) {
  return (
    <details className="relative group">
      <summary className="list-none cursor-pointer p-2 rounded-md hover:bg-primary/5" data-testid="button-mobile-menu">
        <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border/50 py-2 z-50">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2.5 text-sm ${
              location === item.path ? "text-primary bg-primary/5 font-semibold" : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="border-t border-border/30 mt-2 pt-2 px-4 space-y-2">
          <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-muted-foreground py-1">
            <Phone className="w-3.5 h-3.5" /> +7 (800) 123-45-67
          </a>
          <a href="mailto:info@almare.ru" className="flex items-center gap-2 text-sm text-muted-foreground py-1">
            <Mail className="w-3.5 h-3.5" /> info@almare.ru
          </a>
        </div>
      </div>
    </details>
  );
}
