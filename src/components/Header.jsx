import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, User, X, ShoppingBag, Store, Menu, MessageCircle,
  Gavel, History as HistoryIcon, Info, LifeBuoy, Leaf, ArrowLeft, ChevronRight
} from "lucide-react" 

const Header = () => {
  const [open, setOpen] = useState(false) 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) 
  const [hoverProfile, setHoverProfile] = useState(false)
  const [step, setStep] = useState("role")
  const [user, setUser] = useState(null)
  const modalRef = useRef(null)
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" })

  useEffect(() => {
    const seller = localStorage.getItem("seller")
    const buyer = localStorage.getItem("buyer")
    if (seller) setUser({ data: JSON.parse(seller), role: "seller" })
    else if (buyer) setUser({ data: JSON.parse(buyer), role: "buyer" })
  }, [])

  useEffect(() => {
    if (open && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.9, opacity: 0, y: 30 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
      )
    }
  }, [open])

  const handleSignup = async (role) => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const endpoint = role === "seller" ? "/seller/signup" : "/buyer/signup"
      const res = await axios.post(`https://nursreyhubbackend.vercel.app${endpoint}`, form)
      localStorage.setItem(role, JSON.stringify(res.data.user))
      setUser({ data: res.data.user, role: role })
      setOpen(false)
      setIsMobileMenuOpen(false)
      navigate("/")
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed")
    }
  }

  const renderAvatar = () => {
    if (user?.data?.avatar) {
      return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: user.data.avatar }} />
    }
    return <User size={18} className="text-emerald-800" />
  }

  const NavLink = ({ label, icon: Icon, onClick, mobile }) => (
    <button 
      onClick={onClick} 
      className={`${mobile ? 'flex w-full justify-between items-center py-5 px-6 hover:bg-emerald-600/5 transition-all duration-300 first:rounded-t-3xl' : 'group relative hidden lg:flex items-center gap-2 px-5 py-2 rounded-full text-stone-600 transition-all duration-500 overflow-hidden'}`}
    >
      <span className={`${mobile ? 'font-black text-stone-900 uppercase tracking-[0.2em] text-[11px]' : 'relative z-10 group-hover:-translate-y-10 transition-transform duration-500 block font-bold text-[10px] uppercase tracking-widest'}`}>
        {label}
      </span>
      {mobile ? <Icon size={18} className="text-emerald-700" /> : (
        <span className="absolute inset-0 flex items-center justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500 text-emerald-600 bg-emerald-50/50">
          <Icon size={16} />
        </span>
      )}
    </button>
  );

  return (
    <>
      <nav className="fixed w-full top-0 z-[100] transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-lg shadow-emerald-200">
                  <Leaf size={20} />
              </div>
              <h1 className="text-xl font-serif font-black text-stone-900 tracking-tighter uppercase leading-none">
                Nursery<span className="italic text-emerald-600">Hub</span>
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <NavLink label="Archive" icon={ShoppingBag} onClick={() => navigate("/products")} />
              <NavLink label="About" icon={Info} onClick={() => navigate("/about")} />
              <NavLink label="Support" icon={LifeBuoy} onClick={() => navigate("/support")} />
              <NavLink label="Chat" icon={MessageCircle} onClick={() => navigate("/chat")} />
              <NavLink label="Profile" icon={User} onClick={() => navigate("/seller/profile")} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              {user?.data && (
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  className="p-2.5 rounded-2xl hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 transition-all" 
                  onClick={() => navigate("/chat")}
                >
                  <MessageCircle size={22} />
                </motion.button>
              )}

              {user?.role === "seller" && (
                <>
                  <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-stone-200" onClick={() => navigate("/view-bids")}>
                    <Gavel size={14} className="text-emerald-400" /> Bids Received
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer p-2.5 rounded-2xl hover:bg-emerald-50 text-stone-600" onClick={() => navigate("/seller/dashboard")}>
                    <LayoutDashboard size={22} />
                  </motion.div>
                </>
              )}
              {user?.data && (
                 <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 rounded-2xl hover:bg-stone-100 text-stone-600" onClick={() => navigate("/history")}>
                   <HistoryIcon size={22} />
                 </motion.button>
              )}
            </div>

            {user?.data ? (
              <div className="relative hidden lg:block" onMouseEnter={() => setHoverProfile(true)} onMouseLeave={() => setHoverProfile(false)}>
                 <motion.div onClick={() => navigate("/seller/profile")} className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-100 bg-emerald-50 flex items-center justify-center cursor-pointer shadow-md">
                    {renderAvatar()}
                 </motion.div>
                 <AnimatePresence>
                   {hoverProfile && (
                     <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-14 bg-white border border-stone-100 p-6 rounded-[2rem] shadow-2xl min-w-[260px] z-50 pointer-events-none">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">{renderAvatar()}</div>
                           <div><p className="font-bold text-stone-900 text-sm leading-none mb-1">{user.data.name}</p><p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">@{user.data.username}</p></div>
                        </div>
                        <div className="pt-4 border-t border-stone-50 flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{user.role}</span><ChevronRight size={14} className="text-stone-300" /></div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setStep("role"); setOpen(true); }} className="hidden lg:block bg-stone-900 text-white px-8 py-3 rounded-full shadow-xl font-bold text-[10px] uppercase tracking-[0.2em]">
                Join Studio
              </motion.button>
            )}

            <button 
              className="lg:hidden p-2 text-stone-900 hover:bg-stone-100 rounded-xl transition-all active:scale-90"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 top-20 bg-stone-900/20 backdrop-blur-sm z-80 lg:hidden"
              />
              <motion.div 
                initial={{ scaleY: 0, opacity: 0 }} 
                animate={{ scaleY: 1, opacity: 1 }} 
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ originY: 0 }}
                className="fixed inset-x-0 top-20 bg-white/80 backdrop-blur-2xl z-[90] lg:hidden border-b border-stone-100 shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="p-4 space-y-1">
                  <NavLink mobile label="Archive" icon={ShoppingBag} onClick={() => {navigate("/products"); setIsMobileMenuOpen(false);}} />
                  <NavLink mobile label="About" icon={Info} onClick={() => {navigate("/about"); setIsMobileMenuOpen(false);}} />
                  <NavLink mobile label="Support" icon={LifeBuoy} onClick={() => {navigate("/support"); setIsMobileMenuOpen(false);}} />
                  <NavLink mobile label="Chat" icon={MessageCircle} onClick={() => {navigate("/chat"); setIsMobileMenuOpen(false);}} />
                  <NavLink mobile label="Profile" icon={User} onClick={() => {navigate("/seller/profile"); setIsMobileMenuOpen(false);}} />
                  
                  {user?.data && (
                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-1">
                      <div className="px-6 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">Member Space</div>
                      {user?.role === "seller" && <NavLink mobile label="Studio Dashboard" icon={LayoutDashboard} onClick={() => {navigate("/seller/dashboard"); setIsMobileMenuOpen(false);}} />}
                      <NavLink mobile label="Activity History" icon={HistoryIcon} onClick={() => {navigate("/history"); setIsMobileMenuOpen(false);}} />
                      {user?.role === "seller" && <NavLink mobile label="Bids Received" icon={Gavel} onClick={() => {navigate("/view-bids"); setIsMobileMenuOpen(false);}} />}
                    </div>
                  )}

                  {!user?.data && (
                    <div className="p-6 pt-8">
                      <button 
                        onClick={() => { setStep("role"); setOpen(true); setIsMobileMenuOpen(false); }} 
                        className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl"
                      >
                        Initialize Studio Account
                      </button>
                    </div>
                  )}

                  {user?.data && (
                    <div className="px-6 pb-8 pt-4">
                      <button 
                        onClick={() => { localStorage.clear(); window.location.reload(); }}
                        className="flex items-center gap-3 w-full py-4 text-red-500 font-black uppercase tracking-[0.3em] text-[10px]"
                      >
                        Terminate Session <ArrowLeft size={14} className="rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <div ref={modalRef} className="bg-white rounded-[3rem] p-10 md:p-14 w-full max-w-md shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpen(false)} className="absolute top-8 right-8 p-2 bg-stone-50 rounded-full text-stone-400 hover:text-red-500 transition-colors"><X size={20} /></button>
              {step === "role" ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] mx-auto flex items-center justify-center text-4xl mb-8">🌿</div>
                  <h2 className="text-3xl font-serif font-black text-stone-900 mb-2">The Greenhouse</h2>
                  <p className="text-stone-400 text-sm mb-12">Select access level to the archive.</p>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-center gap-3 bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-emerald-800 shadow-lg" onClick={() => setStep("seller")}><Store size={20} /> Curator Access</button>
                    <button className="w-full flex items-center justify-center gap-3 bg-stone-50 border border-stone-200 text-stone-700 py-5 rounded-2xl font-bold hover:border-stone-900 transition-all" onClick={() => setStep("buyer")}><ShoppingBag size={20} /> Collector Access</button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <button onClick={() => setStep("role")} className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
                  <h2 className="text-4xl font-serif font-black text-stone-900 capitalize mb-8">Register</h2>
                  <div className="space-y-4">
                    {["name", "email", "mobile", "password"].map((field) => (
                      <input key={field} type={field === "password" ? "password" : "text"} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:border-emerald-500 outline-none" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                    ))}
                  </div>
                  <button onClick={() => handleSignup(step)} className="w-full bg-emerald-600 text-white py-5 rounded-2xl mt-10 font-black uppercase tracking-widest text-xs">Open Account</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header