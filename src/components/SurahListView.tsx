import { Surah } from '../types';
import { Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Props {
  surahs: Surah[];
  onSelect: (surah: Surah) => void;
  loading: boolean;
  title?: string;
}

export default function SurahListView({ surahs, onSelect, loading, title = "Surahs" }: Props) {
  const [search, setSearch] = useState("");

  const filtered = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search) ||
    s.number.toString() === search
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold mb-4">{title}</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
          <input 
            type="text"
            placeholder="Search Surah..."
            className="w-full bg-white border border-brand-gold/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 pb-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/50 animate-pulse rounded-2xl border border-brand-gold/5" />
          ))
        ) : (
          filtered.map(surah => (
            <button
              key={surah.number}
              onClick={() => onSelect(surah)}
              className="w-full bg-white p-4 rounded-2xl border border-brand-gold/10 flex items-center justify-between hover:border-brand-gold/40 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center text-brand-gold font-serif font-bold border border-brand-gold/10">
                  {surah.number}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-brand-deep">{surah.englishName}</h4>
                  <p className="text-xs text-brand-sage">{surah.englishNameTranslation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xl font-arabic text-brand-gold">{surah.name}</p>
                  <p className="text-[10px] text-brand-sage uppercase font-medium">{surah.numberOfAyahs} Ayahs</p>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-gold/40 group-hover:text-brand-gold transition-colors" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
