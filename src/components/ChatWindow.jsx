import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Send, Video, Search, MoreVertical, ArrowLeft, Trash2, CreditCard, Smartphone, CheckCircle, Loader, ShieldCheck } from "lucide-react"; 
import VideoCall from "./VideoCall";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- COMPONENT: REALISTIC PAYMENT MODAL ---
const PaymentModal = ({ bidId, onClose, onSuccess }) => {
  const [step, setStep] = useState("select"); // select | processing | success
  const [method, setMethod] = useState("UPI");
  const [amount, setAmount] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // 1. Fetch Amount on Open
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`https://nursreyhubbackend.vercel.app/payment/bid-details/${bidId}`);
        setAmount(res.data.bidAmount);
        setLoadingDetails(false);
      } catch (err) {
        alert("Could not fetch payment details.");
        onClose();
      }
    };
    fetchDetails();
  }, [bidId, onClose]);

  // 2. Handle Payment Logic
  const handlePay = async () => {
    setStep("processing");
    
    // Simulate Bank Delay (2 seconds)
    setTimeout(async () => {
      try {
        await axios.post("https://nursreyhubbackend.vercel.app/payment/complete", {
          bidId,
          method
        });
        setStep("success");
        // Close automatically after success
        setTimeout(() => {
          onSuccess();
        }, 2500);
      } catch (err) {
        alert("Payment Failed");
        setStep("select");
      }
    }, 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* HEADER */}
        <div className="bg-stone-50 p-4 flex justify-between items-center border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Secure Gateway</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full text-stone-400">
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {loadingDetails ? (
            <div className="flex justify-center py-8"><Loader className="animate-spin text-emerald-600" /></div>
          ) : step === "success" ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-stone-800">₹{amount}</h3>
              <p className="text-emerald-600 font-medium">Payment Successful</p>
              <p className="text-xs text-stone-400 mt-2">Transaction ID: {bidId.slice(-8).toUpperCase()}</p>
            </motion.div>
          ) : step === "processing" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-stone-800">Processing Payment...</h3>
              <p className="text-sm text-stone-500">Do not close this window</p>
            </div>
          ) : (
            <>
              {/* AMOUNT DISPLAY */}
              <div className="text-center mb-8">
                <p className="text-stone-500 text-sm mb-1">Total Payable</p>
                <h2 className="text-4xl font-serif font-bold text-stone-900">₹{amount}</h2>
              </div>

              {/* METHODS */}
              <div className="space-y-3 mb-6">
                <div 
                  onClick={() => setMethod("UPI")}
                  className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${method === "UPI" ? "border-emerald-500 bg-emerald-50/50" : "border-stone-100 hover:border-stone-200"}`}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm"><Smartphone size={20} /></div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-800 text-sm">UPI / GPay</p>
                    <p className="text-xs text-stone-400">Instant Transfer</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === "UPI" ? "border-emerald-500" : "border-stone-300"}`}>
                    {method === "UPI" && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                  </div>
                </div>

                <div 
                  onClick={() => setMethod("CARD")}
                  className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${method === "CARD" ? "border-emerald-500 bg-emerald-50/50" : "border-stone-100 hover:border-stone-200"}`}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm"><CreditCard size={20} /></div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-800 text-sm">Card Payment</p>
                    <p className="text-xs text-stone-400">Credit / Debit</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === "CARD" ? "border-emerald-500" : "border-stone-300"}`}>
                    {method === "CARD" && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                  </div>
                </div>

                <div 
                  onClick={() => setMethod("COD")}
                  className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${method === "COD" ? "border-emerald-500 bg-emerald-50/50" : "border-stone-100 hover:border-stone-200"}`}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm">💵</div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-stone-400">Pay on arrival</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === "COD" ? "border-emerald-500" : "border-stone-300"}`}>
                    {method === "COD" && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                  </div>
                </div>
              </div>

              {/* PAY BUTTON */}
              <button 
                onClick={handlePay}
                className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Pay ₹{amount}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};


