import React, { createContext, useContext, useMemo, useState } from 'react';
import { AR } from './ar';

export type Lang = 'en' | 'ar';

type Ctx = {
  lang: Lang;
  rtl: boolean;
  setLang: (l: Lang) => void;
  // Translate a fixed string. Unknown strings fall back to English.
  t: (s: string) => string;
  // Translate a template with {name} placeholders, then fill the values.
  tf: (s: string, vars: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx>({
  lang: 'en',
  rtl: false,
  setLang: () => {},
  t: (s) => s,
  tf: (s) => s,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const value = useMemo<Ctx>(() => {
    const t = (s: string) => (lang === 'ar' ? AR[s] ?? s : s);
    const tf = (s: string, vars: Record<string, string | number>) => {
      let out = t(s);
      Object.keys(vars).forEach((k) => {
        out = out.split('{' + k + '}').join(String(vars[k]));
      });
      return out;
    };
    return { lang, rtl: lang === 'ar', setLang, t, tf };
  }, [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
