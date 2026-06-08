import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useVaultStore } from '@/hooks/useVaultStore';
import type { BillingCycle } from '@/types';
import { useT } from '@/i18n/useT';

export default function AccountEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccount, upsertAccount } = useVaultStore();
  const editing = useMemo(() => (id ? getAccount(id) : null), [getAccount, id]);
  const { t } = useT();

  const [title, setTitle] = useState(editing?.title ?? '');
  const [category, setCategory] = useState(editing?.category ?? t('accounts.uncategorized'));
  const [login, setLogin] = useState(editing?.login ?? '');
  const [password, setPassword] = useState(editing?.password ?? '');
  const [url, setUrl] = useState(editing?.url ?? '');
  const [registeredAt, setRegisteredAt] = useState(editing?.registeredAt ?? '');
  const [level, setLevel] = useState(editing?.level ?? '');
  const [expiresAt, setExpiresAt] = useState(editing?.expiresAt ?? '');
  const [note, setNote] = useState(editing?.note ?? '');

  const [isPaid, setIsPaid] = useState(Boolean(editing?.billing?.isPaid));
  const [cycle, setCycle] = useState<BillingCycle>(editing?.billing?.cycle ?? 'unknown');
  const [renewAt, setRenewAt] = useState(editing?.billing?.renewAt ?? '');

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && login.trim().length > 0 && password.length > 0 && !saving;

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      const nextId = await upsertAccount({
        id: editing?.id,
        title: title.trim(),
        category: category.trim() || t('accounts.uncategorized'),
        login: login.trim(),
        password,
        url: url.trim() || undefined,
        registeredAt: registeredAt || undefined,
        level: level.trim() || undefined,
        expiresAt: expiresAt || undefined,
        billing: isPaid
          ? {
              isPaid: true,
              cycle,
              renewAt: renewAt || undefined,
            }
          : undefined,
        note: note.trim() || undefined,
      });
      navigate(`/accounts/${nextId}`, { replace: true });
    } catch {
      setError(t('edit.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  const billingCycles: { value: BillingCycle; label: string }[] = [
    { value: 'monthly', label: t('edit.monthly') },
    { value: 'quarterly', label: t('edit.quarterly') },
    { value: 'yearly', label: t('edit.yearly') },
    { value: 'one_time', label: t('edit.oneTime') },
    { value: 'unknown', label: t('edit.unknown') },
  ];

  return (
    <AppShell
      title={editing ? t('edit.editTitle') : t('edit.newTitle')}
      right={
        <Button size="sm" className="h-9" onClick={onSave} disabled={!canSave}>
          <Save className="h-4 w-4" />
          {t('common.save')}
        </Button>
      }
    >
      <div className="grid gap-6">
        <Link
          to={editing ? `/accounts/${editing.id}` : '/accounts'}
          className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="mb-2 text-xs text-zinc-400">{t('edit.name')}</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('edit.namePlaceholder')} />
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('edit.category')}</div>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t('edit.categoryPlaceholder')}
              />
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('edit.login')}</div>
              <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder={t('edit.loginPlaceholder')} />
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 text-xs text-zinc-400">{t('edit.password')}</div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder={t('edit.passwordPlaceholder')}
              />
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 text-xs text-zinc-400">{t('edit.url')}</div>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('edit.urlPlaceholder')} />
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('edit.registeredAt')}</div>
              <Input value={registeredAt} onChange={(e) => setRegisteredAt(e.target.value)} type="date" />
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('edit.level')}</div>
              <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder={t('edit.levelPlaceholder')} />
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('edit.expiresAt')}</div>
              <Input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-400">{t('edit.paidAccount')}</div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-black/20 text-emerald-300 focus:ring-emerald-300/40"
                  />
                  {t('edit.enabled')}
                </label>
              </div>

              {isPaid && (
                <div className="mt-4 grid gap-3">
                  <div>
                    <div className="mb-2 text-xs text-zinc-400">{t('edit.cycle')}</div>
                    <Select value={cycle} onChange={(e) => setCycle(e.target.value as BillingCycle)}>
                      {billingCycles.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <div className="mb-2 text-xs text-zinc-400">{t('edit.renewAt')}</div>
                    <Input value={renewAt} onChange={(e) => setRenewAt(e.target.value)} type="date" />
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 text-xs text-zinc-400">{t('edit.note')}</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
                placeholder={t('edit.notePlaceholder')}
              />
            </div>
          </div>

          {error && <div className="mt-4 text-sm text-red-200">{error}</div>}
        </div>
      </div>
    </AppShell>
  );
}
