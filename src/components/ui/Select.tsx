import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'h-11 w-full appearance-none rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-zinc-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50',
        className,
      )}
    >
      {children}
    </select>
  );
}

