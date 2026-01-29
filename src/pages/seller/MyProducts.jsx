import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit, PackageOpen, Leaf, IndianRupee, Zap, ShieldCheck, ArrowUpRight } from "lucide-react";

const MyProducts = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const seller = JSON.parse(localStorage.getItem("seller"));

  useEffect(() => {
    if (!seller?._id) return;
    fetchMyProducts();
  }, [seller]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`https://nursreyhubbackend.vercel.app/my-products/${seller._id}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Archiving this specimen will remove it from the public archive. Proceed?")) return;
    try {
      await axios.delete(`https://nursreyhubbackend.vercel.app/delete-product/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch { alert("Action failed"); }
  };

  return (
    <div className="max-w-[1400px] mx-auto font-sans text-stone-700">
      
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-emerald-600"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Asset Management</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-none">The <span className="italic font-light text-stone-400">Inventory</span></h2>
        </div>
        <div className="bg-stone-900 text-white px-8 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-stone-200">
          <div className="text-right border-r border-white/10 pr-4">
             <p className="text-[9px] font-black uppercase tracking-widest text-stone-500">Stock Count</p>
             <p className="text-xl font-serif leading-none">{products.length}</p>
          </div>
          <Zap size={20} className="text-emerald-400" />
        </div>
      </div>
      
      {loading ? (
        /* ==================== ARCHITECTURAL SKELETON ==================== */
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="space-y-6">
              <div className="aspect-[4/5] bg-stone-100 rounded-[2.5rem] animate-pulse" />
              <div className="h-6 bg-stone-100 w-3/4 rounded-lg animate-pulse" />
              <div className="h-4 bg-stone-100 w-1/2 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* ==================== EMPTY STATE ==================== */
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-stone-100 text-center"
        >
          <div className="w-20 h-20 bg-stone-50 text-stone-200 rounded-full flex items-center justify-center mb-6">
            <PackageOpen size={40} />
          </div>
          <h3 className="text-2xl font-serif text-stone-400 italic">No specimens listed in your archive.</h3>
        </motion.div>
      ) : (
        /* ==================== PRODUCT ARCHIVE GRID ==================== */
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-16"
        >
          <AnimatePresence>
            {products.map((product) => (
              <motion.div 
                key={product._id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-stone-200 transition-all duration-700">
                  {product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={product.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <Leaf size={48} />
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-500 flex items-center justify-center gap-3">
                     <button 
                        onClick={() => onEdit(product)}
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-stone-900 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-emerald-600 hover:text-white"
                     >
                        <Edit size={20} />
                     </button>
                     <button 
                        onClick={() => handleDelete(product._id)}
                        className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 hover:bg-red-500 hover:text-white"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>

                  {/* Sold Badge */}
                  {product.isSold && (
                    <div className="absolute top-6 right-6 bg-stone-900 text-white text-[10px] font-black px-4 py-2 rounded-full border border-white/20 shadow-2xl flex items-center gap-2">
                       <ShieldCheck size={12} className="text-emerald-400" /> ACQUIRED
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="mt-8 px-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1 block">
                        {product.category}
                      </span>
                      <h3 className="text-2xl font-serif text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-300 group-hover:text-stone-900 group-hover:border-stone-900 transition-all">
                       <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-stone-100">
                    <IndianRupee size={14} className="text-emerald-600" />
                    <span className="text-xl font-serif font-black text-stone-900">{product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ==================== FOOTER TIP ==================== */}
      <div className="mt-20 p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center gap-6">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
            <ShieldCheck size={24} />
         </div>
         <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 leading-relaxed">
            Every specimen listed in your archive is synchronized with the global marketplace. <br/>
            <span className="opacity-50">To modify high-value assets, use the edit terminal in the card overlay.</span>
         </p>
      </div>

    </div>
  );
};

export default MyProducts;