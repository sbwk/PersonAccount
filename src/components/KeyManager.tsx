import { useMemo, useState } from 'react';
import { Check, Copy, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { AccountKey } from '@/types';
import { copyText } from '@/utils/clipboard';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/useT';

type Draft = {
  id?: string;
  name: string;
  value: string;
  expiresAt: string;
  note: string;
};

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `key_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function statusOf(expiresAt?: string) {
  if (!expiresAt) return null;
  const t = new Date(expiresAt).getTime();
  if (Number.isNaN(t)) return null;
  const diff = t - Date.now();
  if (diff < 0) return { tone: 'bad' as const, key: 'keys.statusBad' as const };
  if (diff < 1000 * 60 * 60 * 24 * 7) return { tone: 'warn' as const, key: 'keys.statusSoon' as const };
  return { tone: 'ok' as const, key: 'keys.statusOk' as const };
}

export default function KeyManager({
  keys,
  onChange,
}: {
  keys: AccountKey[];
  onChange: (keys: AccountKey[]) => Promise<void> | void;
}) {
  const { t } = useT();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...keys].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [keys]);

  async function onCopy(value: string) {
    await copyText(value);
    setToast(t('keys.copied'));
    window.setTimeout(() => setToast(null), 1200);
  }

  function startNew() {
    setDraft({ name: '', value: '', expiresAt: '', note: '' });
  }

  function startEdit(k: AccountKey) {
    setDraft({
      id: k.id,
      name: k.name,
      value: k.value,
      expiresAt: k.expiresAt ?? '',
      note: k.note ?? '',
    });
  }

  function cancel() {
    setDraft(null);
  }

  async function save() {
    if (!draft) return;
    const name = draft.name.trim();
    const value = draft.value.trim();
    if (!name || !value) return;

    setBusy(true);
    try {
      const now = nowIso();
      const next: AccountKey = {
        id: draft.id ?? newId(),
        name,
        value,
        expiresAt: draft.expiresAt || undefined,
        note: draft.note.trim() || undefined,
        createdAt: draft.id ? keys.find((k) => k.id === draft.id)?.createdAt ?? now : now,
        updatedAt: now,
      };

      const nextKeys = draft.id ? keys.map((k) => (k.id === draft.id ? next : k)) : [next, ...keys];
      await onChange(nextKeys);
      setDraft(null);
      setToast(t('keys.saved'));
      window.setTimeout(() => setToast(null), 1200);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const ok = window.confirm(t('keys.deleteConfirm'));
    if (!ok) return;
    setBusy(true);
    try {
      await onChange(keys.filter((k) => k.id !== id));
    } finally {
      setBusy(false);
    }
  }

  const canSave = Boolean(draft && draft.name.trim() && draft.value.trim() && !busy);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-lg">{t('keys.title')}</div>
          <div className="mt-1 text-sm text-zinc-400">{t('keys.desc')}</div>
        </div>
        <Button size="sm" className="h-9" onClick={startNew} disabled={Boolean(draft) || busy}>
          <Plus className="h-4 w-4" />
          {t('keys.add')}
        </Button>
      </div>

      {draft && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('keys.name')}</div>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder={t('keys.namePlaceholder')}
              />
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-400">{t('keys.expiresAt')}</div>
              <Input
                value={draft.expiresAt}
                onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value })}
                type="date"
              />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 text-xs text-zinc-400">{t('keys.key')}</div>
              <Input
                value={draft.value}
                onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                placeholder={t('keys.keyPlaceholder')}
              />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 text-xs text-zinc-400">{t('keys.note')}</div>
              <Input
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                placeholder={t('keys.notePlaceholder')}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" className="h-9" onClick={cancel} disabled={busy}>
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button size="sm" className="h-9" onClick={save} disabled={!canSave}>
              <Save className="h-4 w-4" />
              {t('common.save')}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-3">
        {sorted.map((k) => {
          const s = statusOf(k.expiresAt);
          return (
            <div key={k.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate font-mono text-sm">{k.name}</div>
                    {s && (
                      <div
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[11px]',
                          s.tone === 'bad' && 'border-red-200/20 bg-red-500/10 text-red-100',
                          s.tone === 'warn' && 'border-yellow-200/20 bg-yellow-400/10 text-yellow-100',
                          s.tone === 'ok' && 'border-emerald-200/20 bg-emerald-300/10 text-emerald-100',
                        )}
                      >
                        {t(s.key)}
                      </div>
                    )}
                    {!s && (
                      <div className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[11px] text-zinc-400">
                        {t('keys.noExpires')}
                      </div>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    {t('keys.expLabel')}：{k.expiresAt ? k.expiresAt : t('common.none')}
                  </div>

                  <div className="mt-3 font-mono text-xs text-zinc-500">{'••••••••••••••••••••••••'}</div>

                  {k.note && <div className="mt-2 text-xs text-zinc-400">{k.note}</div>}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Button size="sm" variant="ghost" className="h-9" onClick={() => onCopy(k.value)} disabled={busy}>
                    <Copy className="h-4 w-4" />
                    {t('common.copy')}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-9" onClick={() => startEdit(k)} disabled={Boolean(draft) || busy}>
                    <Pencil className="h-4 w-4" />
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="danger" className="h-9" onClick={() => remove(k.id)} disabled={busy}>
                    <Trash2 className="h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-sm text-zinc-400">
            {t('keys.none')}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs text-zinc-200">
          <div className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-200/90" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
