import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import TryOnModal from "../components/TryOnModal";
import { ArrowLeft, Gavel, Tag, Clock, Store, Camera, Sparkles, ChevronRight } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller"));
    const buyer = JSON.parse(localStorage.getItem("buyer"));
    setCurrentUser(seller || buyer);
    
    setProduct(null);
    setSellerProducts([]);
    setBids([]);
    setLoading(true);

    if (id) {
        fetchData();
    } else {
        console.error("No Product ID found in URL");
        setLoading(false);
    }
  }, [id]);

  const fetchData = async () => {
    try {
      // 1. Fetch Product
      const productRes = await axios.get(`http://localhost:5050/product/${id}`);
      setProduct(productRes.data);

      // 2. Fetch Bids
      const bidsRes = await axios.get(`http://localhost:5050/product-bids/${id}`);
      setBids(bidsRes.data);

      // 3. Fetch All Products from this Seller
      if (productRes.data && productRes.data.sellerId) {
        const moreRes = await axios.get(`http://localhost:5050/seller-products-public/${productRes.data.sellerId}`);
        setSellerProducts(moreRes.data);
      }

    } catch (err) {
      console.error("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBid = () => {
    navigate(`/bid/${id}`, { state: { product } });
  };

  // ✅ UPDATED: Check if seller exists before navigating
  const handlePortfolioClick = () => {
    if (product?.sellerId && product?.sellerName !== "Unknown Seller") {
        navigate(`/portfolio/${product.sellerId}`);
    } else {
        alert("This seller's profile is no longer available.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-500 gap-3 font-serif">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p>Loading...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-600 gap-4">
        <h2 className="text-xl font-bold">Product not found.</h2>
        <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-stone-200 rounded-lg hover:bg-stone-300 transition"
        >
            Go Back
        </button>
    </div>
  );

  const isOwner = currentUser?._id === product.sellerId;
  // ✅ Check if seller is valid
  const isSellerValid = product.sellerName && product.sellerName !== "Unknown Seller";

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-200">
      <Header />
      
      {/* TRY-ON MODAL */}
      {showTryOn && (
        <TryOnModal 
          product={product} 
          onClose={() => setShowTryOn(false)} 
        />
      )}

      {/* Background Decorative Blob */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <main className="flex-grow pt-28 pb-20 px-6 max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* Back Button */}
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors font-medium group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center mr-2 group-hover:bg-stone-100 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Listings
        </button>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <div className="sticky top-28 space-y-6">
                <div className="aspect-[4/3] w-full bg-stone-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200/50 border border-white/50 relative group">
                    <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : ""} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-sm">
                        {product.category}
                    </div>
                </div>

                {product.images && product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {product.images.map((img, idx) => (
                        <div key={idx} className="shrink-0 cursor-pointer">
                            <img 
                                src={img} 
                                className="w-24 h-24 rounded-2xl object-cover border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm" 
                                alt="thumb"
                            />
                        </div>
                        ))}
                    </div>
                )}
            </div>
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="lg:col-span-5 flex flex-col">
             
             {/* Title & Price */}
             <div className="mb-8">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-stone-400 text-sm font-medium flex items-center gap-1">
                        Home <ChevronRight size={12}/> {product.category} <ChevronRight size={12}/> {product.subcategory || "General"}
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                    {product.name}
                 </h1>
                 
                 <div className="flex items-end gap-3 mb-6">
                    <span className="text-sm text-stone-400 font-bold uppercase tracking-widest mb-1.5">Current Price</span>
                    <span className="text-5xl font-mono text-emerald-800 font-medium">₹{product.price}</span>
                 </div>
             </div>

             {/* SELLER CARD - CLICKABLE ONLY IF VALID */}
             <div 
                className={`bg-white p-5 rounded-2xl border border-stone-100 shadow-sm mb-8 flex items-center justify-between group transition-all ${isSellerValid ? "cursor-pointer hover:border-emerald-200" : "opacity-70 cursor-not-allowed"}`} 
                onClick={isSellerValid ? handlePortfolioClick : undefined}
             >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-xl border ${isSellerValid ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-stone-100 text-stone-400 border-stone-200"}`}>
                        {product.sellerName ? product.sellerName[0] : "S"}
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Seller</p>
                        <h4 className={`font-bold transition-colors ${isSellerValid ? "text-stone-900 group-hover:text-emerald-700" : "text-stone-500"}`}>
                            {product.sellerName || "Unknown Seller"}
                        </h4>
                        {!isSellerValid && <span className="text-[10px] text-red-400">(Account Deleted)</span>}
                    </div>
                </div>
                {isSellerValid && (
                    <div className="bg-stone-50 p-2 rounded-full text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <Store size={20} />
                    </div>
                )}
             </div>

             {/* ACTIONS */}
             <div className="space-y-4 mb-10">
                <button 
                    onClick={() => setShowTryOn(true)}
                    className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 text-indigo-700 py-4 rounded-xl font-bold shadow-sm hover:shadow-md hover:from-purple-100 hover:to-indigo-100 transition-all flex items-center justify-center gap-2 group"
                >
                    <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Camera size={18} className="text-indigo-600" />
                    </div>
                    <span>Visualise in Your Space</span>
                    <Sparkles size={16} className="text-purple-400" />
                </button>

                {isOwner ? (
                    <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-center font-bold text-sm">
                        You are the seller of this item.
                    </div>
                ) : (
                    <button 
                        onClick={handleApplyBid}
                        className="w-full bg-stone-900 hover:bg-black text-white text-lg font-bold py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <span>Place a Bid</span>
                        <Gavel size={20} />
                    </button>
                )}
             </div>

             {/* DESCRIPTION */}
             <div className="mb-10">
                <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Tag size={16} className="text-emerald-600" /> Description
                </h3>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line text-base border-l-2 border-stone-200 pl-4">
                    {product.description}
                </p>
             </div>

             {/* LIVE BIDS SECTION */}
             <div className="bg-white rounded-[1.5rem] border border-stone-100 shadow-lg shadow-stone-100 overflow-hidden">
                <div className="p-5 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
                        <Clock size={18} className="text-emerald-600" /> Live Activity
                    </h3>
                    <span className="bg-white border border-stone-200 px-3 py-1 rounded-full text-xs font-bold text-stone-500 shadow-sm">
                        {bids.length} Bids
                    </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {bids.length === 0 ? (
                        <div className="py-8 text-center text-stone-400 text-sm italic">
                            No bids yet. Be the first to offer!
                        </div>
                    ) : (
                        <div className="space-y-2">
                        {bids.map((bid, index) => (
                            <div key={bid._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-stone-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                                        index === 0 ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-500"
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-800 text-sm">{bid.buyerName}</h3>
                                        <p className="text-[10px] text-stone-400">{new Date(bid.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">₹{bid.bidAmount}</div>
                                    {bid.status === "accepted" && (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Sold</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
             </div>

          </div>
        </div>

        {/* --- MORE PRODUCTS --- */}
        {sellerProducts.length > 0 && (
          <section className="pt-10 border-t border-stone-200">
             <div className="flex items-end justify-between mb-8">
                <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">Portfolio</span>
                    <h2 className="text-3xl font-serif font-bold text-stone-900">
                        More from {product.sellerName}
                    </h2>
                </div>
                
                {/* Conditionally Render Portfolio Button */}
                {isSellerValid && (
                    <button 
                    onClick={handlePortfolioClick}
                    className="hidden md:flex items-center gap-2 text-sm text-stone-900 font-bold hover:text-emerald-700 transition-colors border-b border-stone-900 hover:border-emerald-700 pb-0.5"
                    >
                    View Full Portfolio <ArrowLeft size={16} className="rotate-180" />
                    </button>
                )}
             </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {sellerProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* Mobile Button - Conditional */}
            {isSellerValid && (
                <div className="mt-8 text-center md:hidden">
                    <button 
                    onClick={handlePortfolioClick}
                    className="text-sm text-stone-900 font-bold hover:text-emerald-700 border-b border-stone-900 pb-0.5"
                    >
                    View Full Portfolio →
                    </button>
                </div>
            )}
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;