import { useState, useRef, useEffect } from "react";
import { Phone, MessageCircle, X, Send } from "lucide-react";

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

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="fixed right-4 md:right-6 bottom-6 md:bottom-4 z-40 flex flex-col items-end gap-3" data-testid="floating-contact">
      <div
        className={`flex flex-col gap-2 transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 translate-y-2 pointer-events-none"
        }`}
      >
        <a
          href="tel:+79184710374"
          className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-border/40 px-4 py-3 transition-all duration-200 active:bg-secondary/50 group min-h-[48px]"
          data-testid="floating-call"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-sm font-semibold text-foreground">Позвонить</span>
        </a>

        <a
          href="https://t.me/Al_Mare_komplex"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="floating-telegram"
          aria-label="Написать в Telegram"
          className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-border/40 px-4 py-3 transition-all duration-200 active:bg-secondary/50 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5 text-sky-600" />
          </div>
          <span className="text-sm font-semibold text-foreground">Telegram</span>
        </a>

        <a
          href="https://max.ru/u/f9LHodD0cOKyZuixF6xW4bLAnYDSqIQ-54OcR3omDgRgkRs2Ji9F1hlf6Rk"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="floating-max"
          aria-label="Написать в MAX"
          className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-border/40 px-4 py-3 transition-all duration-200 active:bg-secondary/50 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
            <MaxIcon className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-semibold text-foreground">MAX</span>
        </a>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="floating-toggle"
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-foreground/90 text-white rotate-0"
            : "bg-primary text-white active:scale-95"
        }`}
        aria-label={open ? "Закрыть меню связи" : "Связаться с нами"}
      >
        <div className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </div>
      </button>
    </div>
  );
}
