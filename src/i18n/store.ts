import { create } from 'zustand';
import type { Lang } from '@/i18n/messages';

const STORAGE_KEY = 'lang';

type I18nState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

function getInitialLang(): Lang {
  const saved = (localStorage.getItem(STORAGE_KEY) as Lang | null) ?? null;
  if (saved === 'zh' || saved === 'en') return saved;
  return 'zh';
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: getInitialLang(),
  setLang: (lang) => {
    localStorage.setItem(STORAGE_KEY, lang);
    set({ lang });
  },
}));

