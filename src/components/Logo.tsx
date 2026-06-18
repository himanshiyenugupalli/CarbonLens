// Modern CarbonLens logo: a lens aperture forming a "C" with a leaf-shaped notch.
// Pure SVG, scales cleanly, inherits color via currentColor.

type Props = { className?: string; withWordmark?: boolean };

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="CarbonLens logo"
    >
      <defs>
        <linearGradient id="cl-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--leaf)" />
          <stop offset="100%" stopColor="var(--lens)" />
        </linearGradient>
        <linearGradient id="cl-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--lens)" />
          <stop offset="100%" stopColor="var(--leaf)" />
        </linearGradient>
      </defs>
      {/* Outer aperture ring */}
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="url(#cl-grad)"
        strokeWidth="2.2"
      />
      {/* Inner lens disc */}
      <circle cx="20" cy="20" r="9" fill="url(#cl-grad)" opacity="0.18" />
      <circle
        cx="20"
        cy="20"
        r="9"
        fill="none"
        stroke="url(#cl-grad)"
        strokeWidth="1.4"
      />
      {/* Leaf accent forming the opening of the "C" */}
      <path
        d="M30 10 C 26 14, 24 18, 28 22 C 32 20, 34 16, 30 10 Z"
        fill="url(#cl-leaf)"
      />
      {/* Tiny highlight on lens */}
      <circle cx="16.5" cy="16.5" r="1.6" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export function Logo({ className = "", withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8" />
      {withWordmark && (
        <span className="font-semibold tracking-tight">
          Carbon
          <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--lens)] bg-clip-text text-transparent">
            Lens
          </span>
        </span>
      )}
    </span>
  );
}
