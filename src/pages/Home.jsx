import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Star, Truck, Leaf, ArrowUp, 
  MessageSquare, Sun, Droplets, Quote, 
  ArrowUpRight, Mail, Sparkles, Zap, ShieldCheck, X, Clock, BookOpen, Info, Eye, TreePalm, Flower2
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

// ================= IMAGES IMPORT =================
import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpeg";
import img5 from "../assets/5.jpg";
import img6 from "../assets/6.jpeg";
import img7 from "../assets/7.jpeg";
import img8 from "../assets/8.jpg";
import img9 from "../assets/9.jpg";
import img10 from "../assets/10.webp";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null); 
  const navigate = useNavigate();
  
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const horizontalRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5050/all-products");
        setProducts(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: "linear"
    });

    const sections = gsap.utils.toArray(".trending-card");
    if (sections.length > 0) {
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalRef.current,
              pin: true,
              scrub: 1,
              snap: 1 / (sections.length - 1),
              end: () => "+=" + horizontalRef.current.offsetWidth
            }
          });
    }
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [products]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedStory) {
        setCurrentHero((prev) => (prev + 1) % HERO_CONTENT.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedStory]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hero = HERO_CONTENT[currentHero];

  return (
    <div ref={containerRef} className="bg-[#faf9f6] text-stone-900 selection:bg-emerald-200">
      <Header />

      {/* ==================== 1. KINETIC HERO SECTION ==================== */}
      <section className="relative h-[100svh] flex flex-col md:flex-row overflow-hidden">
        <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-24 transition-colors duration-1000 ${hero.color}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white z-20"
            >
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="w-8 md:w-12 h-[1px] bg-white/40"></span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">NurseryHub Premium</span>
              </div>
              <h1 className="text-5xl md:text-[9rem] font-serif leading-[0.85] mb-6 md:mb-8 tracking-tighter">
                {hero.title.split(" ")[0]} <br/>
                <span className="italic font-light opacity-60">{hero.title.split(" ")[1]}</span>
              </h1>
              <p className="text-base md:text-xl text-white/70 max-w-md mb-8 md:mb-12 leading-relaxed font-light">{hero.subtitle}</p>
              <div className="flex items-center gap-4 md:gap-8">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/products")} className="px-8 md:px-10 py-4 md:py-5 bg-white text-stone-900 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-2xl transition-all">Shop Now</motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-10 md:bottom-12 flex gap-3 md:gap-4">
            {HERO_CONTENT.map((_, i) => (
              <button key={i} onClick={() => setCurrentHero(i)} className={`h-1 transition-all duration-500 rounded-full ${currentHero === i ? "w-12 md:w-16 bg-white" : "w-3 md:w-4 bg-white/20"}`} />
            ))}
          </div>
        </div>
        <div className="hidden md:block w-1/2 h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img key={hero.id} initial={{ scale: 1.3, filter: "blur(10px)" }} animate={{ scale: 1, filter: "blur(0px)" }} exit={{ scale: 1.1, opacity: 0 }} transition={{ duration: 1.2 }} src={hero.image} className="w-full h-full object-cover" />
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== 2. LUXURY MARQUEE ==================== */}
      <div className="bg-stone-950 py-6 md:py-8 border-y border-stone-800 overflow-hidden">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-10 md:gap-16">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-8 text-white/40 font-serif italic text-lg md:text-2xl uppercase tracking-widest">
              <span>Rare Botanical Drops</span> <Sparkles className="text-emerald-500" size={18} /> <span>Carbon Neutral Shipping</span> <Leaf className="text-emerald-500" size={18}/>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 3. CURATED CATEGORIES (HOVER ONLY) ==================== */}
      <section className="py-20 md:py-32 px-6 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-7xl font-serif text-stone-900 leading-none">Curated <br/> <span className="text-emerald-700 italic">Series</span></h2>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] hidden md:block">Hover to explore details</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              key={cat.id} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }} 
              className={`relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] group select-none ${i === 0 || i === 3 ? "md:col-span-2 h-[400px] md:h-[500px]" : "h-[400px] md:h-[500px]"}`}
            >
              {/* Background Image */}
              <img src={cat.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.name} />
              
              {/* Default Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
              
              {/* Default Text (Visible when NOT hovering) */}
              <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 text-white transition-all duration-500 group-hover:translate-y-10 group-hover:opacity-0">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2 block">{cat.count}</span>
                <h3 className="text-3xl md:text-4xl font-serif">{cat.name}</h3>
              </div>

              {/* Hover Content Block (Glassmorphism) */}
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-full group-hover:translate-y-0">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 border border-white/10">
                    <Sparkles size={24} />
                </div>
                <h3 className="text-white text-3xl font-serif mb-4">{cat.name}</h3>
                <p className="text-emerald-100/70 leading-relaxed font-light text-sm mb-6 max-w-xs">{cat.detailText}</p>
                <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px]">
                    <div className="w-8 h-[1px] bg-emerald-500" />
                    <span>Exclusive Series</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== 4. HORIZONTAL TRENDING ==================== */}
      <section ref={horizontalRef} className="relative h-screen bg-stone-900 flex items-center overflow-hidden">
        <div className="px-8 md:px-24 flex gap-8 md:gap-12 items-center">
          <div className="min-w-[300px] md:min-w-[450px] text-white flex flex-col">
            <h2 className="text-5xl md:text-7xl font-serif mb-6 italic leading-tight">Trending <br className="hidden md:block"/> Now.</h2>
            <p className="text-stone-400 text-sm md:text-base mb-10">Move through our most desired botanical selections of the season.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/products")} className="w-fit flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full transition-all shadow-xl shadow-emerald-900/20">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">View All Collection</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><ArrowRight size={16} /></div>
            </motion.button>
          </div>
          {products.slice(0, 5).map((product) => (
            <div key={product._id} className="trending-card min-w-[280px] md:min-w-[350px]"><ProductCard product={product} /></div>
          ))}
        </div>
      </section>

      {/* ==================== 5. HOVER DETAILS SPOTLIGHT ==================== */}
      <section className="py-24 md:py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight mb-16">Interactive <br/> <span className="italic text-emerald-800">Spotlight</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPOTLIGHT_DATA.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="group relative h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden bg-stone-100">
                <img src={item.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-[2px]" alt="spotlight" />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-500 flex items-center justify-center p-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileHover={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] w-full transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">{item.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Pro Tip</span>
                    </div>
                    <h4 className="text-2xl font-serif text-stone-900 mb-3">{item.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                    <div onClick={() => navigate("/products")} className="pt-6 border-t border-stone-100 flex items-center gap-3 text-emerald-600 font-bold text-xs uppercase tracking-widest cursor-pointer hover:gap-4 transition-all"><Eye size={16} /> View Collection</div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. FEATURES BENTO ==================== */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#2d4531] rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group">
            <Leaf className="absolute -top-10 -right-10 w-48 md:w-64 h-48 md:h-64 text-white/5 rotate-12" />
            <h2 className="text-4xl md:text-5xl font-serif mb-8 max-w-md leading-tight">Our Health <br/> Guarantee.</h2>
            <p className="text-emerald-100/60 text-base md:text-lg mb-10 max-w-sm">Every plant is checked by 3 botanists before shipping. Freshness is not a goal; it's our standard.</p>
          </div>
          <div className="bg-[#e8e6e1] rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-12 flex flex-col justify-between group cursor-pointer">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-stone-900 rounded-2xl flex items-center justify-center text-white mb-8 transition-transform group-hover:rotate-12"><Truck size={24} /></div>
            <h3 className="text-2xl md:text-3xl font-serif">Express <br/> Transit</h3>
          </div>
        </div>
      </section>

      {/* ==================== 7. JOURNAL / STORIES ==================== */}
      <section className="py-24 md:py-32 bg-stone-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-xs font-black uppercase tracking-[0.6em] text-emerald-700 mb-4 block">The Green Journal</span>
            <h2 className="text-4xl md:text-7xl font-serif text-stone-900 leading-none">Botanical Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {JOURNAL.map((post) => (
              <motion.div key={post.id} whileHover={{ y: -10 }} className="group cursor-pointer" onClick={() => setSelectedStory(post)}>
                <div className="relative h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden mb-6 md:mb-8 shadow-xl">
                  <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="post" />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{post.date}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-emerald-700 transition-colors leading-tight">{post.title}</h3>
                <button className="flex items-center gap-2 text-stone-400 font-bold uppercase tracking-widest text-[10px]">Read Story <BookOpen size={14} /></button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STORY MODAL ==================== */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-stone-950/40 backdrop-blur-xl flex justify-center items-end md:items-center p-0 md:p-10">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 200 }} className="bg-[#faf9f6] w-full max-w-6xl h-[95vh] md:h-[90vh] rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20">
              <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
                 <img src={selectedStory.image} className="w-full h-full object-cover" alt="story" />
                 <button onClick={() => setSelectedStory(null)} className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full md:hidden"><X size={20} /></button>
              </div>
              <div className="w-full md:w-1/2 h-full p-8 md:p-16 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-10">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{selectedStory.date}</span>
                   <button onClick={() => setSelectedStory(null)} className="hidden md:flex p-3 bg-stone-100 rounded-full text-stone-400 hover:text-red-500 transition-all"><X size={24} /></button>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-[0.9] mb-10">{selectedStory.title}</h2>
                <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                   {selectedStory.content.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-32 md:py-40 px-6 bg-emerald-950 text-white text-center relative overflow-hidden">
        <motion.div style={{ opacity: scaleProgress }} className="max-w-4xl mx-auto z-10 relative">
          <Mail className="mx-auto mb-8 w-12 h-12 opacity-20" />
          <h2 className="text-5xl md:text-8xl font-serif mb-10 leading-none">Join the <span className="italic">Nursery</span> Circle.</h2>
          <div className="relative max-w-md mx-auto group">
            <input type="email" placeholder="Email address" className="w-full bg-white/5 border-b border-white/20 px-2 py-5 text-lg font-light focus:outline-none focus:border-emerald-500 transition-all" />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-emerald-400"><ArrowRight size={28} /></button>
          </div>
        </motion.div>
      </section>

      {/* FLOATING ACTIONS */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-14 h-14 bg-white text-stone-900 rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-950 hover:text-white transition-all border border-stone-100"
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/chat")}
          className="w-14 h-14 bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-800 transition-all"
        >
          <MessageSquare size={20} />
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

// ================= CONSTANTS =================

const SPOTLIGHT_DATA = [
  { title: "Air Purifying Giants", desc: "Large-leaf species filter toxins within 24 hours.", image: img4, icon: <Sun size={24}/> },
  { title: "Pet-Safe Selection", desc: "Calatheas and Palms that are 100% non-toxic.", image: img6, icon: <ShieldCheck size={24}/> },
  { title: "Hydroponic Roots", desc: "Soil-less growth is the future.", image: img7, icon: <Droplets size={24}/> },
];

const HERO_CONTENT = [
  { id: 1, title: "Botanical Sanctuary", subtitle: "Curating the finest indoor foliage for the modern dwelling.", image: img1, color: "bg-[#2d4531]" },
  { id: 2, title: "Organic Harvest", subtitle: "From seed to table. Cultivate your own nutrition.", image: img2, color: "bg-[#8c5038]" },
  { id: 3, title: "Desert Aesthetics", subtitle: "Sculptural succulents for the minimalist soul.", image: img3, color: "bg-[#4a5d61]" }
];

const CATEGORIES = [
  { id: 1, name: "Indoor Lush", image: img4, count: "42 Plants", detailText: "Our Indoor Lush collection features high-volume foliage perfect for filling corner voids and creating living walls in minimal spaces." },
  { id: 2, name: "Air Purifiers", image: img5, count: "18 Plants", detailText: "Scientifically selected species designed to maximize oxygen production and biological chemical filtration in the modern home." },
  { id: 3, name: "Pet Friendly", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2574", count: "25 Plants", detailText: "A safe haven for your furry friends. Every plant in this series is non-toxic to cats and dogs according to biological standards." },
  { id: 4, name: "Ceramic Pots", image: img7, count: "50+ Items", detailText: "Hand-crafted vessels designed with proper drainage and thermal insulation for sensitive root systems and architectural appeal." },
];

const JOURNAL = [
  { id: 1, title: "5 Plants for Low Light Corners", date: "Oct 12, 2024", image: img8, content: ["Snake Plants and ZZ Plants thrive in deep shade.", "In this guide, we dive deep into managing moisture."] },
  { id: 2, title: "The Art of Repotting", date: "Sep 28, 2024", image: img9, content: ["Repotting is a ritual of growth.", "We recommend repotting during the spring equinox."] },
  { id: 3, title: "Winter Care Guide", date: "Nov 01, 2024", image: img10, content: ["Avoid overwatering in dormant months.", "Humidity drops are the silent killer."] },
];

export default Home;