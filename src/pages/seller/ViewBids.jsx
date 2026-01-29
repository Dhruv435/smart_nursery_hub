import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, MessageSquare, CheckCircle, RefreshCw, 
  AlertCircle, ChevronRight, IndianRupee, Zap, Sparkles 
} from "lucide-react";

const ViewBids = () => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchBids(); }, []);

  useEffect(() => {
    if (selectedProduct === "All") setFilteredBids(bids);
    else setFilteredBids(bids.filter(bid => bid.productName === selectedProduct));
  }, [selectedProduct, bids]);

  const fetchBids = async () => {
    setLoading(true);
    const seller = JSON.parse(localStorage.getItem("seller"));
    const buyer = JSON.parse(localStorage.getItem("buyer"));
    let url = "";

    if (seller) { url = `http://localhost:5050/seller-bids/${seller._id}`; setRole("seller"); }
    else if (buyer) { url = `http://localhost:5050/user-history/${buyer._id}`; setRole("buyer"); }
    else { setLoading(false); return; }

    try {
      const res = await axios.get(url);
      const displayBids = role === "seller" 
        ? res.data.filter(bid => bid.status !== 'sold' && bid.status !== 'archived')
        : res.data;
      setBids(displayBids);
      setFilteredBids(displayBids);
      const uniqueProds = ["All", ...new Set(displayBids.map(b => b.productName))];
      setProducts(uniqueProds);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleChatOnly = async (bid) => {
    try {
      const res = await axios.post("http://localhost:5050/chat/accept-bid", {
        bidId: bid._id, sellerId: bid.sellerId, buyerId: bid.buyerId, productName: bid.productName
      });
      navigate("/chat", { state: { chatId: res.data._id } });
    } catch (err) { alert("Error opening terminal."); }
  };

  const handleSellNow = async (bid) => {
    const seller = JSON.parse(localStorage.getItem("seller"));
    if (!window.confirm(`Finalize settlement of ₹${bid.bidAmount} with ${bid.buyerName}?`)) return;
    try {
      await axios.post("http://localhost:5050/sell/confirm", {
        bidId: bid._id, sellerId: seller._id, buyerId: bid.buyerId, productName: bid.productName
      });
      fetchBids();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-[1400px] mx-auto font-sans text-stone-700 pt-30 pb-20">
      
      {/* ==================== 1. HEADER ==================== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
      >
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[1px] bg-emerald-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Market Protocol</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-serif text-stone-900 leading-none tracking-tighter">
             {role === "seller" ? "Bids" : "Active"} <span className="italic font-light text-stone-400">{role === "seller" ? "Received" : "Offers"}</span>
           </h2>
        </div>
        <button 
          onClick={fetchBids} 
          className="flex items-center gap-3 px-6 py-3 bg-white border border-stone-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-emerald-600 transition-all shadow-xl shadow-stone-200/40"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Synchronize Ledger
        </button>
      </motion.div>

      {/* ==================== 2. FILTER SERIES ==================== */}
      {products.length > 1 && (
        <div className="mb-12">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 mb-6 px-2">Filter Series</p>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {products.map(prod => (
                <button
                key={prod}
                onClick={() => setSelectedProduct(prod)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                    selectedProduct === prod 
                    ? "bg-stone-900 text-white border-stone-900 shadow-2xl shadow-stone-300" 
                    : "bg-white text-stone-400 border-stone-100 hover:text-stone-900 hover:border-stone-300"
                }`}
                >
                {prod}
                </button>
            ))}
            </div>
        </div>
      )}

      {/* ==================== 3. MARKET LIST ==================== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Zap className="animate-pulse text-emerald-500" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">Fetching Market Data...</p>
        </div>
      ) : filteredBids.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-stone-100 text-center">
           <AlertCircle size={48} className="mx-auto text-stone-100 mb-6" />
           <h3 className="text-3xl font-serif text-stone-300 italic tracking-tight">No active engagements.</h3>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBids.map((bid, index) => (
              <motion.div 
                 key={bid._id}
                 layout
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="group bg-white p-8 rounded-[2.5rem] border border-stone-50 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 transition-all flex flex-col lg:flex-row items-center gap-10"
              >
                {/* Product Detail */}
                <div className="flex items-center gap-8 w-full lg:w-1/3">
                    <div className="relative shrink-0">
                        <img src={bid.productImage} alt={bid.productName} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-xl group-hover:scale-105 transition-transform duration-500" />
                        <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${bid.status === 'pending' ? 'bg-blue-500' : 'bg-emerald-500'} text-white`}>
                            <Sparkles size={12} />
                        </div>
                    </div>
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 mb-1 block">Specimen</span>
                        <h3 className="font-serif text-3xl text-stone-900 mb-2 leading-none">{bid.productName}</h3>
                        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                            bid.status === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                            {bid.status.replace("_", " ")}
                        </span>
                    </div>
                </div>

                {/* Identity / Message */}
                <div className="w-full lg:w-1/3 px-0 lg:px-10 lg:border-l lg:border-r border-stone-100 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-[10px] font-black text-stone-400">
                            {role === 'seller' ? bid.buyerName?.[0] : 'ME'}
                        </div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                            {role === 'seller' ? `From ${bid.buyerName}` : 'Personal Interest'}
                        </p>
                    </div>
                    <p className="text-sm text-stone-500 font-light italic leading-relaxed">
                        "{bid.message || "No acquisition memo attached."}"
                    </p>
                </div>

                {/* Settlement / Actions */}
                <div className="w-full lg:w-1/3 flex flex-col lg:items-end justify-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em] mb-1">Proposed Value</p>
                        <p className="text-5xl font-serif text-stone-900 tracking-tighter leading-none">
                            <span className="text-xl mr-1 opacity-20">₹</span>{bid.bidAmount}
                        </p>
                    </div>
                    
                    <div className="flex gap-3 w-full lg:w-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChatOnly(bid)} 
                            className="flex-1 lg:flex-none p-4 bg-stone-50 text-stone-400 hover:bg-emerald-600 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-stone-100"
                        >
                            <MessageSquare size={20} />
                        </motion.button>
                        {role === "seller" && bid.status === "pending" && (
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSellNow(bid)} 
                                className="flex-[3] lg:flex-none bg-stone-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-stone-300 hover:bg-emerald-800 transition-all"
                            >
                                Accept Settlement <ChevronRight size={14} />
                            </motion.button>
                        )}
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* ==================== 4. FOOTER ADVISORY ==================== */}
      <div className="mt-20 p-8 rounded-[2rem] bg-stone-100 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <Zap className="text-emerald-600" size={24} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
               Direct peer-to-peer botanical exchange terminal. All bids are binding upon acceptance.
            </p>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-300">Ledger v4.2 Secure</p>
      </div>

    </div>
  );
};

export default ViewBids;