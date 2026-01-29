import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Leaf, Users, Globe, Shield, Sparkles, 
  ArrowRight, Eye, Target, Award, 
  TreePalm, Zap, ShieldCheck, ShoppingBag, Info, Quote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div ref={containerRef} className="bg-[#faf9f6] font-sans selection:bg-emerald-200 overflow-x-hidden">
      
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden bg-[#2d4531]">
        {/* Decorative background shapes for visibility */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-[1400px] mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Sparkles className="text-emerald-400" size={20} />
            <span className="uppercase tracking-[0.5em] text-[10px] font-black text-emerald-100/60">The Botanical Manuscript</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-9xl font-serif text-white leading-none mb-10 tracking-tighter"
          >
            Rooted in <br/> <span className="italic font-light opacity-50">Excellence.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-emerald-100/60 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
          >
            NurseryHub started as a single greenhouse in 2024. Today, we are a global archive connecting people with the primitive beauty of nature.
          </motion.p>
        </div>
      </section>

      {/* ==================== 2. KINETIC STATS GRID ==================== */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto -mt-16 md:-mt-24 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Leaf />, title: "150k+", desc: "Plants Delivered", color: "bg-white text-emerald-900" },
            { icon: <Users />, title: "20k+", desc: "Expert Sellers", color: "bg-stone-900 text-white" },
            { icon: <Globe />, title: "28+", desc: "States Reached", color: "bg-emerald-100 text-emerald-900" },
            { icon: <Shield />, title: "100%", desc: "Health Protocol", color: "bg-white text-stone-900" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${item.color} p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl shadow-stone-200/50 border border-stone-100`}
            >
              <div className="mb-6 text-emerald-600 opacity-60">{item.icon}</div>
              <h3 className="text-4xl font-serif font-bold mb-2 tracking-tighter">{item.title}</h3>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-50">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== 3. PHILOSOPHY: THE BENTO VISION ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <motion.div 
            {...fadeInUp}
            className="md:col-span-7 bg-white rounded-[3rem] p-10 md:p-20 relative overflow-hidden group shadow-xl shadow-stone-200/20"
          >
            <div className="absolute -top-10 -right-10 text-emerald-500/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
               <TreePalm size={400} />
            </div>
            <div className="relative z-10">
              <span className="text-emerald-600 font-black tracking-widest text-[10px] uppercase mb-4 block">Our Purpose</span>
              <h2 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight mb-8">Architectural <br/> Harmony.</h2>
              <p className="text-stone-500 text-xl leading-relaxed max-w-lg font-light">
                We believe that plants are not mere decor; they are the living lungs of a space. Our process focuses on architectural durability—selecting species that redefine modern dwellings.
              </p>
            </div>
          </motion.div>

          <div className="md:col-span-5 flex flex-col gap-8">
            <motion.div {...fadeInUp} className="flex-1 bg-stone-900 rounded-[3rem] p-10 text-white">
              <Eye className="text-emerald-400 mb-6" size={32} />
              <h4 className="text-2xl font-serif mb-3">Vision</h4>
              <p className="text-stone-400 text-sm leading-relaxed">To become the world's most trusted digital greenhouse, where quality is verified by botanists.</p>
            </motion.div>
            <motion.div {...fadeInUp} className="flex-1 bg-emerald-100 rounded-[3rem] p-10 text-emerald-900">
              <Target className="text-emerald-600 mb-6" size={32} />
              <h4 className="text-2xl font-serif mb-3">Mission</h4>
              <p className="text-emerald-700/60 text-sm leading-relaxed">Eliminating the stress of plant care by delivering acclimatized specimens with a 30-day health guarantee.</p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==================== 4. INTERACTIVE HUB NAVIGATOR ==================== */}
      <section className="py-24 px-6 bg-stone-100">
        <div className="max-w-[1400px] mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight">Explore the <span className="italic">Hub</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { name: "The Archive", icon: <ShoppingBag />, path: "/products", desc: "Browse 200+ botanical series" },
            { name: "Help Desk", icon: <Info />, path: "/support", desc: "24/7 Expert Botanist Support" },
            { name: "The Studio", icon: <Users />, path: "/", desc: "Return to the main dashboard" }
          ].map((nav, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              onClick={() => navigate(nav.path)}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-stone-200/40 cursor-pointer group border border-white"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                {nav.icon}
              </div>
              <h3 className="text-2xl font-serif mb-2 text-stone-900">{nav.name}</h3>
              <p className="text-stone-400 text-sm mb-6 font-light">{nav.desc}</p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                Enter Room <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== 5. BOTANICAL PROTOCOL ==================== */}
      <section className="py-24 px-6 bg-[#2d4531] text-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="max-w-2xl text-center md:text-left">
             <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <ShieldCheck className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Biological Standards</span>
             </div>
             <h2 className="text-5xl md:text-8xl font-serif leading-[0.9] mb-10">The Acclimatization <br/> <span className="italic opacity-50">Protocol.</span></h2>
             <p className="text-emerald-100/70 text-xl font-light leading-relaxed mb-10">
               Every plant from our nursery stays in a dedicated "Shadow Zone" for 7 days before shipping to ensure it survives indoor lighting.
             </p>
             <button onClick={() => navigate("/products")} className="bg-white text-[#2d4531] px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl">Browse Species</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                <Zap className="text-emerald-400 mb-4" />
                <p className="text-2xl font-serif">Fast</p>
                <p className="text-[10px] uppercase text-emerald-100/40 font-bold">Transit</p>
             </div>
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                <Award className="text-emerald-400 mb-4" />
                <p className="text-2xl font-serif">A Grade</p>
                <p className="text-[10px] uppercase text-emerald-100/40 font-bold">Verified</p>
             </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. FOUNDER QUOTE ==================== */}
      <section className="py-40 px-6 text-center bg-white">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="max-w-4xl mx-auto"
         >
            <Quote className="mx-auto text-emerald-100 w-20 h-20 mb-10" />
            <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight italic mb-10">
              "We don't just sell plants; we curate the <span className="text-emerald-700 not-italic font-bold">living history</span> of your home."
            </h2>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-emerald-50 rounded-full mb-4 border border-emerald-100 flex items-center justify-center text-emerald-700 font-serif text-xl font-bold">
                  DK
               </div>
               <p className="font-bold uppercase tracking-widest text-xs text-stone-900">Dhruv Kotadiya</p>
               <p className="text-[10px] font-black uppercase tracking-tighter text-stone-400">Chief Curator & Founder</p>
            </div>
         </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;