import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

// --- GLOBAL COMPONENTS ---
import Header from "./components/Header"; 
import SupportModal from "./components/SupportModal";
import Loader from "./components/Loader"; 

// --- GENERAL PAGES ---
import Home from "./pages/Home";
import About from "./pages/About";
import Support from "./pages/Support";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Portfolio from "./pages/Portfolio";
import ChatPage from "./pages/ChatPage";
import HistoryStatement from "./pages/HistoryStatement";

// --- SELLER PAGES ---
import SellerLogin from "./pages/seller/SellerLogin";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProfile from "./pages/seller/SellerProfile";
import ViewBids from "./pages/seller/ViewBids";

// --- BUYER PAGES ---
import BuyerLogin from "./pages/buyer/BuyerLogin";
import BidPage from "./pages/buyer/BidPage";

function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);

  // Global Product Fetch to sync with Loader 
  // This ensures Trending Now and All Products are ready before the site opens
  useEffect(() => {
    const prefetch = async () => {
      try {
        await axios.get("https://nursreyhubbackend.vercel.app/all-products");
        // Buffering slightly for a premium feel
        setTimeout(() => setDataLoaded(true), 1200);
      } catch (err) {
        console.error("Initial data fetch failed", err);
        setDataLoaded(true); // Proceed anyway so user isn't stuck
      }
    };
    prefetch();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaderFinished ? (
          <Loader 
            key="loader" 
            isDataReady={dataLoaded} 
            onFinished={() => setLoaderFinished(true)} 
          />
        ) : (
          <motion.div 
            key="main-app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Navigation bar stays fixed at the top */}
            <Header /> 
            
            {/* Main content wrapper */}
            <main className="min-h-screen bg-[#faf9f6]">
              <Routes>
                {/* Public / General Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/support" element={<Support />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/portfolio/:sellerId" element={<Portfolio />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/history" element={<HistoryStatement />} />

                {/* Bidding System */}
                <Route path="/view-bids" element={<ViewBids />} /> 
                <Route path="/bid/:productId" element={<BidPage />} />

                {/* Seller Authentication & Management */}
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/profile" element={<SellerProfile />} />

                {/* Buyer Authentication */}
                <Route path="/buyer/login" element={<BuyerLogin />} />
              </Routes>
            </main>
            
            <SupportModal />
            <SpeedInsights />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;