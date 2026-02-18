import { ButtonHTMLAttributes } from 'react';

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', children, ...props }: CommonButtonProps) {
  const base = 'rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2';
  const styles =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary'
      : 'border border-gray-300 bg-white text-neutral-darkest hover:bg-neutral-light focus-visible:ring-primary';

  return (
    <button className={`${base} ${styles} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