// --- MAIN CHAT WINDOW ---
const ChatWindow = ({ onClose, currentUserId }) => {
  const [chats, setChats] = useState([]); 
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Payment Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(null);

  const scrollRef = useRef();
  const navigate = useNavigate(); 

  // 1. Fetch Chat List
  useEffect(() => {
    fetchChatList();
  }, [currentUserId]);

  // 2. Poll Messages
  useEffect(() => {
    let interval;
    if (activeChat) {
      fetchMessages(activeChat._id);
      interval = setInterval(() => {
        fetchMessages(activeChat._id);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  // 3. Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatList = async () => {
    try {
      const res = await axios.get(`https://nursreyhubbackend.vercel.app/chat/list/${currentUserId}`);
      setChats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`https://nursreyhubbackend.vercel.app/chat/${chatId}?userId=${currentUserId}`);
      setMessages(res.data.messages);
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await axios.post("https://nursreyhubbackend.vercel.app/chat/send", {
        chatId: activeChat._id,
        senderId: currentUserId,
        text: newMessage
      });
      setNewMessage("");
      fetchMessages(activeChat._id);
    } catch (err) { console.error(err); }
  };

  const handleClearChat = async () => {
    if (!activeChat) return;
    if (!window.confirm("Clear this chat for yourself?")) return;

    try {
      await axios.post("https://nursreyhubbackend.vercel.app/chat/clear", {
        chatId: activeChat._id,
        userId: currentUserId
      });
      setMessages([]);
      setShowMenu(false);
    } catch (err) { alert("Error clearing chat"); }
  };

  // --- NEW: HANDLE PAYMENT CLICK ---
  const handlePaymentClick = (bidIdFromUrl) => {
    // Prevent opening if already paid (Logic check via message content)
    const isAlreadyPaid = messages.some(m => 
      m.type === 'auto' && m.text.includes("Payment Successful")
    );

    if (isAlreadyPaid) {
      alert("Payment already completed for this product.");
      return;
    }

    if (bidIdFromUrl) {
      setSelectedBidId(bidIdFromUrl);
      setShowPayment(true);
    } else {
      alert("Invalid Payment Link");
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Refresh messages to show the confirmation text
    if (activeChat) fetchMessages(activeChat._id);
  };

  const renderMessageContent = (text) => {
    // Regex for markdown links: [Label](URL)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
    const match = text.match(linkRegex);

    if (match) {
      const [fullMatch, label, url] = match;
      const parts = text.split(fullMatch); 
      
      // Extract bidId from URL pattern: /payment/BIDID
      const urlParts = url.split("/");
      const bidId = urlParts[urlParts.length - 1];

      // Check if any auto message exists that confirms success for this specific product
      const isAlreadyPaid = messages.some(m => 
        m.type === 'auto' && 
        m.text.includes("Payment Successful") && 
        m.text.includes(activeChat?.productName || "")
      );

      return (
        <span>
          {parts[0]}
          <br />
          <button
            disabled={isAlreadyPaid}
            onClick={() => !isAlreadyPaid && handlePaymentClick(bidId)}
            className={`mt-3 font-bold py-3 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all w-full border ${
              isAlreadyPaid 
              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed shadow-none" 
              : "bg-stone-900 hover:bg-black text-white active:scale-95 shadow-stone-900/20 border-stone-700"
            }`}
          >
            {isAlreadyPaid ? (
               <><CheckCircle size={18} /> Payment Completed</>
            ) : (
               <><CreditCard size={18} /> {label}</>
            )}
          </button>
          {parts[1]}
        </span>
      );
    }
    return text;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" 
        onClick={onClose}
      ></motion.div>

      {/* MODALS */}
      {isVideoCallActive && <VideoCall onClose={() => setIsVideoCallActive(false)} />}
      
      {/* ✅ PAYMENT MODAL */}
      <AnimatePresence>
        {showPayment && selectedBidId && (
          <PaymentModal 
            bidId={selectedBidId} 
            onClose={() => setShowPayment(false)} 
            onSuccess={handlePaymentSuccess} 
          />
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-6xl h-[90vh] bg-stone-50 rounded-[2.5rem] shadow-2xl shadow-stone-900/20 overflow-hidden flex flex-col md:flex-row border border-white/50"
      >
        
        {/* --- LEFT SIDE: SIDEBAR --- */}
        <div className={`w-full md:w-[350px] lg:w-[400px] bg-white border-r border-stone-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 bg-white border-b border-stone-100 flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Messages</h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"><X size={20} /></button>
          </div>

          <div className="p-4 border-b border-stone-50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 placeholder-stone-400"
              />
              <Search className="absolute left-3.5 top-3.5 text-stone-400" size={18} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-stone-400 text-sm gap-2">
                <span className="text-4xl opacity-20">📭</span>
                No chats found.
              </div>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 mx-2 mt-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all ${
                    activeChat?._id === chat._id 
                    ? "bg-emerald-50/50 border border-emerald-100 shadow-sm" 
                    : "hover:bg-stone-50 border border-transparent"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200 shadow-sm">
                    {chat.otherUser?.avatar ? (
                      <div dangerouslySetInnerHTML={{ __html: chat.otherUser.avatar }} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-stone-400 bg-white">
                        {chat.otherUser?.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`font-bold truncate ${activeChat?._id === chat._id ? 'text-emerald-900' : 'text-stone-700'}`}>
                        {chat.otherUser?.name || "User"}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-medium">{new Date(chat.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-stone-500 truncate">{chat.messages[chat.messages.length - 1]?.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT SIDE: CHAT AREA --- */}
        <div className={`w-full flex-1 bg-stone-100/50 flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 bg-stone-50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-stone-200/50 border border-stone-100">
                 <span className="text-4xl opacity-80">💬</span>
              </div>
              <p className="font-serif text-lg text-stone-600">Select a chat to start messaging</p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="bg-white/80 backdrop-blur-md p-4 px-6 flex items-center justify-between shadow-sm z-10 border-b border-stone-200">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full">
                    <ArrowLeft size={20} />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 overflow-hidden shadow-sm">
                     {activeChat.otherUser?.avatar ? (
                        <div dangerouslySetInnerHTML={{ __html: activeChat.otherUser.avatar }} className="w-full h-full" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-stone-400">?</div>
                     )}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 leading-tight">{activeChat.otherUser?.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                       <p className="text-xs text-stone-500 font-medium">Re: {activeChat.productName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={() => setIsVideoCallActive(true)} 
                    className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-100 shadow-sm"
                  >
                    <Video size={20} />
                  </button>

                  <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2.5 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-12 w-48 bg-white shadow-xl shadow-stone-200/50 rounded-xl border border-stone-100 py-1 z-50 overflow-hidden">
                         <button onClick={handleClearChat} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                           <Trash2 size={16} /> Clear Conversation
                         </button>
                      </div>
                    )}
                  </div>
                  <button onClick={onClose} className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-full text-stone-400 transition-colors ml-2">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-100">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div 
                        className={`max-w-[75%] p-4 px-5 rounded-2xl text-sm shadow-sm relative leading-relaxed ${
                          isMe 
                          ? "bg-emerald-600 text-white rounded-br-none shadow-emerald-900/10" 
                          : "bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-stone-200/50"
                        } ${msg.type === 'auto' ? "bg-amber-50 border border-amber-100 text-amber-800 w-full text-center max-w-lg mx-auto rounded-xl py-2 italic" : ""}`}
                      >
                        {/* RENDER CONTENT WITH LINK CHECK */}
                        <div className="break-words">
                          {renderMessageContent(msg.text)}
                        </div>
                        
                        <span className={`text-[10px] block text-right mt-2 font-medium ${isMe ? "text-emerald-100/80" : "text-stone-300"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* INPUT */}
              <div className="bg-white p-4 border-t border-stone-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 rounded-full px-6 py-3.5 shadow-inner transition-all text-stone-800 placeholder-stone-400"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-stone-900 hover:bg-black disabled:bg-stone-300 disabled:cursor-not-allowed text-white p-3.5 rounded-full shadow-lg transition-transform transform active:scale-95 flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatWindow;