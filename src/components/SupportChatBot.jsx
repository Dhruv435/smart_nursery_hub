import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Droplet, Leaf, Sun, Zap, HelpCircle, 
  User, Key, Trash2, Sprout, Sparkles, ShieldCheck, Info 
} from "lucide-react"; 

const getCurrentUser = () => {
  const seller = JSON.parse(localStorage.getItem("seller"));
  const buyer = JSON.parse(localStorage.getItem("buyer"));
  return seller || buyer || {};
};

export default function SupportChatBot({ onBackToFAQ }) {
  const [currentStep, setCurrentStep] = useState("START");
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMode, setInputMode] = useState(null);
  const [formData, setFormData] = useState({});

  const currentUser = getCurrentUser();

  const CHAT_FLOW = {
    START: {
      message: `Greetings ${currentUser.name || "Collector"}, welcome to the NurseryHub Support Terminal. How may we assist your botanical journey today?`,
      options: [
        { text: "Plant Care", next: "PLANT_TYPE", icon: Leaf },
        { text: "Logistics", next: "ORDER_ISSUE", icon: Zap },
        { text: "Account Sync", next: "ACCOUNT_ISSUE", icon: User },
      ],
    },
    PLANT_TYPE: {
        message: "Specimen classification identified. Which environment does your plant reside in?",
        options: [
          { text: "Indoor Archive", next: "INDOOR_PROBLEM", icon: Sun },
          { text: "Outdoor Terrain", next: "OUTDOOR_PROBLEM", icon: Droplet }, 
        ],
    },
    INDOOR_PROBLEM: {
        message: "Specify the biological irregularity you are observing:",
        options: [
          { text: "Foliage Discoloration", next: "INDOOR_LEAVES", icon: Leaf },
          { text: "Hydration Balance", next: "INDOOR_WATER", icon: Droplet }, 
          { text: "Growth Stagnation", next: "INDOOR_GROWTH", icon: Zap },
        ],
    },
    OUTDOOR_PROBLEM: {
        message: "Identify the primary environmental stressor:",
        options: [
          { text: "Leaf Degradation", next: "OUTDOOR_LEAVES", icon: Leaf },
          { text: "Solar / Pest Stress", next: "OUTDOOR_PEST", icon: Sun },
          { text: "Soil Saturation", next: "OUTDOOR_WATER", icon: Droplet }, 
        ],
    },
    INDOOR_WATER: {
        message: (
          <div className="space-y-4">
            <h4 className="font-serif text-xl text-emerald-800 flex items-center gap-2 italic">Protocol: Hydration Control</h4>
            <p className="text-sm font-light leading-relaxed">Ensure the vessel features adequate drainage. Calibrate watering cycles to trigger only when the top 2-inches of substrate are desiccated.</p>
          </div>
        ),
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    INDOOR_LEAVES: {
        message: "Chlorosis (yellowing) typically indicates hydration surplus. Necrotic (brown) tips suggest humidity deficiency below 40%.",
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    INDOOR_GROWTH: {
        message: "Metabolic stagnation requires increased lux (light) intensity or a vessel expansion to allow root-ball proliferation.",
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    OUTDOOR_WATER: {
        message: "Trigger deep-root hydration during early solar hours (6am-9am) to prevent biological fungal growth.",
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    OUTDOOR_LEAVES: {
        message: "Check for solar-scorch or wind-burn. Precision pruning of dead foliage is required to redirect biological energy.",
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    OUTDOOR_PEST: {
        message: "Deploy organic Neem-distillate spray for common infestation management. Ensure zero application during peak sunlight.",
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    ORDER_ISSUE: {
        message: "Archive synchronization required. Please provide your Tracking ID or check your registered manuscript for updates.",
        options: [{ text: "Reset Terminal", next: "START", icon: HelpCircle }],
    },
    ACCOUNT_ISSUE: {
      message: "Security Protocol Active. Select the account modification required:",
      options: [
        { text: "Identity Details", action: "FETCH_DETAILS", icon: User },
        { text: "Access Recovery", action: "RECOVER_PASSWORD", icon: Key },
        { text: "De-Archive Account", action: "DELETE_ACCOUNT", icon: Trash2 },
      ],
    },
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if(history.length > 0) scrollToBottom(); }, [history, isTyping]);
  useEffect(() => { handleBotMessage("START"); }, []);

  const handleBotMessage = (stepKey, customContent = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const content = customContent || CHAT_FLOW[stepKey].message;
      setHistory((prev) => [...prev, { sender: "bot", content: content, step: stepKey }]);
      setCurrentStep(stepKey);
    }, 1200); 
  };

  const handleUserSelection = async (option) => {
    setHistory((prev) => [...prev, { sender: "user", content: option.text }]);
    
    if (option.action === "FETCH_DETAILS") {
        if (!currentUser.username) {
            handleBotMessage("START", "Authentication failed. Please initialize login.");
            return;
        }
        setIsTyping(true);
        try {
            const res = await axios.post("https://nursreyhubbackend.vercel.app/api/user-details", { username: currentUser.username });
            const data = res.data;
            const detailsMsg = (
                <div className="w-full text-left space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 border-b border-stone-100 pb-2 flex items-center gap-2"><Sparkles size={14}/> Specimen Metadata</h4>
                    <div className="space-y-3 text-sm font-light">
                        <p className="flex justify-between border-b border-stone-50 pb-1"><span className="text-stone-400">Name</span> <span className="font-serif italic">{data.name}</span></p>
                        <p className="flex justify-between border-b border-stone-50 pb-1"><span className="text-stone-400">Alias</span> <span>@{data.username}</span></p>
                        <p className="flex justify-between border-b border-stone-50 pb-1"><span className="text-stone-400">Sync ID</span> <span className="text-[10px] font-mono">{data.email}</span></p>
                        <p className="flex justify-between"><span className="text-stone-400">Status</span> <span className="uppercase text-[9px] font-black bg-stone-900 text-white px-2 py-0.5 rounded-full">{data.role}</span></p>
                    </div>
                </div>
            );
            handleBotMessage("START", detailsMsg);
        } catch (err) { handleBotMessage("START", "Synchronization error. Retrying..."); }
        return;
    }

    if (option.action === "RECOVER_PASSWORD") {
        handleBotMessage(null, "Initiating Access Recovery. Please provide identity validation markers (Name, Email, Mobile):");
        setInputMode("recover");
        setFormData({ name: "", email: "", mobile: "" });
        return;
    }

    if (option.action === "DELETE_ACCOUNT") {
        if (!currentUser.username) {
            handleBotMessage("START", "Login required for de-archiving.");
            return;
        }
        handleBotMessage(null, `CRITICAL: This will permanently delete collector "${currentUser.username}" from the database. Enter Access Key to proceed:`);
        setInputMode("delete");
        setFormData({ password: "" });
        return;
    }

    if (option.next === "START") {
        setIsTyping(true);
        setTimeout(() => { setHistory([]); handleBotMessage("START"); }, 500); 
    } else {
        handleBotMessage(option.next);
    }
  };

  const handleFormSubmit = async () => {
    setIsTyping(true); setInputMode(null);
    if (inputMode === "recover") {
        try {
            const res = await axios.post("https://nursreyhubbackend.vercel.app/api/recover-password", formData);
            if (res.data.success) handleBotMessage("START", `Identity Verified. ✅ Access Key retrieved: **${res.data.password}**`);
            else handleBotMessage("START", "❌ Verification Failed. Data mismatch identified.");
        } catch (err) { handleBotMessage("START", "Protocol error. Try again."); }
    }
    if (inputMode === "delete") {
        try {
            const res = await axios.post("https://nursreyhubbackend.vercel.app/api/delete-account", { username: currentUser.username, password: formData.password });
            if (res.data.success) {
                handleBotMessage("START", "✅ Account De-archived. Terminating session...");
                setTimeout(() => { localStorage.clear(); window.location.href = "/"; }, 3000);
            } else handleBotMessage("START", `❌ Failure: ${res.data.message}`);
        } catch (err) { handleBotMessage("START", "Protocol error."); }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#faf9f6] relative font-sans">
      
      {/* ==================== 1. STUDIO HEADER ==================== */}
      <div className="bg-white/80 backdrop-blur-xl px-8 py-6 flex items-center justify-between border-b border-stone-100 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onBackToFAQ} className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-all">
                <ChevronLeft size={20} />
            </button>
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <Sparkles className="text-emerald-600" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Live Assistant</span>
                </div>
                <h2 className="text-xl font-serif text-stone-900 italic">Botanical Terminal</h2>
            </div>
        </div>
        <div className="relative">
            <div className="w-10 h-10 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-stone-200">
                <Sprout size={20} />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* ==================== 2. DIALOGUE AREA ==================== */}
      <div className="flex-grow overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar">
        <AnimatePresence>
          {history.map((msg, index) => (
            msg.sender === "bot" ? (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
                        <Leaf size={14} />
                    </div>
                    <div className="bg-white p-6 rounded-[1.5rem] rounded-tl-none max-w-[85%] shadow-sm border border-stone-100 text-stone-700 text-sm leading-relaxed font-light">
                        {msg.content}
                    </div>
                </motion.div>
            ) : (
                <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end items-end">
                    <div className="bg-stone-900 text-white px-6 py-4 rounded-[1.5rem] rounded-br-none max-w-[80%] shadow-2xl text-sm leading-relaxed font-medium">
                        {msg.content}
                    </div>
                </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {isTyping && (
            <div className="flex justify-start items-center gap-4">
                 <div className="w-8 h-8 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-emerald-400 shrink-0">
                    <Leaf size={14} />
                </div>
                <div className="bg-white/50 backdrop-blur-sm px-6 py-4 rounded-full border border-stone-100">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-300"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ==================== 3. KINETIC ACTIONS ==================== */}
      <div className="p-6 bg-white border-t border-stone-100 z-20">
        
        {/* RECOVERY INTERFACE */}
        {inputMode === "recover" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-stone-50 p-6 rounded-[2rem] border border-stone-200">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-emerald-600" size={16} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">Archive Recovery</h4>
                </div>
                <div className="space-y-3">
                    {["name", "email", "mobile"].map((f) => (
                        <input key={f} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:outline-none focus:border-emerald-500 transition-all font-light" placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={formData[f]} onChange={(e) => setFormData({...formData, [f]: e.target.value})} />
                    ))}
                </div>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => setInputMode(null)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-stone-400">Abort</button>
                    <button onClick={handleFormSubmit} className="flex-1 bg-stone-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Synchronize</button>
                </div>
            </motion.div>
        )}

        {/* DELETE INTERFACE */}
        {inputMode === "delete" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-red-50 p-6 rounded-[2rem] border border-red-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-700 flex items-center gap-2"><Trash2 size={16}/> Warning Zone</h4>
                <input type="password" className="w-full border-b border-red-200 bg-transparent py-2 text-sm focus:outline-none focus:border-red-500" placeholder="Collector Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <div className="flex gap-4">
                    <button onClick={() => setInputMode(null)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-stone-400">Abort</button>
                    <button onClick={handleFormSubmit} className="flex-1 bg-red-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">De-Archive</button>
                </div>
            </motion.div>
        )}

        {/* QUICK REPLY CHIPS */}
        {!inputMode && !isTyping && CHAT_FLOW[currentStep]?.options && (
          <div className="flex flex-wrap justify-end gap-3 pb-4">
            {CHAT_FLOW[currentStep].options.map((option, index) => (
              <motion.button
                key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                onClick={() => handleUserSelection(option)}
                whileHover={{ scale: 1.05, y: -2 }}
                className="group bg-white border border-stone-100 text-stone-800 px-6 py-3 rounded-full shadow-sm hover:shadow-xl hover:bg-stone-900 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                {option.icon && <option.icon size={14} className="text-emerald-500 group-hover:text-white" />}
                {option.text}
              </motion.button>
            ))}
          </div>
        )}

        {(!CHAT_FLOW[currentStep]?.options || isTyping) && !inputMode && (
            <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                    {isTyping ? "Syncing Logic..." : "End of Manuscript"}
                </span>
            </div>
        )}
      </div>
    </div>
  );
}