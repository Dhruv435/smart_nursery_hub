import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Printer, X, Filter, Download, 
  FileText, CheckCircle2, History, IndianRupee, 
  Search, ArrowRight, Zap, ShieldCheck
} from "lucide-react";

const SellerHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [printData, setPrintData] = useState(null);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const storedSeller = JSON.parse(localStorage.getItem("seller"));
    if (storedSeller) {
      setSeller(storedSeller);
      fetchHistory(storedSeller._id);
    }
  }, []);

  useEffect(() => {
    if (selectedProduct === "All") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(item => item.productName === selectedProduct));
    }
  }, [selectedProduct, history]);

  const fetchHistory = async (sellerId) => {
    try {
      const res = await axios.get(`http://localhost:5050/user-history/${sellerId}`);
      setHistory(res.data);
      setFilteredHistory(res.data);
      const uniqueProducts = ["All", ...new Set(res.data.map(item => item.productName))];
      setProducts(uniqueProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm("Archiving this record will remove it from your studio ledger. Proceed?")) return;
    try {
      await axios.post("http://localhost:5050/history/delete", {
        bidId,
        userId: seller._id
      });
      const updated = history.filter(item => item._id !== bidId);
      setHistory(updated);
    } catch {
      alert("Error updating ledger");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto font-sans text-stone-700 pb-20">
      
      {/* ==================== HEADER ==================== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-stone-200 pb-10 gap-6"
      >
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[1px] bg-emerald-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Studio Records</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-serif font-black text-stone-900 tracking-tighter">
             Sales <span className="italic font-light text-stone-400">Ledger</span>
           </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/40">
                <div className="text-right">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Total Volume</p>
                    <p className="text-xl font-serif text-stone-900">{filteredHistory.length} Transactions</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <History size={20} />
                </div>
            </div>
        </div>
      </motion.div>

      {/* ==================== FILTERS ==================== */}
      <div className="mb-12">
         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6 flex items-center gap-2">
            <Filter size={12} /> Filter Series
         </h3>
         <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {products.map(prod => (
              <motion.button
                key={prod}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProduct(prod)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  selectedProduct === prod 
                    ? "bg-stone-900 text-white border-stone-900 shadow-2xl" 
                    : "bg-white text-stone-400 border-stone-100 hover:text-stone-900 hover:border-stone-300"
                }`}
              >
                {prod}
              </motion.button>
            ))}
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <Zap className="animate-pulse text-emerald-500" size={32} />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">Synchronizing Archive...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-stone-100 text-center">
           <FileText size={64} className="text-stone-100 mb-6" />
           <h3 className="text-3xl font-serif text-stone-300 italic">Archive Empty</h3>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((item, index) => (
              <motion.div 
                 key={item._id}
                 layout
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ delay: index * 0.05 }}
                 className="group bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-stone-200/60 hover:border-emerald-100 transition-all flex flex-col lg:flex-row items-center justify-between gap-10"
              >
                <div className="flex items-center gap-8 w-full lg:w-auto">
                    <div className="relative shrink-0">
                       <img src={item.productImage} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" alt="product" />
                       <div className="absolute -top-3 -right-3 bg-stone-900 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                          <CheckCircle2 size={14} />
                       </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 block">Sold Specimen</span>
                      <h4 className="font-serif text-3xl text-stone-900 mb-2 leading-none">{item.productName}</h4>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-[10px] font-black text-stone-400">
                            {item.buyerName?.[0]}
                         </div>
                         <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                            Acquired by <span className="text-stone-900">{item.buyerName}</span>
                         </p>
                      </div>
                    </div>
                </div>

                <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0 border-stone-50">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Final Bid</p>
                      <p className="text-4xl font-serif text-stone-900 tracking-tighter">₹{item.bidAmount}</p>
                      <p className="text-[10px] font-mono text-emerald-600 mt-1 uppercase font-bold tracking-tighter">
                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                   </div>

                   <div className="flex gap-3">
                     <motion.button 
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => setPrintData(item)}
                       className="w-14 h-14 bg-stone-50 text-stone-400 hover:bg-emerald-600 hover:text-white rounded-[1.2rem] flex items-center justify-center transition-all duration-500 border border-stone-100 shadow-sm"
                     >
                       <Printer size={20} />
                     </motion.button>
                     <motion.button 
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => handleDelete(item._id)}
                       className="w-14 h-14 bg-stone-50 text-stone-400 hover:bg-red-500 hover:text-white rounded-[1.2rem] flex items-center justify-center transition-all duration-500 border border-stone-100 shadow-sm"
                     >
                       <Trash2 size={20} />
                     </motion.button>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ==================== INVOICE MODAL ==================== */}
      <AnimatePresence>
      {printData && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-stone-900/60 backdrop-blur-xl z-[120] flex items-center justify-center p-6 overflow-y-auto"
        >
          <motion.div 
             initial={{ scale: 0.9, y: 40 }}
             animate={{ scale: 1, y: 0 }}
             exit={{ scale: 0.9, y: 40 }}
             className="bg-[#faf9f6] w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-stone-200 flex justify-between items-center print:hidden">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Statement Preview</span>
               <button onClick={() => setPrintData(null)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                  <X size={18} />
               </button>
            </div>

            <div className="p-12 md:p-16 print:p-0" id="statement-area">
              <div className="flex justify-between items-start mb-16 border-b-2 border-stone-900 pb-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-emerald-600 text-white flex items-center justify-center rounded-2xl text-2xl rotate-3 shadow-xl">🌿</div>
                     <h1 className="text-3xl font-serif font-black text-stone-900 tracking-tighter uppercase">NurseryHub</h1>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Official Botanical Receipt</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Receipt ID</p>
                  <p className="font-serif italic text-2xl text-stone-900">#{printData._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-16 mb-16">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Acquired By</h3>
                  <div className="bg-stone-100 p-6 rounded-[1.5rem]">
                     <p className="font-serif text-2xl text-stone-900 mb-1">{printData.buyerName}</p>
                     <p className="text-xs font-mono text-stone-400 font-bold uppercase tracking-tighter">{printData.buyerMobile}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Settlement</h3>
                  <div className="bg-emerald-950 p-6 rounded-[1.5rem] text-white">
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">{printData.paymentMethod || 'Studio Transfer'}</p>
                     <p className="text-4xl font-serif">₹{printData.bidAmount}</p>
                  </div>
                </div>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-stone-100 text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <th className="py-4 text-left">Description</th>
                    <th className="py-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-50">
                    <td className="py-8">
                       <p className="text-2xl font-serif text-stone-900 mb-1">{printData.productName}</p>
                       <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Botanical Series Specimen</p>
                    </td>
                    <td className="py-8 text-right font-serif text-2xl text-stone-900">₹{printData.bidAmount}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center bg-stone-50 p-8 rounded-[2rem]">
                  <div>
                    <ShieldCheck className="text-emerald-600 mb-2" size={20} />
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Encrypted & Verified</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Ledger Entry Date</p>
                    <p className="font-serif text-stone-900">{new Date(printData.createdAt).toLocaleDateString()}</p>
                  </div>
              </div>
            </div>

            <div className="bg-white p-10 flex justify-end gap-4 print:hidden">
               <button onClick={() => window.print()} className="px-10 py-5 bg-stone-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-800 shadow-2xl transition-all">
                 <Download size={16} /> Download Transcript
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default SellerHistory;