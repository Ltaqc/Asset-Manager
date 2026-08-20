import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSeasonStatus } from "@/components/SeasonStatusModal";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-secondary/10">
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/50 bg-white shadow-xl">
            <div className="bg-primary/5 px-7 py-8 md:px-10 md:py-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarDays className="h-7 w-7" />
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-primary">AL MARE · сезон 2027</p>
              <h1 className="mt-3 text-3xl font-bold font-display leading-tight text-foreground md:text-4xl">
                Подбор номеров скоро откроется
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Сезон 2026 завершён. Мы обновляем информацию по сезону 2027, поэтому подбор номеров и расчёт предварительной стоимости пока недоступны.
              </p>
            </div>

            <div className="px-7 py-8 md:px-10 md:py-10">
              <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Пока вы можете посмотреть номера, территорию, пляж, питание и формат отдыха у моря. Возможность подобрать размещение и увидеть предварительную стоимость появится в ближайшее время.
                </p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <a
                  href="/#rooms"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                  data-testid="button-search-rooms"
                >
                  Ознакомиться с номерами
                </a>
                <a
                  href="/#infrastructure"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-primary/20 px-4 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  data-testid="button-search-territory"
                >
                  Посмотреть территорию
                </a>
                <Button type="button" variant="outline" className="h-11" onClick={showSeasonStatus} data-testid="button-search-status">
                  Следить за открытием продаж
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}