import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, Shield, Bell, LogOut, CheckCircle, 
  Settings, Mail, Phone, AtSign, Fingerprint, 
  Zap, Sparkles, ChevronRight, Camera
} from "lucide-react"

const SellerProfile = () => {
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const navigate = useNavigate()

  useEffect(() => {
    const seller = localStorage.getItem("seller")
    const buyer = localStorage.getItem("buyer")
    
    if (seller) setUser(JSON.parse(seller))
    else if (buyer) setUser(JSON.parse(buyer))
    else navigate("/")

    const savedNotifs = localStorage.getItem("notifications")
    if (savedNotifs !== null) setNotifications(JSON.parse(savedNotifs))
    
    document.documentElement.classList.remove("dark")
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("seller")
    localStorage.removeItem("buyer")
    navigate("/")
    window.location.reload()
  }

  if (!user) return null
  const isSeller = localStorage.getItem('seller') !== null

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans selection:bg-emerald-200 overflow-x-hidden">
      <Header />
      
      {/* Cinematic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-yellow-50/50 rounded-full blur-[100px]"></div>
      </div>

      <main className="pt-32 pb-24 px-6 max-w-[1600px] mx-auto">
        
        {/* Header Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-stone-200 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[1px] bg-emerald-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Account Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-none">
              Profile <span className="italic font-light text-stone-400">Settings</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-stone-400 text-sm font-medium">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-stone-900 capitalize">{activeTab.replace("-", " ")}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ==================== SIDEBAR ==================== */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-stone-200/40 p-10 border border-white sticky top-32 overflow-hidden">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-2xl bg-stone-100 flex items-center justify-center relative group"
                  >
                     {user.avatar ? (
                        <div className="w-full h-full transform scale-110" dangerouslySetInnerHTML={{ __html: user.avatar }} />
                     ) : (
                        <User size={50} className="text-stone-300"/>
                     )}
                     <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera size={24} />
                     </div>
                  </motion.div>
                </div>

                <h2 className="text-3xl font-serif text-stone-900 mb-1">{user.name}</h2>
                <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] mb-6">@{user.username}</p>
                
                {/* UPDATED ACCOUNT BADGE */}
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                    isSeller 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {isSeller ? 'Seller Account' : 'Buyer Account'}
                </div>
              </div>

              <nav className="space-y-3">
                {[
                  { id: "info", label: "Personal Info", icon: User },
                  { id: "security", label: "Security", icon: Shield },
                  { id: "notif", label: "Notifications", icon: Bell },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group ${
                      activeTab === item.id 
                      ? "bg-stone-900 text-white shadow-xl translate-x-2" 
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className={activeTab === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
                  </button>
                ))}
                
                <div className="pt-8 mt-8 border-t border-stone-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </nav>
            </div>
          </motion.div>

          {/* ==================== CONTENT AREA ==================== */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-stone-200/40 p-8 md:p-16 border border-white min-h-[600px]">
              
              <AnimatePresence mode="wait">
                {activeTab === "info" && (
                  <motion.div 
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <h3 className="text-3xl font-serif text-stone-900 tracking-tight">Identity Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      {[
                        { label: "Full Name", value: user.name, icon: User },
                        { label: "Username", value: user.username, icon: AtSign },
                        { label: "Email Address", value: user.email, icon: Mail },
                        { label: "Mobile Number", value: user.mobile, icon: Phone },
                      ].map((field, idx) => (
                        <div key={idx} className="group">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-3 block group-focus-within:text-emerald-600 transition-colors">
                            {field.label}
                          </label>
                          <div className="relative flex items-center border-b border-stone-200 pb-3 group-focus-within:border-emerald-600 transition-all">
                             <field.icon size={16} className="text-stone-300 mr-4 group-focus-within:text-emerald-500 transition-colors" />
                             <input 
                                className="w-full bg-transparent text-stone-700 font-serif text-xl focus:outline-none cursor-not-allowed" 
                                value={field.value} 
                                readOnly 
                             />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-12 mt-12 border-t border-stone-100 flex justify-between items-center bg-stone-50/50 -mx-8 md:-mx-16 p-8 md:px-16">
                        <div className="flex items-center gap-4">
                            <Shield className="text-emerald-600" size={24} />
                            <p className="text-xs text-stone-400 max-w-xs leading-relaxed uppercase font-bold tracking-widest">Contact botanical support for identity verification updates.</p>
                        </div>
                        <button className="px-8 py-3 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all">Support Desk</button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "notif" && (
                  <motion.div 
                    key="notif"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <h3 className="text-3xl font-serif text-stone-900 mb-8 tracking-tight">Communication</h3>
                    
                    <div className="bg-stone-50 rounded-[2.5rem] p-10 border border-stone-100 flex items-center justify-between group">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl border border-stone-50 group-hover:rotate-6 transition-transform">
                             <Bell size={28} />
                          </div>
                          <div>
                             <p className="text-xl font-serif text-stone-900">Email Alerts</p>
                             <p className="text-sm text-stone-400 font-light mt-1">Updates regarding your activity and transactions.</p>
                          </div>
                       </div>
                       
                       <div 
                          onClick={() => setNotifications(!notifications)}
                          className={`w-16 h-9 flex items-center rounded-full px-1.5 cursor-pointer transition-all duration-500 ${notifications ? 'bg-emerald-600 shadow-lg shadow-emerald-200' : 'bg-stone-300'}`}
                       >
                          <motion.div 
                            layout
                            className="bg-white w-6 h-6 rounded-full shadow-sm"
                            animate={{ x: notifications ? 28 : 0 }}
                          />
                       </div>
                    </div>

                    <div className="flex justify-end gap-6 pt-10">
                      <button className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Discard</button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => alert("Archive updated. ✅")}
                        className="bg-stone-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 hover:bg-emerald-800 transition-all"
                      >
                        <Zap size={16} className="text-emerald-400" /> Save Preferences
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      </main>
      
      
      <Footer />
    </div>
  )
}

export default SellerProfile