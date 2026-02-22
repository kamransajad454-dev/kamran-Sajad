import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Brain, Info, History, Trash2, Lightbulb } from 'lucide-react';
import { askGemini } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  isThinking?: boolean;
}

const SUGGESTIONS = [
  "What is the meaning of Surah Al-Fatiha?",
  "Tell me about the history of the Quran.",
  "What does the Quran say about patience?",
  "Explain the significance of Laylat al-Qadr.",
  "How many Surahs are in the Quran?"
];

export default function AIChatView() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('al-qari-chat');
    return saved ? JSON.parse(saved) : [
      { role: 'bot', content: "Assalamu Alaikum! I am Al-Qari AI. How can I help you understand the Quran today?" }
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('al-qari-chat', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    const msgToSend = text || input;
    if (!msgToSend.trim() || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: msgToSend }]);
    setIsLoading(true);

    const response = await askGemini(msgToSend, useThinking);
    
    setMessages(prev => [...prev, { 
      role: 'bot', 
      content: response,
      isThinking: useThinking
    }]);
    setIsLoading(false);
  };

  const clearChat = () => {
    if (confirm("Clear all chat history?")) {
      setMessages([{ role: 'bot', content: "Assalamu Alaikum! I am Al-Qari AI. How can I help you understand the Quran today?" }]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-serif font-bold">AI Companion</h2>
          <div className="group relative">
            <Info size={14} className="text-brand-sage cursor-help" />
            <div className="absolute left-0 top-full mt-2 w-48 p-2 bg-brand-deep text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Al-Qari AI uses Gemini 3.1 Pro to provide insights based on the Quran and Hadith.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-2 text-brand-sage hover:text-red-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
              useThinking 
                ? 'bg-brand-gold text-white shadow-md' 
                : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
            }`}
          >
            <Brain size={14} />
            {useThinking ? 'Deep Thinking' : 'Standard'}
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4 px-1"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] p-4 rounded-3xl shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-brand-deep text-white rounded-tr-none' 
                  : 'bg-white text-brand-deep border border-brand-gold/10 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-60">
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {msg.role === 'user' ? 'You' : 'Al-Qari AI'}
                  </span>
                  {msg.isThinking && <Sparkles size={10} className="text-brand-gold animate-pulse" />}
                </div>
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-brand-gold/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                  </div>
                  {useThinking && <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest animate-pulse">Thinking Deeply...</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length < 3 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4"
          >
            <div className="flex items-center gap-2 mb-3 text-brand-sage">
              <Lightbulb size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Try asking:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-xs px-4 py-2 bg-white border border-brand-gold/10 rounded-full text-brand-deep hover:bg-brand-gold hover:text-white transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4 relative">
        <input 
          type="text"
          placeholder="Ask Al-Qari AI..."
          className="w-full bg-white border border-brand-gold/20 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all shadow-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand-gold text-white flex items-center justify-center shadow-md disabled:opacity-50 transition-all active:scale-90 hover:bg-brand-deep"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
