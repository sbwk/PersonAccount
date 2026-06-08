import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        variant === 'primary' &&
          'bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/15 hover:border-emerald-200/25 active:bg-emerald-300/20',
        variant === 'ghost' &&
          'bg-transparent text-zinc-100 hover:bg-white/5 active:bg-white/10',
        variant === 'danger' &&
          'bg-red-500/10 text-red-100 hover:bg-red-500/15 hover:border-red-200/25 active:bg-red-500/20',
        className,
      )}
    />
  );
}

