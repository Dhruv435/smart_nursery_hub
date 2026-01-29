import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Search, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "How often should I water my indoor plants?",
    answer: "Most indoor plants prefer the 'finger test'. Insert your finger 1 inch into the soil; if it's dry, it's time to water. Overwatering is more dangerous than underwatering!",
  },
  {
    question: "Do you ship across the country?",
    answer: "Yes, we ship to all major pincodes. Live plants are packed with special gel to stay hydrated for up to 7 days during transit.",
  },
  {
    question: "What if my plant arrives damaged?",
    answer: "We have a 48-hour guarantee. Send us a photo of the damaged plant within 48 hours of delivery, and we will send a free replacement.",
  },
  {
    question: "How do I use the fertilizer?",
    answer: "Dilute our organic fertilizer with water (1:10 ratio) and apply it to the soil every 2 weeks during the growing season (Spring/Summer).",
  },
];

const FAQComponent = ({ onClose, onContactSupport }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = FAQS.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-stone-50 font-sans">
      
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <HelpCircle size={20} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Help Center</h2>
        </div>
        <p className="text-sm text-stone-500 mb-6 pl-1">Find answers instantly or chat with our experts.</p>
        
        {/* Search Bar */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 placeholder-stone-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-emerald-600 transition-colors w-5 h-5" />
        </div>
      </div>

      {/* FAQ List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredFAQs.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-stone-400 text-sm">No results found for "{searchTerm}"</p>
            </div>
        ) : (
            filteredFAQs.map((faq, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    activeIndex === index 
                    ? "bg-white border-emerald-500 shadow-md shadow-emerald-900/5 ring-1 ring-emerald-500/20" 
                    : "bg-white border-stone-200 shadow-sm hover:border-emerald-200"
                }`}
            >
                <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left font-medium text-stone-700 hover:text-emerald-800 transition-colors"
                >
                <span className={`text-sm md:text-base ${activeIndex === index ? "font-bold text-emerald-900" : ""}`}>
                    {faq.question}
                </span>
                <div className={`p-1 rounded-full transition-colors ${activeIndex === index ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                        activeIndex === index ? "rotate-180" : ""
                        }`}
                    />
                </div>
                </button>
                <AnimatePresence>
                {activeIndex === index && (
                    <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                    >
                    <div className="p-5 pt-0 text-sm text-stone-500 leading-relaxed">
                        <div className="h-px w-full bg-stone-100 mb-4"></div>
                        {faq.answer}
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.div>
            ))
        )}
      </div>

      {/* Bottom Action */}
      <div className="p-6 bg-white border-t border-stone-100 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-20">
        <button
          onClick={onContactSupport}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-stone-900/10 hover:bg-emerald-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
          Start Live Chat
        </button>
      </div>
    </div>
  );
};

export default FAQComponent;