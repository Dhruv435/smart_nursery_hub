import React from 'react';
import { motion } from "framer-motion";
import { 
  Facebook, Instagram, Twitter, Mail, Phone, 
  MapPin, ArrowRight, Leaf, Sparkles, Youtube, ShieldCheck, Zap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Archive', path: '/about' },
    { name: 'Botanical Series', path: '/products' },
    { name: 'Seller Studio', path: '/seller/login' },
    { name: 'Help Center', path: '/support' }
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 overflow-hidden relative font-sans">
      {/* Top Border Gradient for visibility */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12">
        
        {/* ==================== 1. BRAND & NEWSLETTER SECTION ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Info */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate("/")}>
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-emerald-900/40">
                    <Leaf size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-black tracking-tighter uppercase leading-none text-white">NurseryHub</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-1 block">Botanical Studio</span>
                </div>
            </div>
            
            <p className="text-stone-400 text-lg leading-relaxed max-w-md font-light">
              Crafting living architecture for the modern dweller. We curate, acclimatize, and deliver the world's most resilient botanical specimens to your doorstep.
            </p>
            
            {/* Professional Social Grid */}
            <div className="flex gap-4 pt-4">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, index) => (
                <motion.a 
                  key={index} 
                  href="#" 
                  whileHover={{ y: -5, backgroundColor: "#10b981" }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-all duration-300"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Glassmorphic Newsletter Box */}
          <div className="lg:col-span-6">
            <div className="bg-[#111111] border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />
               
               <h4 className="text-2xl font-serif mb-4 flex items-center gap-3 text-white">
                 Join the Circle <Sparkles size={20} className="text-emerald-500" />
               </h4>
               <p className="text-stone-400 text-sm mb-8 font-light leading-relaxed">
                 Subscribe for early access to rare botanical drops and professional manuscripts on plant care.
               </p>
               
               <div className="relative">
                 <input 
                   type="email" 
                   placeholder="Your email address" 
                   className="w-full bg-white/5 border-b border-white/20 py-4 px-2 focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-stone-600"
                 />
                 <button className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 transition-all p-2">
                    <ArrowRight size={28} />
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. NAVIGATION & CONTACT SECTION ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-8">Studio Map</h4>
            <ul className="space-y-5">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => navigate(link.path)}
                    className="text-stone-300 hover:text-emerald-400 transition-all flex items-center gap-3 group text-sm font-bold uppercase tracking-widest"
                  >
                    <div className="w-0 h-[1px] bg-emerald-500 group-hover:w-6 transition-all duration-500" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Series Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-8">The Series</h4>
            <ul className="space-y-5">
              {['Indoor Lush', 'Air Purifiers', 'Pet Friendly', 'Architectural XL'].map((item) => (
                <li key={item} className="text-stone-400 hover:text-white cursor-pointer transition-colors text-sm font-medium flex items-center gap-2">
                   <div className="w-1 h-1 bg-stone-700 rounded-full" />
                   {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Locations */}
          <div className="lg:col-span-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-8">Studio Inquiries</h4>
            <div className="grid md:grid-cols-2 gap-10">
               <div className="space-y-3 group cursor-pointer">
                  <p className="text-white font-bold text-xs uppercase tracking-widest">Main Greenhouse</p>
                  <p className="text-stone-400 text-sm leading-relaxed group-hover:text-stone-200 transition-colors flex items-start gap-3">
                    <MapPin size={18} className="text-emerald-500 shrink-0" />
                    123 Botanical Garden Road,<br/>Green Valley, GJ 362001
                  </p>
               </div>
               <div className="space-y-4">
                  <a href="mailto:support@nurseryhub.com" className="flex items-center gap-3 text-stone-400 hover:text-emerald-400 transition-all text-sm font-medium">
                    <Mail size={18} className="text-emerald-500" /> support@nurseryhub.com
                  </a>
                  <a href="tel:+911234567890" className="flex items-center gap-3 text-stone-400 hover:text-emerald-400 transition-all text-sm font-medium">
                    <Phone size={18} className="text-emerald-500" /> +91 123 456 7890
                  </a>
               </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. COMPLIANCE & BOTTOM BAR ==================== */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-6">
            <p className="text-stone-600 text-[10px] font-black uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} NurseryHub Botanical Studio Inc.
            </p>
            <div className="hidden md:flex gap-4">
              <ShieldCheck size={18} className="text-stone-800" />
              <Zap size={18} className="text-stone-800" />
            </div>
          </div>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Network Live</span>
          </div>
        </div>
      </div>

      {/* Aesthetic Large Background Title */}
      <h2 className="absolute -bottom-12 -right-10 text-[18rem] font-serif font-black text-white/[0.03] pointer-events-none select-none uppercase tracking-tighter">
        Nursery
      </h2>
    </footer>
  );
};

export default Footer;