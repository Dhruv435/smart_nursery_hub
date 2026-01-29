import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gavel, ArrowLeft, TrendingUp, AlertCircle, 
  CheckCircle2, Sparkles, ShieldCheck, Zap, 
  ChevronRight, Info
} from "lucide-react";
import Header from "../../components/Header"; 
import Footer from "../../components/Footer";

const BidPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(location.state?.product);
  const [loadingProduct, setLoadingProduct] = useState(!product);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (!product && productId) {
      fetchProduct();
    } else if (!product && !productId) {
      navigate("/");
    }
  }, [product, productId, navigate]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/product/${productId}`);
      setProduct(res.data);
      setLoadingProduct(false);
    } catch (err) {
      navigate("/");
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    const buyer = JSON.parse(localStorage.getItem("buyer"));
    const seller = JSON.parse(localStorage.getItem("seller"));
    const currentUser = buyer || seller;

    if (!currentUser) {
      if(window.confirm("You must be logged in to place a bid. Go to Login?")) {
          navigate("/buyer/login");
      }
      return;
    }

    if (!product.sellerId) {
        alert("Error: Missing seller information.");
        return;
    }

    if (parseFloat(bidAmount) < product.price) {
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://nursery-backend-ashy.vercel.app/place-bid", {
        productId: product._id,
        productName: product.name,
        productImage: product.images && product.images.length > 0 ? product.images[0] : "",
        sellerId: product.sellerId,
        buyerId: currentUser._id,
        buyerName: currentUser.name,
        buyerMobile: currentUser.mobile,
        bidAmount: parseFloat(bidAmount),
        message: message || "No message added"
      });
      alert("✅ Bid Placed Successfully!");
      navigate("/history");
    } catch (err) {
      alert("Failed to place bid.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center gap-4">
        <Zap className="text-emerald-500 animate-pulse" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Archiving Details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans selection:bg-emerald-200 overflow-x-hidden">
      <Header />
      
      {/* Background Architectural Blurs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-stone-100 rounded-full blur-[100px] -z-10 opacity-50"></div>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 flex justify-center items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3.5rem] shadow-2xl shadow-stone-200/60 overflow-hidden border border-white relative"
        >
          
          {/* ==================== LEFT: VISUAL VAULT ==================== */}
          <div className="lg:col-span-5 relative group overflow-hidden bg-stone-950 min-h-[400px] lg:min-h-[700px]">
            <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              src={product.images?.[0] || "https://via.placeholder.com/600"} 
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent"></div>

            {/* Cinematic Badges */}
            <div className="absolute top-10 left-10 flex flex-col gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    Market Active
                </div>
            </div>

            {/* Product Metadata Overlay */}
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Specimen {product.category}</span>
                    <div className="w-8 h-[1px] bg-white/20"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">{product.subcategory}</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] mb-8 tracking-tighter">
                    {product.name.split(' ')[0]} <br/> 
                    <span className="italic font-light opacity-50">{product.name.split(' ').slice(1).join(' ')}</span>
                </h2>
                
                <div className="flex items-end gap-6 pt-8 border-t border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">Base Valuation</span>
                        <span className="text-4xl font-serif text-emerald-400">₹{product.price}</span>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ==================== RIGHT: BIDDING TERMINAL ==================== */}
          <div className="lg:col-span-7 p-10 md:p-20 flex flex-col bg-white">
            
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-16">
               <button 
                 onClick={() => navigate(-1)} 
                 className="flex items-center text-stone-400 hover:text-stone-900 transition-all font-black uppercase tracking-widest text-[10px] group"
               >
                 <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                 Back to Archive
               </button>
               <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 border border-stone-100">
                  <Gavel size={20} />
               </div>
            </div>

            <div className="mb-16">
               <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-emerald-600" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Bidding Protocol</span>
               </div>
               <h1 className="text-5xl font-serif text-stone-900 mb-4 tracking-tighter">Submit Your <span className="italic text-stone-400">Offer.</span></h1>
               <p className="text-stone-500 font-light text-lg leading-relaxed max-w-md">
                 Propose a settlement value directly to the curator. High-intent bids receive priority review.
               </p>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-12">
              
              {/* Offer Input */}
              <div className="group">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 block group-focus-within:text-emerald-600 transition-colors">
                  Your Proposed Value (₹)
                </label>
                <div className="relative border-b-2 border-stone-100 group-focus-within:border-emerald-500 transition-all pb-4">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 font-serif text-3xl">₹</span>
                  <input 
                    type="number" 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-12 pr-12 bg-transparent focus:outline-none text-4xl font-serif text-stone-800 placeholder:text-stone-100"
                    placeholder={product.price}
                    required
                  />
                  <AnimatePresence>
                    {parseFloat(bidAmount) >= product.price && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500"
                        >
                            <CheckCircle2 size={32} strokeWidth={1.5} />
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {bidAmount && parseFloat(bidAmount) < product.price && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] mt-4 flex items-center gap-2 font-black uppercase tracking-widest">
                     <AlertCircle size={14}/> Value must exceed base ₹{product.price}
                   </motion.p>
                )}
              </div>

              {/* Message Input */}
              <div className="group">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 block group-focus-within:text-emerald-600 transition-colors">
                  Acquisition Memo <span className="opacity-30 font-light italic text-[8px] ml-2">(Optional)</span>
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-6 bg-stone-50/50 border border-stone-100 rounded-3xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-stone-700 min-h-[120px] resize-none font-light placeholder:text-stone-300 shadow-inner"
                  placeholder="e.g. Inquiring about immediate studio pickup..."
                />
              </div>

              {/* Final Action */}
              <div className="pt-6">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading || (bidAmount && parseFloat(bidAmount) < product.price)}
                  className="group relative w-full overflow-hidden bg-stone-900 text-white font-black uppercase tracking-[0.3em] text-xs py-6 rounded-2xl shadow-2xl shadow-stone-300 transition-all disabled:opacity-50"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 size={18} className="animate-spin text-emerald-400" />
                    ) : (
                      <>
                        Initialize Bid <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </motion.button>
                
                <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={12} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Verified Collector</span>
                    </div>
                    <div className="w-[1px] h-3 bg-stone-300"></div>
                    <div className="flex items-center gap-2">
                        <Zap size={12} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Instant Sync</span>
                    </div>
                </div>
              </div>
            </form>
          </div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

// Simple Loader icon helper
const Loader2 = ({ size, className }) => (
    <Zap size={size} className={className} />
)

export default BidPage;