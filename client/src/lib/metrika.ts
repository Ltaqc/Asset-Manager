const COUNTER_ID = 107159929;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function metrikaGoal(name: string, params?: Record<string, unknown>) {
  if (typeof window.ym === "function") {
    window.ym(COUNTER_ID, "reachGoal", name, params || {});
  }
}

export function metrikaHit(path: string) {
  if (typeof window.ym === "function") {
    window.ym(COUNTER_ID, "hit", path);
  }
}
