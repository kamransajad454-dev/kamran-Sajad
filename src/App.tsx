import React, { useState, useEffect, cloneElement } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Headphones, MessageSquare, Home, Search, ChevronRight, Play, Pause, X, Sparkles, Info, User } from 'lucide-react';
import { Surah, SurahDetail, Ayah } from './types';
import { getSurahs, getSurahDetail, getSurahWithTranslation } from './services/quranApi';
import SurahListView from './components/SurahListView';
import ReaderView from './components/ReaderView';
import AudioPlayerView from './components/AudioPlayerView';
import AIChatView from './components/AIChatView';

type View = 'home' | 'read' | 'listen' | 'ai';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDevInfo, setShowDevInfo] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const data = await getSurahs();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to fetch surahs", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSurahSelect = (surah: Surah, view: View = 'read') => {
    setSelectedSurah(surah);
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-brand-cream overflow-hidden relative shadow-2xl border-x border-brand-gold/10">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30">
            <Book className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-brand-deep tracking-tight">Al-Qari <span className="text-brand-gold text-sm font-medium">(by KS)</span></h1>
            <p className="text-[10px] text-brand-sage uppercase tracking-widest font-bold">Quran Companion</p>
          </div>
        </div>
        <button 
          onClick={() => setShowDevInfo(true)}
          className="w-8 h-8 rounded-full bg-brand-deep/5 flex items-center justify-center text-brand-sage hover:bg-brand-gold/10 transition-colors"
        >
          <Info size={16} />
        </button>
      </header>

      {/* Developer Info Modal */}
      <AnimatePresence>
        {showDevInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-brand-deep/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs relative shadow-2xl"
            >
              <button 
                onClick={() => setShowDevInfo(false)}
                className="absolute top-6 right-6 text-brand-sage hover:text-brand-deep"
              >
                <X size={20} />
              </button>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-2">
                  <User className="text-brand-gold w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-brand-deep">Kamran Sajad</h3>
                  <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">Lead Developer</p>
                </div>
                <div className="h-px bg-brand-gold/10 w-full" />
                <div className="text-left space-y-3">
                  <p className="text-[10px] text-brand-sage font-bold uppercase tracking-widest">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {['React 19', 'Tailwind CSS', 'Gemini 3.1 Pro', 'Motion', 'Lucide Icons', 'Al-Quran API'].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-brand-cream border border-brand-gold/10 rounded-full text-[10px] font-medium text-brand-deep">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-brand-sage leading-relaxed pt-2">
                  Crafted with devotion to provide a seamless spiritual experience for the global Ummah.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <motion.section 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative h-56 rounded-[2.5rem] overflow-hidden shadow-2xl group"
              >
                <img 
                  src="https://picsum.photos/seed/quran-art/800/600" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  alt="Quran"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/95 via-brand-deep/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-white text-2xl font-serif font-bold leading-tight">Spiritual Journey</h2>
                    <p className="text-brand-gold text-sm font-medium mt-1 italic">"Read in the name of your Lord..."</p>
                  </motion.div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Sparkles className="text-brand-gold w-6 h-6 animate-pulse" />
                  </div>
                </div>
              </motion.section>

              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif font-bold text-xl text-brand-deep">Recent Surahs</h3>
                  <button onClick={() => setCurrentView('read')} className="text-brand-gold text-xs font-bold uppercase tracking-widest">Explore All</button>
                </div>
                <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                  {surahs.slice(0, 6).map((s, i) => (
                    <motion.button 
                      key={s.number}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      onClick={() => handleSurahSelect(s, 'read')}
                      className="flex-shrink-0 w-40 h-52 bg-white rounded-[2rem] p-6 shadow-xl shadow-brand-gold/5 border border-brand-gold/10 flex flex-col justify-between text-left transition-all hover:border-brand-gold/40 hover:-translate-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-serif font-bold text-sm">
                        {s.number}
                      </div>
                      <div>
                        <p className="text-3xl font-arabic text-brand-gold mb-1 group-hover:scale-110 transition-transform origin-left">{s.name}</p>
                        <p className="text-sm font-bold text-brand-deep truncate">{s.englishName}</p>
                        <p className="text-[10px] text-brand-sage font-medium">{s.numberOfAyahs} Verses</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-serif font-bold text-xl text-brand-deep mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-5">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentView('listen')}
                    className="relative bg-brand-deep text-white p-8 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl group-hover:bg-brand-gold/20 transition-colors" />
                    <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                      <Headphones className="w-8 h-8 text-brand-gold" />
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-lg block">Listen</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Audio Recitation</span>
                    </div>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentView('ai')}
                    className="relative bg-brand-gold text-white p-8 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-lg block">Ask AI</span>
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">Islamic Insights</span>
                    </div>
                  </motion.button>
                </div>
              </section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-brand-gold/5 border border-brand-gold/10 rounded-[2rem] p-6 text-center"
              >
                <p className="text-xs text-brand-sage font-bold uppercase tracking-widest mb-2">Daily Verse</p>
                <p className="arabic-text text-xl text-brand-deep mb-3">إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
                <p className="text-sm text-brand-deep font-serif italic">"Indeed, with hardship [will be] ease."</p>
                <p className="text-[10px] text-brand-gold font-bold mt-2">Surah Ash-Sharh 94:6</p>
              </motion.section>
            </motion.div>
          )}

          {currentView === 'read' && (
            <motion.div
              key="read"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {!selectedSurah ? (
                <SurahListView 
                  surahs={surahs} 
                  onSelect={(s) => handleSurahSelect(s, 'read')} 
                  loading={loading}
                />
              ) : (
                <ReaderView 
                  surah={selectedSurah} 
                  onBack={() => setSelectedSurah(null)} 
                />
              )}
            </motion.div>
          )}

          {currentView === 'listen' && (
            <motion.div
              key="listen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {!selectedSurah ? (
                <SurahListView 
                  surahs={surahs} 
                  onSelect={(s) => handleSurahSelect(s, 'listen')} 
                  loading={loading}
                  title="Select Recitation"
                />
              ) : (
                <AudioPlayerView 
                  surah={selectedSurah} 
                  onBack={() => setSelectedSurah(null)} 
                />
              )}
            </motion.div>
          )}

          {currentView === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <AIChatView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-brand-gold/10 px-6 py-4 flex justify-between items-center z-20">
        <NavButton active={currentView === 'home'} onClick={() => { setCurrentView('home'); setSelectedSurah(null); }} icon={<Home />} label="Home" />
        <NavButton active={currentView === 'read'} onClick={() => setCurrentView('read')} icon={<Book />} label="Read" />
        <NavButton active={currentView === 'listen'} onClick={() => setCurrentView('listen')} icon={<Headphones />} label="Listen" />
        <NavButton active={currentView === 'ai'} onClick={() => setCurrentView('ai')} icon={<MessageSquare />} label="AI Chat" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-brand-gold scale-110' : 'text-brand-sage opacity-60'}`}
    >
      <div className={`p-2 rounded-xl ${active ? 'bg-brand-gold/10' : ''}`}>
        {cloneElement(icon as any, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
