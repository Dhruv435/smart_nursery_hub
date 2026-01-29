import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-[url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center">
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/10 border border-white/20 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Welcome!</h1>
        <p className="text-gray-200 mb-8 text-lg">How would you like to join us?</p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/signup/seller')}
            className="group relative bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-between overflow-hidden"
          >
            <span className="relative z-10">I am a Seller</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">🌿</span>
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="group relative bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-between"
          >
            <span>I am a Buyer</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">🛒</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;