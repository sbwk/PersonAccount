import { useMemo } from 'react';
import { messages } from '@/i18n/messages';
import { useI18nStore } from '@/i18n/store';

type Path = readonly string[];

function getByPath(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

export function useT() {
  const lang = useI18nStore((s) => s.lang);

  const t = useMemo(() => {
    return (path: string, fallback?: string) => {
      const parts = path.split('.');
      const v = getByPath(messages[lang], parts);
      if (typeof v === 'string') return v;
      const zh = getByPath(messages.zh, parts);
      if (typeof zh === 'string') return zh;
      return fallback ?? path;
    };
  }, [lang]);

  return { t, lang };
}

