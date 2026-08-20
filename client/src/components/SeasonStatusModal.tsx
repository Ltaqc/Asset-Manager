import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEASON_STATUS_EVENT = "almare:show-season-status";

export function showSeasonStatus() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SEASON_STATUS_EVENT));
  }
}

export function SeasonStatusModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener(SEASON_STATUS_EVENT, openModal);
    return () => window.removeEventListener(SEASON_STATUS_EVENT, openModal);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-950/45 p-0 md:p-4"
      onClick={() => setOpen(false)}
      role="presentation"
      data-testid="season-status-overlay"
    >
      <div
        className="relative w-full max-w-lg rounded-t-3xl md:rounded-3xl bg-white px-6 pb-7 pt-8 md:p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="season-status-title"
        data-testid="season-status-modal"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarDays className="h-6 w-6" />
        </div>
        <h2 id="season-status-title" className="pr-8 text-2xl font-bold font-display text-foreground">
          Продажи на сезон 2027 скоро откроются
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Сейчас бронирование и расчёт предварительной стоимости временно недоступны. Мы обновляем информацию по сезону 2027.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Пока вы можете ознакомиться с номерами, территорией и форматом отдыха в AL MARE.
        </p>
        <Button className="mt-6 w-full" onClick={() => setOpen(false)} data-testid="button-season-status-close">
          Понятно
        </Button>
      </div>
    </div>
  );
}