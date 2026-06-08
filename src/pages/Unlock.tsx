import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useVaultStore } from '@/hooks/useVaultStore';
import { useT } from '@/i18n/useT';
import { scorePasswordStrength } from '@/utils/crypto';
import { cn } from '@/lib/utils';

export default function Unlock() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, initialized, error, bootstrap, initMaster, unlock } = useVaultStore();
  const { t } = useT();

  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'loading') bootstrap();
  }, [bootstrap, status]);

  useEffect(() => {
    if (status === 'unlocked') {
      const to = (location.state as { from?: string } | null)?.from ?? '/accounts';
      navigate(to, { replace: true });
    }
  }, [location.state, navigate, status]);

  const strength = useMemo(() => scorePasswordStrength(pw), [pw]);
  const pwMismatch = initialized ? false : pw.length > 0 && pw2.length > 0 && pw !== pw2;

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!initialized) await initMaster(pw);
      else await unlock(pw);
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    pw.length >= 10 &&
    !pwMismatch &&
    (initialized || (pw2.length >= 10 && strength.level !== 'weak'));

  return (
    <div className="min-h-dvh bg-[radial-gradient(900px_700px_at_30%_-20%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(180deg,#050608,#07090b)] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <Shield className="h-6 w-6 text-emerald-200/90" />
          </div>
          <div>
            <div className="font-mono text-2xl tracking-tight">{t('unlock.title')}</div>
            <div className="mt-1 text-sm text-zinc-400">
              {initialized ? t('unlock.subtitleUnlock') : t('unlock.subtitleInit')}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('unlock.masterPassword')}</div>
              <Input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type="password"
                autoFocus
                autoComplete="current-password"
                placeholder={t('unlock.masterPasswordHint')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSubmit) onSubmit();
                }}
              />
            </div>

            {!initialized && (
              <div>
                <div className="mb-2 text-xs text-zinc-400">{t('unlock.confirmPassword')}</div>
                <Input
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('unlock.confirmPasswordHint')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canSubmit) onSubmit();
                  }}
                />
              </div>
            )}

            {!initialized && (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-400">{t('unlock.strength')}</div>
                  <div
                    className={cn(
                      'text-xs font-medium',
                      strength.level === 'strong' && 'text-emerald-200',
                      strength.level === 'medium' && 'text-yellow-200',
                      strength.level === 'weak' && 'text-red-200',
                    )}
                  >
                    {strength.level === 'strong'
                      ? t('unlock.strengthHigh')
                      : strength.level === 'medium'
                        ? t('unlock.strengthMid')
                        : t('unlock.strengthLow')}
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      'h-full transition-all',
                      strength.level === 'weak' && 'w-1/3 bg-red-400/60',
                      strength.level === 'medium' && 'w-2/3 bg-yellow-300/60',
                      strength.level === 'strong' && 'w-full bg-emerald-300/60',
                    )}
                  />
                </div>
                <div className="mt-3 text-xs text-zinc-500">
                  {t('unlock.tip')}
                </div>
              </div>
            )}

            {pwMismatch && <div className="text-sm text-red-200">{t('unlock.mismatch')}</div>}
            {error && (
              <div className="text-sm text-red-200">
                {error === '主密码不正确或数据已损坏' ? t('unlock.wrongOrCorrupt') : error}
              </div>
            )}

            <div className="pt-2">
              <Button
                onClick={onSubmit}
                disabled={!canSubmit || submitting}
                className="h-11 w-full justify-center"
              >
                {initialized ? t('unlock.unlock') : t('unlock.createAndUnlock')}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-zinc-500">
          {t('unlock.footnote')}
        </div>
      </div>
    </div>
  );
}
