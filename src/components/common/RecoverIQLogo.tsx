interface RecoverIQLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClassMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

export function RecoverIQLogo({ size = 'sm', className = '' }: RecoverIQLogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary-light ${sizeClassMap[size]} ${className}`.trim()}
      aria-label="RecoverIQ logo"
    >
      <img
        src="/recoveriq-logo.png"
        alt="RecoverIQ"
        className="h-full w-full object-cover"
        onError={(event) => {
          const target = event.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <span
        className="hidden h-full w-full items-center justify-center bg-primary text-sm font-bold text-white"
        aria-hidden="true"
      >
        R
      </span>
    </span>
  );
}
