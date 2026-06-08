import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Pencil, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import AppShell from '@/components/AppShell';
import KeyManager from '@/components/KeyManager';
import Button from '@/components/ui/Button';
import { useVaultStore } from '@/hooks/useVaultStore';
import { copyText } from '@/utils/clipboard';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/useT';

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 break-words text-sm text-zinc-200">{value}</div>
    </div>
  );
}

export default function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccount, deleteAccount, upsertAccount } = useVaultStore();
  const account = useMemo(() => (id ? getAccount(id) : null), [getAccount, id]);
  const { t } = useT();

  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!account) {
    return (
      <AppShell title={t('account.detail')}>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
          {t('account.notFound')}
        </div>
      </AppShell>
    );
  }

  async function onCopy(text: string, message: string) {
    await copyText(text);
    setToast(message);
    window.setTimeout(() => setToast(null), 1200);
  }

  async function onDelete() {
    const ok = window.confirm(t('account.deleteConfirm'));
    if (!ok) return;
    await deleteAccount(account.id);
    navigate('/accounts', { replace: true });
  }

  const due = account.expiresAt ?? account.billing?.renewAt;

  return (
    <AppShell
      title={account.title}
      right={
        <div className="flex items-center gap-2">
          <Link to={`/accounts/${account.id}/edit`}>
            <Button size="sm" variant="ghost" className="h-9">
              <Pencil className="h-4 w-4" />
              {t('common.edit')}
            </Button>
          </Link>
          <Button size="sm" variant="danger" className="h-9" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {t('common.delete')}
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs text-zinc-400">{t('account.type')}</div>
              <div className="mt-2 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs">
                {account.category || t('accounts.uncategorized')}
              </div>
              {due && (
                <div className="mt-3 text-xs text-zinc-500">
                  {account.expiresAt ? t('account.expiresAt') : t('account.renewAt')}：{due}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-9"
                onClick={() => onCopy(account.login, t('account.copiedAccount'))}
              >
                <Copy className="h-4 w-4" />
                {t('common.copy')} {t('account.login')}
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="h-9"
                onClick={() => onCopy(account.password, t('account.copiedPassword'))}
              >
                <Copy className="h-4 w-4" />
                {t('common.copy')} {t('account.password')}
              </Button>
              {account.url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9"
                  onClick={() => window.open(account.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('common.openWebsite')}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label={t('account.login')} value={account.login} />
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">{t('account.password')}</div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-300 transition hover:bg-white/10"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPw ? t('account.hide') : t('account.show')}
                </button>
              </div>
              <div
                className={cn(
                  'mt-2 break-words font-mono text-sm',
                  showPw ? 'text-emerald-100' : 'text-zinc-500',
                )}
              >
                {showPw ? account.password : '••••••••••••'}
              </div>
            </div>

            <Field label={t('account.website')} value={account.url} />
            <Field label={t('account.registeredAt')} value={account.registeredAt} />
            <Field label={t('account.level')} value={account.level} />
            <Field label={t('account.note')} value={account.note} />
          </div>
        </div>

        <KeyManager
          keys={account.keys ?? []}
          onChange={async (keys) => {
            await upsertAccount({
              id: account.id,
              title: account.title,
              category: account.category,
              login: account.login,
              password: account.password,
              keys,
              url: account.url,
              registeredAt: account.registeredAt,
              level: account.level,
              expiresAt: account.expiresAt,
              billing: account.billing,
              note: account.note,
            });
          }}
        />

        <div className="text-xs text-zinc-500">
          <Link to="/accounts" className="underline underline-offset-4 hover:text-zinc-300">
            {t('account.backToList')}
          </Link>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs text-zinc-200">
          {toast}
        </div>
      )}
    </AppShell>
  );
}
