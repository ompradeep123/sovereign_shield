import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSelector = () => {
  const { lang, changeLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'hi', name: 'हिन्दी', label: 'HI' },
    { code: 'te', name: 'తెలుగు', label: 'TE' },
    { code: 'ta', name: 'தமிழ்', label: 'TA' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
      <div className="hidden xs:flex items-center px-2 text-slate-500">
        <Languages size={14} />
      </div>
      <div className="flex gap-1">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              lang === l.code
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title={l.name}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
