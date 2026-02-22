import { useState, useEffect } from 'react';
import { Surah, SurahDetail, Ayah } from '../types';
import { getSurahDetail, getSurahWithTranslation } from '../services/quranApi';
import { ChevronLeft, Settings2, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  surah: Surah;
  onBack: () => void;
}

export default function ReaderView({ surah, onBack }: Props) {
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [translation, setTranslation] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(28);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [ar, en] = await Promise.all([
          getSurahDetail(surah.number),
          getSurahWithTranslation(surah.number)
        ]);
        setDetail(ar);
        setTranslation(en);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [surah]);

  return (
    <div className="flex flex-col h-full bg-[#fdfaf6] relative">
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={onBack} className="p-2 -ml-2 text-brand-deep">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="font-serif font-bold text-lg">{surah.englishName}</h2>
          <p className="text-[10px] text-brand-sage uppercase tracking-widest">{surah.englishNameTranslation}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFontSize(prev => Math.min(40, prev + 2))}
            className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold"
          >
            A+
          </button>
          <button 
            onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
            className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold"
          >
            A-
          </button>
        </div>
      </div>

      {/* Book Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#fdfaf6] shadow-inner rounded-t-[3rem] border-t border-brand-gold/10 p-8 pb-20 relative overflow-x-hidden">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        
        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-10 bg-brand-gold/5 animate-pulse rounded-xl w-full" />
                <div className="h-4 bg-brand-gold/5 animate-pulse rounded-xl w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {surah.number !== 1 && surah.number !== 9 && (
              <div className="text-center py-10 border-b border-brand-gold/10 mb-10">
                <p className="text-4xl font-arabic text-brand-deep leading-relaxed">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              </div>
            )}
            {detail?.ayahs.map((ayah, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                key={ayah.number} 
                className="relative group"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-end items-start gap-4">
                    <p 
                      className="arabic-text text-right leading-[2.2] text-brand-deep flex-1"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {ayah.text}
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-gold/30 text-[10px] font-bold text-brand-gold mx-2 align-middle">
                        {ayah.numberInSurah}
                      </span>
                    </p>
                  </div>
                  {translation && (
                    <div className="pl-4 border-l-2 border-brand-gold/20">
                      <p className="text-sm text-brand-sage leading-relaxed italic">
                        {translation.ayahs[idx].text}
                      </p>
                    </div>
                  )}
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent w-full mt-10" />
              </motion.div>
            ))}
            
            <div className="text-center py-10">
              <div className="w-12 h-1 bg-brand-gold/20 mx-auto rounded-full mb-4" />
              <p className="text-[10px] text-brand-sage font-bold uppercase tracking-widest">End of Surah {surah.englishName}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
