import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, FileText, Phone, Mail, 
  ChevronDown, Search, Sparkles, 
  Clock, ShieldCheck, Zap, ArrowRight, LifeBuoy, X, Ghost,
  BrainCircuit, Loader2
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Footer from '../components/Footer';

// ================= IMAGES IMPORT =================
import img9 from "../assets/9.jpg";
import img10 from "../assets/10.webp";

const SLIDE_IMAGES = [img9, img10];

// API Configuration
const genAI = new GoogleGenerativeAI("AIzaSyCwl8CLFdkSNMOJFlBvYbrqqD4R4359-dE");

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // AI States
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. Background Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 2. Gemini AI Suggestion Logic (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 3) {
        generateAiSuggestion(searchTerm);
      } else {
        setAiResponse("");
      }
    }, 1200); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const generateAiSuggestion = async (query) => {
    setIsAiLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are a luxury botanical expert for NurseryHub. 
      A user is searching for: "${query}". 
      Provide one paragraph of premium, helpful, and scientific advice (max 60 words). 
      Focus on plant health, styling, or maintenance. Tone: Professional and Zen.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(response.text());
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("Our digital botanist is currently pruning. Please check our FAQs below.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const contactCards = [
    { icon: <MessageCircle />, title: "Live Studio Chat", desc: "Speak with our curators in real-time.", link: "Start Chat", color: "bg-emerald-50" },
    { icon: <FileText />, title: "Track Shipment", desc: "Follow your specimen's journey.", link: "Track Now", color: "bg-blue-50" },
    { icon: <Phone />, title: "Direct Helpline", desc: "Speak with us: +91 800 555 0123", link: "Call Now", color: "bg-orange-50" },
    { icon: <Mail />, title: "Email Inquiry", desc: "Response within 12 business hours.", link: "Write to us", color: "bg-purple-50" }
  ];

  const faqData = [
    { q: "How do you ensure safe biological transit?", a: "We use double-walled ventilated boxes and organic cushioning to ensure zero leaf-drop during the journey.", tags: "shipping, delivery, safe" },
    { q: "What is the 30-Day Bloom Guarantee?", a: "If your plant fails to thrive within 30 days despite following our care guide, we provide a full replacement.", tags: "warranty, guarantee, health" },
    { q: "Are your pots eco-friendly?", a: "Our signature series uses recycled clay and biodegradable fiber materials to minimize carbon footprints.", tags: "pots, eco, sustainable" }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans selection:bg-emerald-200 overflow-x-hidden">
      
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <AnimatePresence mode="wait">
            <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
            >
                <img src={SLIDE_IMAGES[currentSlide]} className="w-full h-full object-cover" alt="Support Context" />
            </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-[#faf9f6]" />

        <div className="relative z-10 text-center px-6 w-full max-w-4xl">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-center gap-3 mb-6">
            <LifeBuoy className="text-emerald-400" size={20} />
            <span className="uppercase tracking-[0.5em] text-[10px] font-black text-white/80">Support Interface</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif text-white leading-none mb-12 tracking-tighter"
          >
            Digital <span className="italic font-light opacity-50 text-emerald-500">Curator.</span>
          </motion.h1>

          <div className="relative max-w-2xl mx-auto group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-500 transition-colors" size={22} />
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search the archive or ask AI..." 
               className="w-full pl-16 pr-14 py-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:bg-white/20 transition-all font-light text-xl placeholder:text-stone-500"
             />
             {searchTerm && (
                 <button onClick={() => setSearchTerm("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                     <X size={24} />
                 </button>
             )}
          </div>
        </div>
      </section>

      {/* ==================== 2. AI BOTANIST CONTAINER ==================== */}
      <AnimatePresence>
        {searchTerm.length > 3 && (
          <section className="max-w-4xl mx-auto px-6 -mt-12 relative z-30">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-stone-900 text-white p-10 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 opacity-5 text-emerald-500">
                <BrainCircuit size={250} />
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-emerald-400" size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">AI Intelligence / Curator Mode</span>
              </div>
              
              {isAiLoading ? (
                <div className="flex items-center gap-4 py-6">
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                  <p className="text-stone-400 italic font-serif text-xl">Our botanist is analyzing your query...</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-2xl md:text-3xl font-serif leading-tight italic text-stone-200">
                    "{aiResponse || `Begin typing to receive custom architectural advice for '${searchTerm}'...`}"
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        <div className="w-8 h-[1px] bg-stone-700" />
                        Verified Response
                    </div>
                </motion.div>
              )}
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* ==================== 3. CONTACT GRID ==================== */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {contactCards.map((card, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 group transition-all"
            >
              <div className={`w-14 h-14 ${card.color} text-emerald-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-stone-900">{card.title}</h3>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed font-light">{card.desc}</p>
              <button className="text-emerald-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-4 transition-all">
                {card.link} <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ==================== 4. ARCHIVE RESULTS ==================== */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 border-b border-stone-100 pb-8 flex justify-between items-end">
            <h2 className="text-4xl font-serif text-stone-900 tracking-tight">FAQ <span className="italic text-stone-300">Archive</span></h2>
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">{filteredFaqs.length} results found</span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <motion.div 
                    key={i} 
                    layout
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="mb-4 bg-white rounded-3xl border border-stone-50 overflow-hidden"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-8 text-left flex justify-between items-center group"
                  >
                    <span className="font-serif text-xl group-hover:text-emerald-700 transition-colors">{faq.q}</span>
                    <div className={`p-2 rounded-full transition-all ${activeFaq === i ? 'bg-emerald-600 text-white rotate-180' : 'bg-stone-50 text-stone-400'}`}>
                        <ChevronDown size={20} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-stone-50/50">
                        <p className="p-8 pt-0 text-stone-500 font-light text-lg leading-relaxed border-l-4 border-emerald-500 ml-8">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center">
                <Ghost className="mx-auto text-stone-200 mb-6" size={64} />
                <p className="text-stone-400 italic text-xl font-serif">No manuscripts match your search. Ask our AI botanist above.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Support;