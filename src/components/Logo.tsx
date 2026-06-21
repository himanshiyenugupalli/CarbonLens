// Minimalist, premium CarbonLens logo: intersecting thin geometric rings forming a subtle leaf in the center.
// Designed to match the sophisticated, hybrid-typography theme.

type Props = { className?: string; withWordmark?: boolean };

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" role="img" aria-label="CarbonLens logo">
      {/* Left ring - Green */}
      <circle cx="16" cy="20" r="12" stroke="var(--leaf)" strokeWidth="1.5" opacity="0.9" />
      {/* Right ring - Magenta */}
      <circle cx="24" cy="20" r="12" stroke="var(--lens)" strokeWidth="1.5" opacity="0.9" />
      {/* Intersection Leaf Highlight */}
      <path 
        d="M20 8.7 C 16 14 16 26 20 31.3 C 24 26 24 14 20 8.7 Z" 
        fill="var(--leaf)" 
        opacity="0.15" 
      />
    </svg>
  );
}

export function Logo({ className = "", withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-7" />
      {withWordmark && (
        <span className="flex items-baseline tracking-tight">
          <span className="font-serif text-xl font-bold italic text-foreground">Carbon</span>
          <span className="font-sans text-lg font-medium text-muted-foreground ml-0.5">Lens</span>
        </span>
      )}
    </span>
  );
}
