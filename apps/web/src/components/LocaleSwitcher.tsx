'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Replace the locale prefix in current pathname
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ru' || segments[1] === 'uz') {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/') || '/');
  };

  return (
    <div className="flex items-center gap-1.5 bg-dark-800 border border-dark-600 rounded-lg px-2.5 py-1.5 text-xs text-gray-300">
      <Globe className="w-3.5 h-3.5 text-gray-400" />
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        aria-label="Language selection"
        className="bg-transparent border-none text-xs text-gray-200 focus:outline-none cursor-pointer"
      >
        <option value="en" className="bg-dark-800 text-white">English (EN)</option>
        <option value="ru" className="bg-dark-800 text-white">Русский (RU)</option>
        <option value="uz" className="bg-dark-800 text-white">O'zbek (UZ)</option>
      </select>
    </div>
  );
}
