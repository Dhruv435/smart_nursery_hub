import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowLeft, Sprout, Loader2, Sparkles, ShieldCheck, ChevronRight, X, Mail, Phone } from "lucide-react";

const BuyerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validations
    if (!username || !password || !email || !mobile) {
      setError("All fields are required for archive access.");
      return;
    }

    // Gmail Validation
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Authorized access requires a @gmail.com address.");
      return;
    }

    // Mobile Validation (Exactly 10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      setError("Mobile protocol requires exactly 10 numeric digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://nursreyhubbackend.vercel.app/buyer/login", {
        username,
        password,
        email,
        mobile
      });

      localStorage.setItem("buyer", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to restrict mobile input to numbers and max 10 length
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setMobile(value);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf9f6] font-sans selection:bg-emerald-200 overflow-hidden">
      
      {/* ==================== LEFT: CINEMATIC VISUAL VAULT ==================== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "circOut" }}
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2670&auto=format&fit=crop" 
          alt="Greenhouse" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15)_0%,transparent_50%)]"></div>

        <div className="relative z-10 p-20 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-3">
               <Sprout size={24} />
            </div>
            <span className="font-serif text-3xl font-black tracking-tighter uppercase">Nursery<span className="italic text-emerald-500">Hub</span></span>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-emerald-400" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Exclusive Collector Portal</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8 tracking-tighter">
                Cultivate <br/> <span className="italic font-light opacity-60">Stillness.</span>
            </h1>
            <p className="text-stone-400 text-xl font-light leading-relaxed mb-10">
              Acquire rare specimens from globally recognized curators. Build your sanctuary with scientific precision and botanical beauty.
            </p>
            
            <div className="flex gap-10">
                <div className="flex flex-col">
                    <span className="text-2xl font-serif text-white">15k+</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Live Specimens</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-serif text-white">4.9/5</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Collector Rating</span>
                </div>
            </div>
          </motion.div>

          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600">
            Botanical Archive Protocol © 2026
          </div>
        </div>
      </div>

      {/* ==================== RIGHT: MINIMALIST FORM SIDE ==================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 bg-[#faf9f6] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md py-10"
        >
          <div className="flex justify-between items-center mb-10">
              <button 
                onClick={() => navigate("/")} 
                className="flex items-center text-stone-400 hover:text-stone-900 transition-all font-black uppercase tracking-widest text-[10px] group"
              >
                <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                Return to Gallery
              </button>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                <ShieldCheck size={12} /> Secure Protocol
              </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-5xl font-serif text-stone-900 mb-4 tracking-tight">Identity <span className="italic text-stone-400">Sync.</span></h2>
              <p className="text-stone-500 font-light text-lg leading-relaxed">Please authenticate to access your personal collection archive.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 shadow-sm"
                >
                  <X className="shrink-0 cursor-pointer" size={14} onClick={() => setError("")} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-8">
              {/* Alias Input */}
              <div className="group">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 block group-focus-within:text-emerald-600 transition-colors">Collector Alias</label>
                <div className="relative border-b border-stone-200 group-focus-within:border-emerald-500 transition-all pb-2">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-stone-800 font-serif text-2xl placeholder:text-stone-200" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 block group-focus-within:text-emerald-600 transition-colors">Registry Email</label>
                <div className="relative border-b border-stone-200 group-focus-within:border-emerald-500 transition-all pb-2">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-stone-800 font-serif text-2xl placeholder:text-stone-200" 
                    placeholder="name@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              {/* Mobile Input */}
              <div className="group">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 block group-focus-within:text-emerald-600 transition-colors">Mobile Index</label>
                <div className="relative border-b border-stone-200 group-focus-within:border-emerald-500 transition-all pb-2">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-stone-800 font-serif text-2xl placeholder:text-stone-200" 
                    placeholder="10 digit number" 
                    value={mobile}
                    onChange={handleMobileChange} 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 block group-focus-within:text-emerald-600 transition-colors">Access Key</label>
                <div className="relative border-b border-stone-200 group-focus-within:border-emerald-500 transition-all pb-2">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-stone-800 font-serif text-2xl placeholder:text-stone-200" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-stone-900 text-white font-black uppercase tracking-[0.3em] text-xs py-6 rounded-2xl shadow-2xl shadow-stone-300 transition-all disabled:opacity-50 flex justify-center items-center gap-3 hover:bg-emerald-800"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <>Authenticate collector <ChevronRight size={16}/></>}
              </motion.button>
            </form>

            <div className="text-center pt-8 border-t border-stone-100">
              <p className="text-stone-400 text-xs font-medium uppercase tracking-widest">
                New collector?{" "}
                <button onClick={() => navigate("/")} className="text-emerald-700 font-black hover:text-emerald-500 transition-colors ml-2">
                  Initialize Registration
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerLogin;