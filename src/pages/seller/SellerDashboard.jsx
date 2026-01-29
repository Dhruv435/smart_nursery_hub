import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AddProduct from "./AddProduct";
import MyProducts from "./MyProducts";
import ViewBids from "./ViewBids"; 
import SellerHistory from "./SellerHistory"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, Package, Gavel, 
  FileText, LogOut, Sparkles, 
  ChevronRight, BarChart3
} from "lucide-react";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [seller, setSeller] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSeller = localStorage.getItem("seller");
    if (!storedSeller) {
      navigate("/seller/login");
    } else {
      setSeller(JSON.parse(storedSeller));
    }
  }, [navigate]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setActiveTab("add-product");
  };

  const handleLogout = () => {
    localStorage.removeItem("seller");
    navigate("/seller/login");
    window.location.reload();
  };

  if (!seller) return null;

  const NavLink = ({ tab, label, icon: Icon }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => { setActiveTab(tab); setEditingProduct(null); }}
        className={`group w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 ${
          isActive 
            ? "bg-stone-900 text-white shadow-2xl translate-x-2" 
            : "text-stone-400 hover:bg-stone-50 hover:text-stone-900"
        }`}
      >
        <div className="flex items-center gap-4">
          <Icon size={18} className={isActive ? "text-emerald-400" : "text-stone-300"} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <ChevronRight size={14} className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans selection:bg-emerald-200">
      <Header />
      
      {/* Background Decorative Blur */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Main Container: Flex ensures footer pushed to bottom */}
      <div className="flex-1 flex flex-col md:flex-row pt-20">
        
        {/* === SIDEBAR (Sticky Layout) === */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="md:sticky md:top-20 md:h-[calc(100vh-5rem)] p-8 border-r border-stone-100 flex flex-col bg-white">
            
            {/* Studio Profile */}
            <div className="mb-12">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-stone-50 border border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg rotate-3 shrink-0 font-serif font-bold text-xl">
                  {seller.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-stone-900 font-bold text-sm truncate uppercase tracking-tighter">{seller.name}</h2>
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Curator Online
                  </div>
                </div>
              </div>
            </div>
            
            {/* Studio Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
              <p className="px-4 text-[9px] font-black text-stone-300 uppercase tracking-[0.4em] mb-4">Studio Control</p>
              <NavLink tab="dashboard" label="Overview" icon={BarChart3} />
              <NavLink tab="add-product" label={editingProduct ? "Edit Series" : "List Specimen"} icon={PlusCircle} />
              <NavLink tab="my-products" label="The Archive" icon={Package} />

              <div className="py-6"><div className="h-px bg-stone-100 w-full" /></div>
              
              <p className="px-4 text-[9px] font-black text-stone-300 uppercase tracking-[0.4em] mb-4">Transaction Ledger</p>
              <NavLink tab="view-bids" label="Active Bids" icon={Gavel} />
              <NavLink tab="history" label="Sales Logs" icon={FileText} />
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-auto pt-8 border-t border-stone-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 font-black uppercase tracking-[0.2em] text-[10px]"
              >
                 <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* === MAIN CONTENT AREA === */}
        <main className="flex-1 p-6 lg:p-16 min-w-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-emerald-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Management Suite</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter">
              {activeTab === "dashboard" && <>Archive <span className="italic font-light text-stone-400">Hub</span></>}
              {activeTab === "add-product" && (editingProduct ? "Modify Specimen" : "New Series")}
              {activeTab === "my-products" && "The Collection"}
              {activeTab === "view-bids" && "Live Market"}
              {activeTab === "history" && "Financial Ledger"}
            </h1>
          </motion.div>

          <div className="relative min-h-[60vh]">
            <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                <motion.div 
                    key="dash" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 gap-8"
                >
                    <div className="bg-stone-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] transition-all duration-1000" />
                        <div className="relative z-10 max-w-xl">
                            <Sparkles className="text-emerald-400 mb-8" size={32} />
                            <h3 className="text-4xl md:text-6xl font-serif leading-none mb-6">Welcome back, <br/> <span className="italic opacity-60">{seller.name.split(' ')[0]}</span></h3>
                            <p className="text-stone-400 text-lg font-light leading-relaxed mb-10">Your botanical studio is active. Monitor your listings and engagement in real-time.</p>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => setActiveTab("add-product")} className="px-10 py-5 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 shadow-2xl flex items-center gap-3 transition-all">List Specimen <PlusCircle size={14}/></button>
                                <button onClick={() => setActiveTab("view-bids")} className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-stone-900 transition-all">Check Market</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Live Listings</p><h4 className="text-5xl font-serif text-stone-900">12</h4></div>
                        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Bids Received</p><h4 className="text-5xl font-serif text-stone-900">08</h4></div>
                        <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 text-emerald-900"><BarChart3 className="text-emerald-600 mb-4" size={24} /><p className="text-[10px] font-black uppercase tracking-widest mb-2">Market Share</p><h4 className="text-2xl font-serif">Studio Elite</h4></div>
                    </div>
                </motion.div>
                )}

                {activeTab === "add-product" && (
                <motion.div key="add" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <AddProduct setActiveTab={setActiveTab} editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
                </motion.div>
                )}

                {activeTab === "my-products" && (
                <motion.div key="my" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <MyProducts onEdit={handleEditClick} />
                </motion.div>
                )}
                
                {activeTab === "view-bids" && <motion.div key="bids" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ViewBids /></motion.div>}
                {activeTab === "history" && <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><SellerHistory /></motion.div>}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* FOOTER - Now correctly placed at the end of the flex-col flow */}
      <Footer />
    </div>
  );
};

export default SellerDashboard;