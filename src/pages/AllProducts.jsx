import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, X, Sparkles, ArrowRight, Leaf, ShieldCheck, Zap, Hash, Quote, Star, Gift } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

// ================= IMAGES FOR SLIDER =================
import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";

const SLIDE_IMAGES = [img1, img2, img3];

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const categories = ["All", "Indoor", "Outdoor", "Succulent", "Flowering", "Seeds"];

  // 1. Image Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://nursreyhubbackend.vercel.app/all-products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans selection:bg-emerald-200 overflow-x-hidden">
      <Header />
      
      {/* ==================== 1. PROFESSIONAL SMOOTH SLIDER HERO ==================== */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden bg-stone-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img src={SLIDE_IMAGES[currentSlide]} className="w-full h-full object-cover" alt="Hero" />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-transparent to-[#faf9f6]" />

        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-emerald-400" size={16} />
            <span className="uppercase tracking-[0.6em] text-[10px] font-black text-white/90">Curated Botanical Archive</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-7xl md:text-[10rem] font-serif text-white leading-none mb-8 tracking-tighter"
          >
            Flora <span className="italic font-light opacity-50 text-6xl md:text-9xl">Series</span>
          </motion.h1>
          
          <motion.button 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
             onClick={() => navigate("/")} 
             className="group flex items-center gap-6 text-white border border-white/30 px-10 py-4 rounded-full backdrop-blur-md hover:bg-white hover:text-stone-900 transition-all duration-500"
          >
            <span className="text-xs font-black uppercase tracking-widest">Explore New Series</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
          </motion.button>
        </div>

        <div className="absolute bottom-20 flex gap-2">
            {SLIDE_IMAGES.map((_, i) => (
                <div key={i} className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? "w-8 bg-emerald-500" : "w-2 bg-white/20"}`} />
            ))}
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 relative z-20">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* ==================== 2. EDITORIAL SIDEBAR ==================== */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-12">
              
              {/* Search Group */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6 flex items-center gap-2">
                  <Search size={12} /> Search Archive
                </h3>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Enter keywords..." 
                    className="w-full bg-transparent border-b border-stone-200 py-3 focus:outline-none focus:border-emerald-600 transition-colors font-serif text-lg placeholder:text-stone-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && <X size={16} className="absolute right-0 top-4 text-stone-400 cursor-pointer" onClick={() => setSearchTerm("")} />}
                </div>
              </div>

              {/* Category Group */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6 flex items-center gap-2">
                  <Hash size={12} /> Filter Category
                </h3>
                <div className="flex flex-col gap-4">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-left text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-between group ${
                        categoryFilter === cat ? "text-emerald-700" : "text-stone-400 hover:text-stone-900"
                      }`}
                    >
                      {cat}
                      <div className={`h-[1px] bg-emerald-600 transition-all duration-500 ${categoryFilter === cat ? "w-8" : "w-0 group-hover:w-4"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* NEW: ARCHITECTURAL CONTENT BLOCK */}
              <div className="pt-8 border-t border-stone-100">
                <Quote className="text-emerald-200 mb-4" size={32} />
                <p className="text-xl font-serif text-stone-800 leading-tight mb-4">
                   “In every walk with nature, one receives <span className="italic text-emerald-700">far more</span> than he seeks.”
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">— John Muir</p>
              </div>

              {/* NEW: GLASSMORPHIC OFFER AD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/40 transition-all duration-700" />
                <Gift className="text-emerald-400 mb-6" size={28} />
                <h4 className="text-2xl font-serif mb-4 leading-none">Green <br/> Welcome.</h4>
                <p className="text-stone-400 text-xs leading-relaxed mb-6 font-light">Get a complimentary ceramic mister with your first order above ₹2,000.</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 hover:gap-4 transition-all">
                  Claim Offer <ArrowRight size={14} />
                </button>
              </motion.div>

              {/* NEW: TRUST LIST */}
              <div className="space-y-6 pt-4">
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                       <Zap size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">Instant Care</p>
                       <p className="text-[9px] text-stone-400 font-bold">24/7 Botanist Support</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                       <Star size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">Top Tier</p>
                       <p className="text-[9px] text-stone-400 font-bold">A+ Grade Acclimatization</p>
                    </div>
                 </div>
              </div>

            </div>
          </aside>

          {/* ==================== 3. KINETIC PRODUCT GRID ==================== */}
          <div className="flex-1">
            <div className="mb-12 flex justify-between items-baseline border-b border-stone-100 pb-8">
              <h2 className="text-4xl font-serif text-stone-900">
                {categoryFilter} <span className="text-stone-300 italic">Collection</span>
              </h2>
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Showing {filteredProducts.length} Results
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-6">
                    <div className="aspect-[4/5] bg-stone-100 rounded-[2.5rem] animate-pulse" />
                    <div className="h-6 bg-stone-100 w-2/3 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div 
                      key={product._id} 
                      layout 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="py-40 text-center">
                <Leaf className="mx-auto mb-6 text-stone-200" size={48} />
                <h3 className="text-2xl font-serif text-stone-400">No specimens match your search.</h3>
              </div>
            )}
          </div>

        </div>

        {/* ==================== 4. BOTTOM TRUST BANNER ==================== */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 p-16 bg-stone-900 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2)_0%,transparent_70%)]" />
          </div>
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
             <ShieldCheck className="text-emerald-400 mb-6 mx-auto md:mx-0" size={32} />
             <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-4">Certified Health <br/> <span className="italic opacity-50">Botanical Guarantee</span></h2>
             <p className="text-stone-400 text-sm font-light">Every plant from our archive undergoes a 7-day acclimatization period before being cleared for transit.</p>
          </div>
          
          <div className="relative z-10 mt-10 md:mt-0 flex flex-col sm:flex-row gap-4">
             <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-3xl backdrop-blur-md">
                <span className="text-3xl font-serif text-emerald-400 block mb-1">100%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Recyclable Boxes</span>
             </div>
             <button className="bg-emerald-600 hover:bg-emerald-500 px-10 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all">Shipping Ethics</button>
          </div>
        </motion.div>

      </main>


      <Footer />
    </div>
  );
};

export default AllProducts;