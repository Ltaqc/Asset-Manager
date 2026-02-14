import { useCallback, useRef } from "react";
import { Minus, Plus } from "lucide-react";

interface GuestCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  "data-testid"?: string;
}

export function GuestCounter({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  "data-testid": testId,
}: GuestCounterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const decrement = useCallback(() => {
    onChange(Math.max(min, value - 1));
  }, [value, min, onChange]);

  const increment = useCallback(() => {
    onChange(Math.min(max, value + 1));
  }, [value, max, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      onChange(min);
      return;
    }
    const num = parseInt(raw, 10);
    onChange(Math.max(min, Math.min(max, num)));
  }, [min, max, onChange]);

  const handleBlur = useCallback(() => {
    if (value < min) onChange(min);
    if (value > max) onChange(max);
  }, [value, min, max, onChange]);

  return (
    <div className="flex flex-col">
      <label className="text-xs text-muted-foreground block mb-1.5 min-h-[2rem] leading-tight flex items-end">{label}</label>
      <div className="flex items-center h-12 bg-secondary/30 border border-primary/20 rounded-md overflow-hidden relative z-[1]">
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); decrement(); }}
          disabled={value <= min}
          className="flex items-center justify-center w-11 h-full text-primary transition-colors active:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none shrink-0 touch-manipulation select-none"
          aria-label={`Уменьшить ${label}`}
          data-testid={testId ? `${testId}-minus` : undefined}
        >
          <Minus className="w-4 h-4 pointer-events-none" />
        </button>
        <span
          className="flex-1 flex items-center justify-center text-base font-semibold select-none min-w-[1.5rem] h-full md:hidden pointer-events-none"
          data-testid={testId ? `${testId}-value` : undefined}
          aria-label={label}
        >
          {value}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="hidden md:flex flex-1 text-center bg-transparent border-none outline-none text-base font-semibold min-w-0 h-full appearance-none items-center justify-center"
          data-testid={testId}
          aria-label={label}
        />
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); increment(); }}
          disabled={value >= max}
          className="flex items-center justify-center w-11 h-full text-primary transition-colors active:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none shrink-0 touch-manipulation select-none"
          aria-label={`Увеличить ${label}`}
          data-testid={testId ? `${testId}-plus` : undefined}
        >
          <Plus className="w-4 h-4 pointer-events-none" />
        </button>
      </div>
    </div>
  );
}
