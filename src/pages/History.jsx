import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Trash2, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, Gavel } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const History = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, accepted, sold, archived
  const navigate = useNavigate();

  // Get current user
  const buyer = JSON.parse(localStorage.getItem("buyer"));
  const seller = JSON.parse(localStorage.getItem("seller"));
  const currentUser = buyer || seller;
  const userRole = buyer ? "buyer" : seller ? "seller" : null;

  useEffect(() => {
    if (!currentUser) {
      alert("Please login to view history");
      navigate("/buyer/login");
      return;
    }
    fetchHistory();
  }, [currentUser, navigate]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`https://nursreyhubbackend.vercel.app/user-history/${currentUser._id}`);
      setBids(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm("Remove this item from your history?")) return;

    try {
      await axios.post("https://nursreyhubbackend.vercel.app/history/delete", {
        bidId,
        userId: currentUser._id
      });
      setBids(bids.filter(bid => bid._id !== bidId));
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock size={14} />, text: "Pending" },
      accepted: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: <AlertCircle size={14} />, text: "Accepted" },
      awaiting_payment: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: <AlertCircle size={14} />, text: "Awaiting Payment" },
      sold: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <CheckCircle size={14} />, text: "Sold" },
      archived: { color: "bg-stone-100 text-stone-600 border-stone-200", icon: <XCircle size={14} />, text: "Archived" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const filteredBids = bids.filter(bid => {
    if (filter === "all") return true;
    return bid.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
                {userRole === "buyer" ? "My Bids" : "Bid History"}
              </h1>
              <p className="text-stone-500">
                {userRole === "buyer" 
                  ? "Track all your placed bids and their status" 
                  : "View all bids you've received and manage them"}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200">
              <Gavel size={18} className="text-emerald-600" />
              <span className="font-bold text-stone-900">{filteredBids.length}</span>
              <span className="text-stone-500 text-sm">Total</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "accepted", "awaiting_payment", "sold", "archived"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === filterOption
                  ? "bg-stone-900 text-white shadow-lg"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {filterOption === "all" ? "All" : filterOption.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Bids Grid */}
        {filteredBids.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-100">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              📦
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No bids found</h3>
            <p className="text-stone-500 mb-6">
              {filter === "all" 
                ? "You don't have any bids yet" 
                : `No ${filter} bids at the moment`}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBids.map((bid) => (
                <motion.div
                  key={bid._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={bid.productImage || "https://via.placeholder.com/400"}
                      alt={bid.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(bid.status)}
                    </div>
                  </div>

                  {/* Bid Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-stone-900 text-lg mb-2 line-clamp-1">
                      {bid.productName}
                    </h3>

                    {/* Bid Amount */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-sm text-stone-500">Your Bid:</span>
                      <span className="text-2xl font-bold text-emerald-600">₹{bid.bidAmount}</span>
                    </div>

                    {/* Buyer/Seller Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      {userRole === "seller" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Buyer:</span>
                            <span className="font-medium text-stone-900">{bid.buyerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Contact:</span>
                            <span className="font-medium text-stone-900">{bid.buyerMobile}</span>
                          </div>
                        </>
                      )}
                      
                      {bid.message && bid.message !== "No message added" && (
                        <div className="bg-stone-50 rounded-lg p-3 mt-2">
                          <p className="text-xs text-stone-500 mb-1">Message:</p>
                          <p className="text-sm text-stone-700 italic">"{bid.message}"</p>
                        </div>
                      )}
                    </div>

                    {/* Payment Info (if sold) */}
                    {bid.status === "sold" && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-emerald-700 font-medium">Payment Method:</span>
                          <span className="font-bold text-emerald-900">{bid.paymentMethod || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-emerald-700 font-medium">Status:</span>
                          <span className="font-bold text-emerald-900">{bid.paymentStatus || "N/A"}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(bid._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl transition-colors font-medium text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-xs text-stone-400">
                        Placed on {new Date(bid.createdAt).toLocaleDateString()} at {new Date(bid.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default History;