import { useState, useEffect, useRef } from 'react';
import { Surah, Reciter } from '../types';
import { getAudioForSurah, getReciters } from '../services/quranApi';
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  surah: Surah;
  onBack: () => void;
}

export default function AudioPlayerView({ surah, onBack }: Props) {
  const [detail, setDetail] = useState<any | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [showReciters, setShowReciters] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function init() {
      const r = await getReciters();
      setReciters(r);
    }
    init();
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAudioForSurah(surah.number, selectedReciter);
        setDetail(data);
        setCurrentAyahIdx(0);
        setIsPlaying(false);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [surah, selectedReciter]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAyahIdx]);

  const handleEnded = () => {
    if (detail && currentAyahIdx < detail.ayahs.length - 1) {
      setCurrentAyahIdx(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentAyahIdx(0);
    }
  };

  const currentAyah = detail?.ayahs[currentAyahIdx];

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-brand-deep">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="font-serif font-bold text-lg">Now Playing</h2>
          <p className="text-[10px] text-brand-sage uppercase tracking-widest">Surah {surah.englishName}</p>
        </div>
        <button 
          onClick={() => setShowReciters(!showReciters)}
          className={`p-2 rounded-full transition-colors ${showReciters ? 'bg-brand-gold text-white' : 'text-brand-sage'}`}
        >
          <User size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showReciters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border border-brand-gold/10 rounded-3xl p-4 shadow-xl mx-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-sage mb-3 px-2">Select Reciter</h3>
            <div className="space-y-1">
              {reciters.map(r => (
                <button
                  key={r.identifier}
                  onClick={() => {
                    setSelectedReciter(r.identifier);
                    setShowReciters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    selectedReciter === r.identifier 
                      ? 'bg-brand-gold text-white font-bold' 
                      : 'hover:bg-brand-gold/10 text-brand-deep'
                  }`}
                >
                  {r.englishName}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        <div className="relative">
          <motion.div 
            animate={{ 
              rotate: isPlaying ? 360 : 0,
              scale: isPlaying ? [1, 1.02, 1] : 1
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 20, ease: "linear" },
              scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            className="w-64 h-64 rounded-full bg-brand-deep flex items-center justify-center relative shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <img 
                src={`https://picsum.photos/seed/${surah.number}/400/400`} 
                className="w-full h-full object-cover"
                alt="Art"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-brand-deep/60 backdrop-blur-[2px]" />
            <div className="text-center p-8 z-10">
              <p className="text-5xl font-arabic text-brand-gold mb-2">{surah.name}</p>
              <p className="text-white font-serif text-xl font-medium">{surah.englishName}</p>
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? [8, 20, 8] : 8 }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-brand-gold rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Progress Ring */}
          <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="136"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-brand-gold/10"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="136"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="854"
              animate={{ strokeDashoffset: detail ? 854 - (854 * (currentAyahIdx + 1) / detail.ayahs.length) : 854 }}
              className="text-brand-gold"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="w-full space-y-6 px-4">
          <div className="text-center min-h-[120px] flex flex-col justify-center">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-white/50 animate-pulse rounded w-3/4 mx-auto" />
                <div className="h-4 bg-white/50 animate-pulse rounded w-1/2 mx-auto" />
              </div>
            ) : (
              <motion.div
                key={currentAyahIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="arabic-text text-2xl text-brand-deep leading-relaxed">
                  {currentAyah?.text}
                </p>
                <p className="text-brand-sage text-xs uppercase tracking-widest font-bold">
                  Verse {currentAyah?.numberInSurah} of {detail?.ayahs.length}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button 
            onClick={() => setCurrentAyahIdx(Math.max(0, currentAyahIdx - 1))}
            className="p-4 text-brand-deep hover:text-brand-gold transition-all active:scale-90"
          >
            <SkipBack size={32} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 h-24 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-2xl shadow-brand-gold/40 transition-all active:scale-90 hover:scale-105"
          >
            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
          </button>

          <button 
            onClick={() => setCurrentAyahIdx(Math.min((detail?.ayahs.length || 1) - 1, currentAyahIdx + 1))}
            className="p-4 text-brand-deep hover:text-brand-gold transition-all active:scale-90"
          >
            <SkipForward size={32} fill="currentColor" />
          </button>
        </div>
      </div>

      {currentAyah && (
        <audio 
          ref={audioRef}
          src={currentAyah.audio}
          onEnded={handleEnded}
          className="hidden"
        />
      )}
    </div>
  );
}
