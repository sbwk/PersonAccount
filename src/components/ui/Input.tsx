import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-zinc-100',
        'placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50',
        className,
      )}
    />
  );
}

