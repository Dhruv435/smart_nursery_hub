import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ArrowLeft, UserCheck, Calendar, Store, Star, AlertCircle } from "lucide-react";

const Portfolio = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrphan, setIsOrphan] = useState(false); // Track if seller is deleted

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Try to fetch full portfolio (Seller + Products)
        const res = await axios.get(`https://nursreyhubbackend.vercel.app/seller-portfolio-public/${sellerId}`);
        setData(res.data);
      } catch (err) {
        console.warn("Seller profile not found, trying to fetch products only...");
        
        // 2. If Seller not found (404), try fetching just the products
        try {
            const productRes = await axios.get(`https://nursreyhubbackend.vercel.app/seller-products-public/${sellerId}`);
            
            // Create a "Dummy" seller object so the page still renders
            setData({
                seller: {
                    _id: sellerId,
                    name: "Unknown Seller",
                    avatar: null,
                    createdAt: new Date().toISOString(), // Fallback date
                    isDeleted: true
                },
                products: productRes.data
            });
            setIsOrphan(true); // Mark as orphan data
        } catch (prodErr) {
            console.error("Could not fetch products either.", prodErr);
            setData(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-500 gap-3 font-serif">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p>Curating Portfolio...</p>
    </div>
  );

  // If absolutely no data found (neither seller nor products)
  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-600 gap-4">
        <div className="bg-stone-200 p-4 rounded-full">
            <Store size={32} className="text-stone-400" />
        </div>
        <h2 className="text-xl font-bold">Store Not Found</h2>
        <p className="text-stone-400 text-sm">This seller profile is unavailable.</p>
        <button 
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-black transition"
        >
            Go Home
        </button>
    </div>
  );

  const { seller, products } = data;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-200">
      <Header />
      
      {/* Decorative Cover Background */}
      <div className="h-64 w-full bg-[#0f221a] relative overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2670&auto=format&fit=crop" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
      </div>

      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full -mt-20 relative z-10 pb-20">
        
        {/* BACK BUTTON */}
        <button 
            onClick={() => navigate(-1)} 
            className="absolute -top-16 left-4 md:left-0 flex items-center text-white/80 hover:text-white transition-colors font-medium text-sm backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        {/* SELLER HEADER CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-8 md:p-10 mb-12 border border-stone-100 flex flex-col md:flex-row items-start md:items-center gap-8">
           
           {/* Avatar */}
           <div className="relative">
             <div className={`w-32 h-32 rounded-full flex items-center justify-center border-[6px] border-white shadow-lg overflow-hidden shrink-0 ${seller.isDeleted ? "bg-stone-200" : "bg-stone-100"}`}>
                {seller.avatar ? (
                   <div dangerouslySetInnerHTML={{ __html: seller.avatar }} className="w-full h-full transform scale-110" />
                ) : (
                   <span className="text-4xl font-serif font-bold text-stone-400">{seller.name ? seller.name[0] : "?"}</span>
                )}
             </div>
             {!seller.isDeleted && (
                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white">
                    <UserCheck size={16} />
                </div>
             )}
           </div>
           
           {/* Info */}
           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                <h1 className="text-4xl font-serif font-bold text-stone-900">{seller.name}</h1>
                {seller.isDeleted ? (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit flex items-center gap-1">
                        <AlertCircle size={12} /> Account Deactivated
                    </span>
                ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
                        Verified Nursery
                    </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-stone-500 text-sm mt-3">
                 <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                    <Store size={14} className="text-stone-400"/> 
                    ID: <span className="font-mono text-stone-700">{seller._id.slice(-6).toUpperCase()}</span>
                 </span>
                 <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                    <Calendar size={14} className="text-stone-400"/> 
                    Since {new Date(seller.createdAt || Date.now()).getFullYear()}
                 </span>
              </div>
           </div>
           
           {/* Stats */}
           <div className="w-full md:w-auto flex justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8">
              <div className="text-center">
                 <span className="block text-4xl font-serif font-bold text-emerald-800">{products ? products.length : 0}</span>
                 <span className="text-xs text-stone-400 uppercase tracking-widest font-bold">Active Listings</span>
              </div>
           </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-stone-900">Curated Collection</h2>
            {!isOrphan && (
                <div className="hidden md:flex items-center gap-2 text-stone-400 text-sm">
                    <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                    <span>Top Rated Seller</span>
                </div>
            )}
        </div>
        
        {products && products.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-dashed border-stone-200">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                  <Store size={24} className="text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-700">Collection Empty</h3>
              <p className="text-stone-500">This nursery hasn't listed any plants yet.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products && products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
           </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;