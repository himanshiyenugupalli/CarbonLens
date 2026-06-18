// Hand-drawn-style decorative SVG doodles. Low-opacity, non-interactive.

const stroke = "currentColor";

export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
      <path d="M10 70 Q 35 60 45 35 Q 50 18 70 10" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 55 Q 38 50 42 42" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M40 45 Q 50 42 55 32" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="48" cy="28" rx="6" ry="3" stroke={stroke} strokeWidth="1.1" transform="rotate(-30 48 28)" />
      <ellipse cx="36" cy="42" rx="5" ry="2.5" stroke={stroke} strokeWidth="1.1" transform="rotate(-25 36 42)" />
    </svg>
  );
}

export function LensRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="36" stroke={stroke} strokeWidth="1.2" />
      <circle cx="50" cy="50" r="26" stroke={stroke} strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="62" cy="38" r="3" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

export function SunRays({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="10" stroke={stroke} strokeWidth="1.2" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 40 + Math.cos(a) * 18;
        const y1 = 40 + Math.sin(a) * 18;
        const x2 = 40 + Math.cos(a) * 26;
        const y2 = 40 + Math.sin(a) * 26;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export function CloudSquiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" aria-hidden="true">
      <path d="M5 30 Q 15 15 30 22 Q 40 8 55 18 Q 70 6 85 20 Q 100 14 115 26" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" className={className} fill="none" aria-hidden="true">
      <path d="M2 10 Q 20 0 40 10 T 80 10 T 120 10 T 160 10 T 198 10" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Sprout({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
      <path d="M40 70 L 40 40" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M40 45 Q 22 38 18 22 Q 32 22 40 38" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 38 Q 58 32 62 18 Q 48 18 40 36" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M28 70 Q 40 66 52 70" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function Mountains({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 60" className={className} fill="none" aria-hidden="true">
      <path d="M2 55 L 35 18 L 60 42 L 90 10 L 120 38 L 158 55" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M70 26 L 78 18 L 86 26" stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobeDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="36" stroke={stroke} strokeWidth="1.3" />
      <ellipse cx="50" cy="50" rx="36" ry="14" stroke={stroke} strokeWidth="1" />
      <ellipse cx="50" cy="50" rx="14" ry="36" stroke={stroke} strokeWidth="1" />
      <path d="M14 50 H 86" stroke={stroke} strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  );
}

export function Bike({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none" aria-hidden="true">
      <circle cx="20" cy="44" r="12" stroke={stroke} strokeWidth="1.3" />
      <circle cx="80" cy="44" r="12" stroke={stroke} strokeWidth="1.3" />
      <path d="M20 44 L 45 44 L 60 20 L 80 44" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 44 L 55 20 L 65 20" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Recycle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
      <path d="M20 50 L 12 56 L 18 64 L 32 64" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 50 L 68 56 L 62 64 L 48 64" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 16 L 50 28 L 36 28 Z" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M28 38 L 40 18 L 52 38" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
