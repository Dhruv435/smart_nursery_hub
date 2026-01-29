import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FAQComponent from "./FAQComponent"; 
import SupportChatBot from "./SupportChatBot"; 
import { HelpCircle, X, Sparkles, MessageCircle, Info } from "lucide-react";

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 40, 
    filter: "blur(10px)",
    transformOrigin: "bottom right" 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 25 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 40, 
    filter: "blur(10px)",
    transition: { duration: 0.3, ease: "circIn" } 
  }
};

export default function SupportModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("FAQ"); 

  const closeModal = () => {
    setIsModalOpen(false);
    // Slight delay before reset to keep exit animation clean
    setTimeout(() => setView("FAQ"), 400); 
  };

  return (
    <>
      {/* ==================== 1. TRIGGER BUTTON ==================== */}
      <motion.button
        className="fixed bottom-10 right-10 z-[60] w-16 h-16 rounded-3xl bg-emerald-900 text-white shadow-[0_20px_50px_rgba(6,78,59,0.3)] hover:shadow-emerald-900/50 flex items-center justify-center border border-white/20 transition-all group overflow-hidden"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ rotate: 5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
            scale: isModalOpen ? 0.5 : 1, 
            opacity: isModalOpen ? 0 : 1,
            rotate: isModalOpen ? 90 : 0
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <HelpCircle className="w-8 h-8 relative z-10" />
      </motion.button>

      {/* ==================== 2. MODAL INTERFACE ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end sm:justify-center pointer-events-none">
            {/* Architectural Backdrop */}
            <motion.div 
                className="absolute inset-0 bg-stone-950/40 backdrop-blur-md pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
            />

            {/* Container Portal */}
            <motion.div
              className="bg-white/90 backdrop-blur-2xl pointer-events-auto w-full sm:w-[450px] h-[90vh] sm:h-[700px] sm:mr-10 sm:mb-10 rounded-t-[3.5rem] sm:rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-white relative flex flex-col overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header Branding & Nav */}
              <div className="px-8 pt-10 pb-6 border-b border-stone-100/50">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="text-emerald-600" size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Concierge Desk</span>
                        </div>
                        <h2 className="text-3xl font-serif text-stone-900">Digital <span className="italic font-light">Curator.</span></h2>
                    </div>
                    <button
                        className="p-3 rounded-full bg-stone-100 text-stone-400 hover:text-red-500 hover:bg-stone-200 transition-all shadow-sm"
                        onClick={closeModal}
                    >
                        <X className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Editorial Toggle Switch */}
                 <div className="flex bg-stone-100 p-1.5 rounded-2xl relative">
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-stone-200/50"
                        animate={{ x: view === "FAQ" ? "0%" : "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button 
                        onClick={() => setView("FAQ")}
                        className={`flex-1 relative z-10 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${view === "FAQ" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
                    >
                        Knowledge Base
                    </button>
                    <button 
                        onClick={() => setView("CHAT")}
                        className={`flex-1 relative z-10 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${view === "CHAT" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
                    >
                        Live Terminal
                    </button>
                 </div>
              </div>

              {/* Dynamic Content Frame */}
              <div className="flex-1 relative overflow-hidden bg-white/50">
                  <AnimatePresence mode="wait">
                    {view === 'FAQ' ? (
                        <motion.div
                            key="faq"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="h-full"
                        >
                            <FAQComponent 
                                onClose={closeModal} 
                                onContactSupport={() => setView("CHAT")}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="h-full"
                        >
                            <SupportChatBot 
                                onBackToFAQ={() => setView("FAQ")}
                            />
                        </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              {/* Status Footer */}
              <div className="px-8 py-5 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Botanists Online</span>
                  </div>
                  <Info size={14} className="text-stone-300" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}