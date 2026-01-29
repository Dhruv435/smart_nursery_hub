import React, { useEffect, useState } from "react";
import { Gavel, Eye, Ban, Tag, User } from "lucide-react"; 
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller"));
    const buyer = JSON.parse(localStorage.getItem("buyer"));

    if (seller) {
      setCurrentUser(seller);
      setUserRole("seller");
    } else if (buyer) {
      setCurrentUser(buyer);
      setUserRole("buyer");
    }
  }, []);

  const isOwner = userRole === "seller" && currentUser?._id === product.sellerId;
  const isSold = product.isSold; 

  // Navigation Handlers (Logic Unchanged)
  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleBidClick = (e) => {
    e.stopPropagation(); 
    if (isOwner || isSold) return; 
    navigate(`/bid/${product._id}`, { state: { product } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden cursor-pointer transition-all duration-500 h-full flex flex-col ${isSold ? "grayscale-[0.8] opacity-90" : ""}`}
      onClick={handleCardClick}
    >
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-[320px] overflow-hidden bg-gray-100">
        
        {/* SOLD OVERLAY (Stamp Style) */}
        {isSold && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
            <div className="border-4 border-red-600 text-red-600 px-8 py-3 rounded-xl font-black text-2xl tracking-widest uppercase transform -rotate-12 shadow-lg bg-white/80">
              Sold Out
            </div>
          </div>
        )}

        {/* Product Image */}
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            <span className="text-sm font-medium">No Image Available</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {product.subcategory && (
            <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/50">
              {product.subcategory}
            </span>
          )}
          
          {/* View Icon (Appears on Hover) */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="bg-white text-slate-800 p-2.5 rounded-full shadow-lg opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-600 hover:text-white"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Gradient Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-6 flex flex-col flex-grow relative bg-white">
        
        {/* Floating Price Tag (Overlaps Image) */}
        <div className="absolute -top-6 right-6 bg-white text-slate-900 font-bold px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-1 group-hover:-translate-y-1 transition-transform duration-300">
           <span className="text-xs text-slate-400 font-medium">₹</span>
           <span className="text-lg">{product.price}</span>
        </div>

        <div className="mb-4 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={12} className="text-green-600" />
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <h3
            className="text-xl font-bold text-slate-800 leading-snug line-clamp-1 group-hover:text-green-800 transition-colors font-serif"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Action Area */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          
          {/* Logic for Different States */}
          {isSold ? (
            <div className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200">
              <Ban size={16} /> Item Sold
            </div>
          ) : isOwner ? (
            <div className="w-full py-3 rounded-xl bg-green-50 text-green-700 font-bold text-sm flex items-center justify-center gap-2 border border-green-100">
              <User size={16} /> Your Listing
            </div>
          ) : (
            <button
              onClick={handleBidClick}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-green-700 hover:shadow-green-700/30 transition-all duration-300 transform active:scale-95 group/btn"
            >
              Place a Bid <Gavel size={16} className="group-hover/btn:rotate-12 transition-transform"/>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;