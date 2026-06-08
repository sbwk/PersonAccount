import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useVaultStore } from '@/hooks/useVaultStore';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/useT';

export default function Accounts() {
  const { accounts } = useVaultStore();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const { t } = useT();

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of accounts) set.add(a.category || t('accounts.uncategorized'));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh'));
  }, [accounts, t]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return accounts.filter((a) => {
      if (category !== 'all' && a.category !== category) return false;
      if (!keyword) return true;
      return (
        a.title.toLowerCase().includes(keyword) ||
        a.login.toLowerCase().includes(keyword) ||
        (a.url ?? '').toLowerCase().includes(keyword)
      );
    });
  }, [accounts, category, q]);

  return (
    <AppShell
      title={t('accounts.title')}
      right={
        <Link to="/accounts/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4" />
            {t('common.add')}
          </Button>
        </Link>
      }
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('accounts.searchPlaceholder')}
              className="pl-11"
            />
          </div>

          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">{t('accounts.allCategories')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((a) => {
            const due = a.expiresAt ?? a.billing?.renewAt;
            const dueLabel = due ? `${t('accounts.due')}：${due}` : null;
            const isDueSoon = due ? new Date(due).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7 : false;

            return (
              <Link
                key={a.id}
                to={`/accounts/${a.id}`}
                className={cn(
                  'group rounded-3xl border border-white/10 bg-white/5 p-5 transition',
                  'hover:-translate-y-0.5 hover:border-emerald-200/20 hover:bg-emerald-300/5',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-base tracking-tight">{a.title}</div>
                    <div className="mt-1 text-xs text-zinc-400">{a.login}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-zinc-300">
                      {a.category || t('accounts.uncategorized')}
                    </div>
                    {dueLabel && (
                      <div
                        className={cn(
                          'rounded-full border px-3 py-1 text-[11px]',
                          isDueSoon
                            ? 'border-yellow-200/20 bg-yellow-400/10 text-yellow-100'
                            : 'border-white/10 bg-black/10 text-zinc-400',
                        )}
                      >
                        {dueLabel}
                      </div>
                    )}
                  </div>
                </div>

                {a.note && (
                  <div className="mt-4 line-clamp-2 text-sm text-zinc-400 group-hover:text-zinc-300">
                    {a.note}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
            {t('accounts.empty')}
          </div>
        )}
      </div>
    </AppShell>
  );
}
