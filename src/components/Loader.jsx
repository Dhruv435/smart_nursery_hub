import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Leaf, Sparkles, Sprout, Wind } from "lucide-react";

const Loader = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20); 

    const ctx = gsap.context(() => {
      gsap.to(".loading-line", {
        width: "100%",
        duration: 3,
        ease: "expo.inOut",
        onComplete: () => {
          setTimeout(onFinished, 600);
        },
      });

      gsap.to(".floating-icon", {
        y: -20,
        x: "random(-10, 10)",
        rotation: "random(-15, 15)",
        duration: "random(1.5, 2.5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });
    });

    return () => {
        clearInterval(timer);
        ctx.revert();
    };
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 1.2, ease: [0.85, 0, 0.15, 1] } 
      }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center text-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="floating-icon absolute top-[30%] left-[20%] text-emerald-500/20"><Leaf size={40} /></div>
        <div className="floating-icon absolute top-[60%] right-[25%] text-emerald-500/10"><Sprout size={50} /></div>
        <div className="floating-icon absolute bottom-[20%] left-[30%] text-emerald-500/20"><Sparkles size={30} /></div>
      </div>

      <div className="relative mb-12">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%", skewY: 7 }}
            animate={{ y: 0, skewY: 0 }}
            className="text-5xl md:text-8xl font-serif font-black tracking-tighter uppercase leading-none"
          >
            Nursery<span className="italic font-light text-emerald-500 opacity-80">Hub</span>
          </motion.h1>
        </div>
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.5 }} className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </div>

      <div className="w-72 md:w-[450px] relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
            <Wind size={12} className="text-emerald-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-stone-500 font-bold">Initializing Studio</span>
          </div>
          <span className="text-2xl font-serif italic text-emerald-500 tabular-nums">{progress}%</span>
        </div>
        <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
          <div className="loading-line h-full w-0 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-6 text-[10px] text-stone-600 uppercase tracking-[0.3em] font-medium">
          {progress < 40 && "Loading Botanical Archive..."}
          {progress >= 40 && progress < 80 && "Acclimatizing Environment..."}
          {progress >= 80 && "Preparing Digital Greenhouse..."}
        </motion.p>
      </div>

      <div className="absolute bottom-12 flex items-center gap-4">
        <div className="h-[1px] w-8 bg-stone-800" />
        <span className="text-[10px] text-stone-700 uppercase tracking-[0.4em] font-black">Protocol 001 // Sustainable Archive</span>
        <div className="h-[1px] w-8 bg-stone-800" />
      </div>
    </motion.div>
  );
};

export default Loader;