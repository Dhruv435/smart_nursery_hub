import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Printer, ArrowLeft, Calendar, TrendingUp, 
  DollarSign, Package, FileText, Zap, ShieldCheck, 
  ChevronRight, IndianRupee, Clock
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import html2pdf from 'html2pdf.js';

const HistoryStatement = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [stats, setStats] = useState({ total: 0, won: 0, pending: 0, totalSpent: 0 });
  
  const statementRef = useRef();
  const navigate = useNavigate();

  const buyer = JSON.parse(localStorage.getItem("buyer"));
  const seller = JSON.parse(localStorage.getItem("seller"));
  const currentUser = buyer || seller;
  const userRole = buyer ? "buyer" : seller ? "seller" : null;

  useEffect(() => {
    if (!currentUser) {
      navigate("/buyer/login");
      return;
    }
    fetchHistory();
  }, [currentUser, navigate]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`https://nursreyhubbackend.vercel.app/user-history/${currentUser._id}`);
      setBids(res.data);
      calculateStats(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const calculateStats = (bidData) => {
    const total = bidData.length;
    const won = bidData.filter(bid => bid.status === "sold").length;
    const pending = bidData.filter(bid => bid.status === "pending" || bid.status === "accepted").length;
    const totalSpent = bidData.filter(bid => bid.status === "sold").reduce((sum, bid) => sum + bid.bidAmount, 0);
    setStats({ total, won, pending, totalSpent });
  };

  const filterByDate = (items) => {
    if (dateRange === "all") return items;
    const now = new Date();
    return items.filter(bid => {
      const diffDays = Math.ceil(Math.abs(now - new Date(bid.createdAt)) / (1000 * 60 * 60 * 24));
      if (dateRange === "week") return diffDays <= 7;
      if (dateRange === "month") return diffDays <= 30;
      if (dateRange === "year") return diffDays <= 365;
      return true;
    });
  };

  const downloadPDF = () => {
    const element = statementRef.current;
    const opt = {
      margin: 0.2,
      filename: `NurseryHub_Ledger_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const getStatusStyle = (status) => {
    const map = {
      sold: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pending: "bg-orange-50 text-orange-700 border-orange-100",
      accepted: "bg-blue-50 text-blue-700 border-blue-100",
      archived: "bg-stone-100 text-stone-500 border-stone-200"
    };
    return map[status] || "bg-stone-50 text-stone-600 border-stone-100";
  };

  const filteredBids = filterByDate(bids);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center gap-4">
        <Zap className="text-emerald-500 animate-pulse" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Syncing Ledger...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans selection:bg-emerald-200">
      <Header />
      
      {/* ==================== 1. CONTROL TERMINAL ==================== */}
      <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto w-full print:hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40"
        >
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-stone-400 hover:text-stone-900 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>
          
          <div className="flex flex-wrap justify-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-6 py-3 border border-stone-100 rounded-2xl bg-stone-50 text-stone-700 font-bold text-[10px] uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none pr-10 relative"
            >
              <option value="all">Full Archive</option>
              <option value="week">Cycle: 7 Days</option>
              <option value="month">Cycle: 30 Days</option>
              <option value="year">Annual View</option>
            </select>
            
            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]">
              <Printer size={16} /> Print
            </button>
            
            <button onClick={downloadPDF} className="flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-emerald-800 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </motion.div>
      </div>

      {/* ==================== 2. STATEMENT CANVAS ==================== */}
      <main ref={statementRef} className="px-6 pb-32 max-w-[1400px] mx-auto w-full">
        
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-stone-200/50 overflow-hidden border border-stone-100 print:border-none print:shadow-none">
          
          {/* Editorial Header */}
          <div className="bg-stone-950 p-10 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-2xl rotate-3">
                    🌿
                  </div>
                  <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase leading-none">
                    Nursery<span className="italic text-emerald-500">Hub</span>
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Official Financial Transcript</p>
                </div>
              </div>
              <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-white/10 pl-6 md:pl-0 md:pr-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">Generation Date</p>
                <p className="font-serif italic text-2xl">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Ledger Identity */}
          <div className="px-10 md:px-20 py-12 border-b border-stone-100 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                  { label: "Account Identity", value: currentUser.name },
                  { label: "Studio Alias", value: `@${currentUser.username}` },
                  { label: "Protocol", value: userRole, color: "text-emerald-600" },
                  { label: "Statement Scope", value: dateRange === "all" ? "Full History" : `Last ${dateRange}` },
              ].map((item, idx) => (
                  <div key={idx}>
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-2">{item.label}</p>
                      <p className={`font-serif text-xl ${item.color || "text-stone-900"} capitalize`}>{item.value}</p>
                  </div>
              ))}
          </div>

          {/* Bento Stats */}
          <div className="px-10 md:px-20 py-12 bg-stone-50/50 grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                  { icon: Package, label: "Volume", val: stats.total, color: "text-blue-600" },
                  { icon: ShieldCheck, label: "Settled", val: stats.won, color: "text-emerald-600" },
                  { icon: Clock, label: "In Transit", val: stats.pending, color: "text-orange-600" },
                  { icon: IndianRupee, label: "Net Value", val: `₹${stats.totalSpent}`, color: "text-stone-900", big: true },
              ].map((s, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <s.icon size={16} className={s.color} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">{s.label}</span>
                      </div>
                      <p className={`font-serif ${s.big ? 'text-3xl' : 'text-4xl'} text-stone-900 tracking-tighter`}>{s.val}</p>
                  </div>
              ))}
          </div>

          {/* The Main Ledger */}
          <div className="p-10 md:p-20 overflow-x-auto">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 mb-10 border-b border-stone-100 pb-4">Transaction Logs</h3>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                    <th className="pb-6 pr-4">Timestamp</th>
                    <th className="pb-6 pr-4">Specimen Details</th>
                    <th className="pb-6 pr-4">Valuation</th>
                    <th className="pb-6 pr-4">Market Status</th>
                    <th className="pb-6 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredBids.map((bid, index) => (
                    <motion.tr 
                      key={bid._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                      className="group hover:bg-stone-50/50 transition-all"
                    >
                      <td className="py-8 pr-4">
                        <p className="text-xs font-bold text-stone-900">{new Date(bid.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase">{new Date(bid.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </td>
                      <td className="py-8 pr-4">
                        <div className="flex items-center gap-4">
                          <img src={bid.productImage} className="w-14 h-14 rounded-2xl object-cover border border-stone-100 grayscale group-hover:grayscale-0 transition-all" alt="prod" />
                          <div>
                            <p className="font-serif text-lg text-stone-900 leading-none mb-1">{bid.productName}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Archived ID: {bid._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 pr-4">
                        <p className="text-xl font-serif text-stone-900 tracking-tighter">₹{bid.bidAmount}</p>
                      </td>
                      <td className="py-8 pr-4">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(bid.status)}`}>
                          {bid.status === "sold" ? "Settled" : bid.status}
                        </span>
                      </td>
                      <td className="py-8 text-right">
                        {bid.status === "sold" ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-stone-900">{bid.paymentMethod || "Digital Sync"}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1 flex items-center gap-1"><Zap size={8}/> Verified</span>
                          </div>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBids.length === 0 && (
                  <div className="py-20 text-center">
                      <FileText className="mx-auto text-stone-100 mb-4" size={48} />
                      <p className="text-stone-400 italic font-serif">The ledger currently contains no records for this period.</p>
                  </div>
              )}
          </div>

          {/* Settlement Footer */}
          <div className="bg-stone-950 p-10 md:p-16 text-white flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4 opacity-50">
                  <ShieldCheck size={24} />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] max-w-[200px]">End-to-End Encrypted Botanical Exchange</p>
              </div>
              <div className="flex flex-col md:items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Net Portfolio Valuation</p>
                  <p className="text-5xl md:text-7xl font-serif tracking-tighter">₹{stats.totalSpent}</p>
              </div>
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
            System Generated Metadata // NurseryHub Studio v4.0
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          main { padding-bottom: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default HistoryStatement;