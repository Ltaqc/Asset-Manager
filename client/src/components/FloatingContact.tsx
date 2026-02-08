import { useState, useRef, useEffect } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

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
    <div ref={menuRef} className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3" data-testid="floating-contact">
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
          <div className="pr-2">
            <span className="text-sm font-semibold text-foreground block">Позвонить</span>
            <span className="text-xs text-muted-foreground">+7 (918) 471-03-74</span>
          </div>
        </a>

        <button
          onClick={() => {}}
          data-testid="floating-chat"
          data-chat-integration="n8n"
          data-chat-ready="false"
          className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-border/40 px-4 py-3 transition-all duration-200 active:bg-secondary/50 group text-left min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="pr-2">
            <span className="text-sm font-semibold text-foreground block">Написать в чат</span>
            <span className="text-xs text-muted-foreground">Скоро будет доступно</span>
          </div>
        </button>
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
