import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { KeyRound, Settings2, Vault } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/useT';

export default function AppShell({
  title,
  right,
  children,
}: {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  const location = useLocation();
  const { t } = useT();

  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(900px_700px_at_100%_0%,rgba(16,185,129,0.08),transparent_50%),linear-gradient(180deg,#07090b,rgba(7,9,11,0.92))] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:14px_14px]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Vault className="h-5 w-5 text-emerald-200/90" />
            </div>
            <div>
              <div className="text-sm text-zinc-400">{t('app.localVault')}</div>
              <div className="font-mono text-lg tracking-tight">{title ?? t('app.accountManager')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/accounts"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition',
                'hover:bg-white/10',
                location.pathname.startsWith('/accounts') && 'border-emerald-200/20 bg-emerald-300/10',
              )}
            >
              <KeyRound className="h-4 w-4" />
              {t('nav.accounts')}
            </Link>

            <Link
              to="/settings"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition',
                'hover:bg-white/10',
                location.pathname === '/settings' && 'border-emerald-200/20 bg-emerald-300/10',
              )}
            >
              <Settings2 className="h-4 w-4" />
              {t('nav.settings')}
            </Link>
            {right}
          </div>
        </header>

        <main className="mt-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
