import { useNavigate } from 'react-router-dom';
import { Lock, Database } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Button from '@/components/ui/Button';
import { useVaultStore } from '@/hooks/useVaultStore';
import { useI18nStore } from '@/i18n/store';
import { useT } from '@/i18n/useT';

export default function Settings() {
  const navigate = useNavigate();
  const { accounts, lock } = useVaultStore();
  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const { t } = useT();

  function onLock() {
    lock();
    navigate('/unlock', { replace: true });
  }

  return (
    <AppShell title={t('settings.title')}>
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-lg">{t('settings.session')}</div>
              <div className="mt-1 text-sm text-zinc-400">{t('settings.sessionDesc')}</div>
            </div>
            <Button variant="ghost" className="h-11" onClick={onLock}>
              <Lock className="h-4 w-4" />
              {t('settings.lockNow')}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-lg">{t('settings.language')}</div>
              <div className="mt-1 text-sm text-zinc-400">{lang === 'zh' ? t('settings.languageZh') : t('settings.languageEn')}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={lang === 'zh' ? 'primary' : 'ghost'}
                className="h-11"
                onClick={() => setLang('zh')}
              >
                {t('settings.languageZh')}
              </Button>
              <Button
                variant={lang === 'en' ? 'primary' : 'ghost'}
                className="h-11"
                onClick={() => setLang('en')}
              >
                {t('settings.languageEn')}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-lg">{t('settings.data')}</div>
              <div className="mt-1 text-sm text-zinc-400">
                {t('settings.recordCount')}：{accounts.length}
              </div>
              <div className="mt-2 text-xs text-zinc-500">{t('settings.storedIn')}</div>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20">
              <Database className="h-5 w-5 text-emerald-200/80" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
