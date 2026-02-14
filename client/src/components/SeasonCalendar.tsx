import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const d = parseDate(dateStr);
  const day = d.getDate();
  const monthNames = [
    "июня", "июля", "августа", "сентября"
  ];
  const m = d.getMonth();
  const monthLabel = m >= 5 && m <= 8 ? monthNames[m - 5] : MONTH_NAMES[m];
  return `${day} ${monthLabel}`;
}

interface SeasonCalendarProps {
  value: string;
  onChange: (val: string) => void;
  minDate: string;
  maxDate: string;
  seasonStart: string;
  seasonEnd: string;
  placeholder?: string;
  disabled?: boolean;
  testId?: string;
}

export function SeasonCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  seasonStart,
  seasonEnd,
  placeholder = "Выберите даты",
  disabled = false,
  testId,
}: SeasonCalendarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const seasonStartD = parseDate(seasonStart);
  const seasonEndD = parseDate(seasonEnd);
  const minD = parseDate(minDate);
  const maxD = parseDate(maxDate);

  const startMonth = minDate ? parseDate(minDate).getMonth() : seasonStartD.getMonth();
  const startYear = minDate ? parseDate(minDate).getFullYear() : seasonStartD.getFullYear();

  const [viewMonth, setViewMonth] = useState(
    value ? parseDate(value).getMonth() : startMonth
  );
  const [viewYear, setViewYear] = useState(
    value ? parseDate(value).getFullYear() : startYear
  );

  useEffect(() => {
    if (!open) return;
    if (value) {
      const d = parseDate(value);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    } else {
      setViewMonth(startMonth);
      setViewYear(startYear);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [open]);

  const canPrev = () => {
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const lastDayOfPrev = new Date(prevYear, prevMonth + 1, 0).getDate();
    const latestInPrev = new Date(prevYear, prevMonth, lastDayOfPrev);
    return latestInPrev >= seasonStartD && latestInPrev >= minD;
  };

  const canNext = () => {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const firstOfNext = new Date(nextYear, nextMonth, 1);
    return firstOfNext <= seasonEndD;
  };

  const prev = () => {
    if (!canPrev()) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const next = () => {
    if (!canNext()) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const isDateDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < seasonStartD || d > seasonEndD || d < minD || d > maxD;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return toDateStr(viewYear, viewMonth, day) === value;
  };

  const isToday = (day: number) => {
    const now = new Date();
    return viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate();
  };

  const selectDay = (day: number) => {
    if (isDateDisabled(day)) return;
    const ds = toDateStr(viewYear, viewMonth, day);
    onChange(ds);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full" data-testid={testId}>
      <button
        type="button"
        disabled={disabled}
        onPointerDown={(e) => {
          if (disabled) return;
          e.preventDefault();
          setOpen(!open);
        }}
        className={`flex items-center justify-between w-full h-12 px-3 rounded-md border bg-secondary/30 border-primary/20 text-left cursor-pointer transition-all touch-manipulation select-none hover:border-primary hover:shadow-[0_0_0_2px_hsl(174_72%_45%/0.15)] focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_hsl(174_72%_45%/0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:shadow-none relative z-[1]`}
        data-testid={testId ? `${testId}-trigger` : undefined}
      >
        <span className={`pointer-events-none ${value ? "text-foreground text-sm" : "text-muted-foreground text-sm"}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 pointer-events-none" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[55]" onPointerDown={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-[60] bg-white rounded-xl shadow-xl border border-border/60 p-4 w-[300px] max-w-[calc(100vw-2rem)]" data-testid={testId ? `${testId}-dropdown` : undefined}>
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                disabled={!canPrev()}
                className="p-2 rounded-lg hover:bg-secondary/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-testid={testId ? `${testId}-prev` : undefined}
              >
                <ChevronLeft className="h-5 w-5 pointer-events-none" />
              </button>
              <span className="font-semibold text-sm select-none">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                disabled={!canNext()}
                className="p-2 rounded-lg hover:bg-secondary/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-testid={testId ? `${testId}-next` : undefined}
              >
                <ChevronRight className="h-5 w-5 pointer-events-none" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0 mb-1">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1 select-none">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0">
              {Array.from({ length: firstDow }).map((_, i) => (
                <div key={`e-${i}`} className="h-10" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dis = isDateDisabled(day);
                const sel = isSelected(day);
                const td = isToday(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={dis}
                    onPointerDown={(e) => { if (!dis) { e.preventDefault(); e.stopPropagation(); selectDay(day); } }}
                    className={`h-10 w-full rounded-lg text-sm font-medium transition-all select-none touch-manipulation
                      ${dis ? "text-muted-foreground/30 cursor-not-allowed" : "cursor-pointer hover:bg-primary/10 active:bg-primary/20"}
                      ${sel ? "bg-primary text-white hover:bg-primary/90" : ""}
                      ${td && !sel && !dis ? "ring-1 ring-primary/40 font-bold" : ""}
                    `}
                    data-testid={testId ? `${testId}-day-${day}` : undefined}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}