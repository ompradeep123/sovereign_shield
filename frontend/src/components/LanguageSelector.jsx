import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages, ChevronDown } from 'lucide-react';

const LanguageSelector = () => {
  const { lang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all active:scale-95 group"
      >
        <Languages size={16} className="text-blue-400 group-hover:text-blue-300" />
        <span className="text-xs font-bold text-slate-200 hidden xs:block">{currentLang.name}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  changeLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between ${
                  lang === l.code
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{l.name}</span>
                {lang === l.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
