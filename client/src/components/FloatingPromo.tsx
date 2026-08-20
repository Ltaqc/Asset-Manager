import { CalendarDays } from "lucide-react";
import { showSeasonStatus } from "@/components/SeasonStatusModal";

export function FloatingPromo() {
  return (
    <button
      type="button"
      onClick={showSeasonStatus}
      className="fixed bottom-[34px] left-4 z-50 flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2.5 text-primary shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-xl md:bottom-20 md:left-6"
      data-testid="promo-season-status-button"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
        <CalendarDays className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs font-semibold md:text-sm">Сезон 2027 — скоро</span>
    </button>
  );
}