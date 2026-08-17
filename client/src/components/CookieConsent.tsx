import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

const STORAGE_KEY = "almare_cookie_consent";
const CLARITY_TAG = "vh8f42vvll";
const YM_ID = 107159929;

function initClarity() {
  if (typeof window === "undefined") return;
  if ((window as any).clarity) return;
  const c = window as any;
  c.clarity = c.clarity || function (...args: unknown[]) { (c.clarity.q = c.clarity.q || []).push(args); };
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://www.clarity.ms/tag/" + CLARITY_TAG;
  document.head.appendChild(t);
}

function initYM() {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.ym) {
    try {
      w.ym(YM_ID, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true,
      });
    } catch {}
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted") {
      initYM();
      initClarity();
    } else if (stored === "declined") {
      // nothing
    } else {
      // no choice yet — show banner
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    initYM();
    initClarity();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] px-4 pb-4 pointer-events-none"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
      >
        <p className="text-xs text-slate-600 leading-relaxed flex-1">
          Мы используем файлы cookie и аналитику (Яндекс Метрика, Microsoft Clarity) для улучшения работы сайта.{" "}
          <Link href="/privacy" className="text-primary hover:underline whitespace-nowrap">Политика персональных данных</Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="text-xs text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Отклонить
          </button>
          <button
            onClick={accept}
            className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #2EC4B6 0%, #1aa898 100%)" }}
          >
            Принять
          </button>
          <button
            onClick={decline}
            aria-label="Закрыть"
            className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
