interface IconProps {
  className?: string;
}

export function GlassIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l-1.5 10a3.5 3.5 0 0 1-2.5 1 3.5 3.5 0 0 1-2.5-1L8 2z" />
      <line x1="12" y1="13" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  );
}

export function ChickenWingIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 3C12 3 9 5.5 8 9c-1 3.5 0 6.5 2 8l1.5 1.5" />
      <path d="M11.5 18.5L7 22" />
      <path d="M10 17l-4.5 3" />
      <path d="M15.5 3c2 0 4 1.5 4.5 4s-0.5 5-3 6.5c-1.5 1-3.5 1.5-5 2" />
      <circle cx="14" cy="7.5" r="1" />
    </svg>
  );
}

export function PopsicleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="13" rx="4" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <line x1="8.5" y1="8" x2="15.5" y2="8" />
    </svg>
  );
}

export function SunloungerIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17l4-6h12l2 6" />
      <line x1="2" y1="17" x2="22" y2="17" />
      <line x1="6" y1="11" x2="4" y2="8" />
      <line x1="4" y1="17" x2="3" y2="21" />
      <line x1="20" y1="17" x2="21" y2="21" />
      <line x1="14" y1="17" x2="14.5" y2="21" />
    </svg>
  );
}

export function RopeParkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="3" y2="3" />
      <line x1="21" y1="22" x2="21" y2="3" />
      <line x1="3" y1="5" x2="21" y2="5" />
      <path d="M3 5c3 4 6 5 9 5s6-1 9-5" />
      <line x1="3" y1="13" x2="21" y2="13" />
      <path d="M3 13c3 3 6 4 9 4s6-1 9-4" />
    </svg>
  );
}

export function BilliardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="16" r="5" />
      <line x1="14" y1="12" x2="22" y2="2" />
    </svg>
  );
}

export function MiniGolfIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4" />
      <path d="M6 4l-3 14" />
      <path d="M3 18c0 0 1.5 2 3 2" />
      <circle cx="16" cy="19" r="3" />
    </svg>
  );
}

export function LoungeChairIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14c0-3 2-5 5-5h6c3 0 5 2 5 5" />
      <path d="M2 14h20" />
      <path d="M4 14l-1 4" />
      <path d="M20 14l1 4" />
      <path d="M9 9V6c0-1 1-2 3-2s3 1 3 2v3" />
    </svg>
  );
}

export function TreeLeafIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V10" />
      <path d="M12 10c-3-5-8-5-8-1s3 6 8 6" />
      <path d="M12 10c3-5 8-5 8-1s-3 6-8 6" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}
