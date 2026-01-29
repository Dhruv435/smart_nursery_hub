import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Video, Search, ArrowLeft, Loader, CreditCard, Smartphone, CheckCircle, ShieldCheck, X } from "lucide-react";
import Header from "../components/Header";
import VideoCall from "../components/VideoCall";

// --- PAYMENT MODAL COMPONENT ---
const PaymentModal = ({ bidId, onClose, onSuccess }) => {
  const [step, setStep] = useState("select"); // select | processing | success
  const [method, setMethod] = useState("UPI");
  const [amount, setAmount] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/payment/bid-details/${bidId}`);
        setAmount(res.data.bidAmount);
        setLoadingDetails(false);
      } catch (err) {
        alert("Could not fetch payment details.");
        onClose();
      }
    };
    fetchDetails();
  }, [bidId, onClose]);

  const handlePay = async () => {
    setStep("processing");
    
    setTimeout(async () => {
      try {
        await axios.post("http://localhost:5050/payment/complete", {
          bidId,
          method
        });
        setStep("success");
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
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="bg-stone-50 p-4 flex justify-between items-center border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Secure Gateway</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full text-stone-400">
            <X size={18} />
          </button>
        </div>

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
              <div className="text-center mb-8">
                <p className="text-stone-500 text-sm mb-1">Total Payable</p>
                <h2 className="text-4xl font-serif font-bold text-stone-900">₹{amount}</h2>
              </div>

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

// --- MAIN CHAT PAGE ---
const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(null);
  
  const scrollRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller"));
    const buyer = JSON.parse(localStorage.getItem("buyer"));
    const user = seller || buyer;

    if (!user) {
      navigate("/");
      return;
    }
    setCurrentUser(user);
    
    const initChat = async () => {
      await fetchChatList(user._id);

      if (location.state?.chatId) {
        fetchSingleChat(location.state.chatId, user._id);
      }
    };
    
    initChat();
  }, [navigate, location.state]);

  // --- 2. POLL FOR NEW MESSAGES & CHAT LIST ---
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      fetchChatList(currentUser._id, false);

      if (activeChat) {
        refreshMessages(activeChat._id);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeChat, currentUser]);

  // --- 3. AUTO SCROLL ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- API FUNCTIONS ---
  const fetchChatList = async (userId, showLoading = true) => {
    try {
      if(showLoading) setLoading(true);
      const res = await axios.get(`http://localhost:5050/chat/list/${userId}`);
      setChats(res.data);
      if(showLoading) setLoading(false);
    } catch (err) {
      console.error("Error fetching list:", err);
      if(showLoading) setLoading(false);
    }
  };

  const fetchSingleChat = async (chatId) => {
    try {
      const res = await axios.get(`http://localhost:5050/chat/${chatId}?userId=${currentUser._id}`);
      const chatData = res.data;
      
      const fullChatObj = {
        ...chatData,
        otherUser: chatData.otherUser || { name: "Chat User", avatar: null } 
      };

      setActiveChat(fullChatObj);
      setMessages(chatData.messages || []);
    } catch (err) { 
      console.error(err); 
    }
  };

  const refreshMessages = async (chatId) => {
    try {
      const res = await axios.get(`http://localhost:5050/chat/${chatId}?userId=${currentUser._id}`);
      if (res.data.messages.length !== messages.length) {
        setMessages(res.data.messages);
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMsg = {
        senderId: currentUser._id,
        text: newMessage,
        timestamp: new Date().toISOString(),
        _id: "temp-" + Date.now()
    };
    setMessages([...messages, tempMsg]);
    setNewMessage("");

    try {
      await axios.post("http://localhost:5050/chat/send", {
        chatId: activeChat._id,
        senderId: currentUser._id,
        text: tempMsg.text
      });
      refreshMessages(activeChat._id);
    } catch (err) { 
      console.error(err); 
    }
  };

  // --- PAYMENT LINK HANDLER ---
  const handlePaymentClick = (bidIdFromUrl) => {
    if (bidIdFromUrl) {
      setSelectedBidId(bidIdFromUrl);
      setShowPayment(true);
    } else {
      alert("Invalid Payment Link");
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    if (activeChat) {
      refreshMessages(activeChat._id);
    }
  };

  // --- RENDER MESSAGE WITH PAYMENT LINK DETECTION ---
  const renderMessageContent = (msg) => {
    const text = msg.text;
    
    // Detect markdown link pattern: [Label](URL)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
    const match = text.match(linkRegex);

    if (match && msg.type === "auto") {
      const [fullMatch, label, url] = match;
      const parts = text.split(fullMatch);
      
      // Extract bidId from URL
      const urlParts = url.split("/");
      const bidId = urlParts[urlParts.length - 1];

      return (
        <div className="text-center">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: parts[0]
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            }} 
            className="mb-3"
          />
          <button
            onClick={() => handlePaymentClick(bidId)}
            className="bg-stone-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 mx-auto border border-stone-700"
          >
            <CreditCard size={18} /> {label}
          </button>
          {parts[1] && <div className="mt-2">{parts[1]}</div>}
        </div>
      );
    }

    // Regular auto message with bold support
    if (msg.type === "auto") {
      return (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          }} 
        />
      );
    }

    // Regular text message
    return <p>{text}</p>;
  };

  // Filter chats
  const filteredChats = chats.filter(chat => 
    chat.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) return null;

  return (
    <div className="h-screen flex flex-col bg-stone-50 font-sans overflow-hidden">
      <Header />
      
      {/* Video Call Modal */}
      {isVideoCallActive && <VideoCall onClose={() => setIsVideoCallActive(false)} />}

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedBidId && (
          <PaymentModal 
            bidId={selectedBidId} 
            onClose={() => setShowPayment(false)} 
            onSuccess={handlePaymentSuccess} 
          />
        )}
      </AnimatePresence>

      <div className="flex-grow flex pt-20 h-full max-w-[1600px] mx-auto w-full">
        
        {/* --- LEFT SIDE: CHAT LIST --- */}
        <div className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-stone-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          
          <div className="p-6 pb-4 border-b border-stone-50">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <button onClick={() => navigate("/")} className="p-2 -ml-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-800 transition-colors">
                     <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">Messages</h2>
               </div>
               <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-sm">
                  {currentUser.name[0]}
               </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or product..." 
                className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl text-sm border border-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 placeholder-stone-400"
              />
              <Search className="absolute left-4 top-3.5 text-stone-400" size={18} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader className="animate-spin text-emerald-600" />
                </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-stone-400 text-sm gap-2">
                 <span className="text-3xl mb-2">📭</span>
                 <p>{searchQuery ? "No matches found." : "No active conversations."}</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div 
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 mx-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all mb-1 ${
                     activeChat?._id === chat._id 
                     ? "bg-emerald-50/50 border border-emerald-100 shadow-sm" 
                     : "hover:bg-stone-50 border border-transparent"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {chat.otherUser?.avatar ? (
                      <div dangerouslySetInnerHTML={{ __html: chat.otherUser.avatar }} className="w-full h-full" />
                    ) : (
                      <span className="text-lg font-bold text-stone-400">{chat.otherUser?.name?.[0] || "?"}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`font-bold truncate ${activeChat?._id === chat._id ? 'text-emerald-900' : 'text-stone-700'}`}>
                        {chat.otherUser?.name || "User"}
                      </h3>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {chat.lastUpdated ? new Date(chat.lastUpdated).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {chat.productName && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                            {chat.productName}
                        </span>
                      )}
                      <p className="text-sm text-stone-500 truncate flex-1">
                         {chat.messages?.[chat.messages.length - 1]?.text || "No messages"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT SIDE: ACTIVE CHAT --- */}
        <div className={`w-full md:flex-1 bg-stone-50 flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-stone-50">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-stone-200/50 border border-stone-100">
                 <span className="text-5xl opacity-80">💬</span>
              </div>
              <h3 className="text-3xl font-serif font-bold text-stone-800 mb-2">Your Messages</h3>
              <p className="text-stone-500 max-w-sm">Select a conversation to start chatting.</p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="bg-white/80 backdrop-blur-md p-4 px-6 border-b border-stone-100 flex items-center justify-between z-10 sticky top-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-50 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
                     {activeChat.otherUser?.avatar ? (
                        <div dangerouslySetInnerHTML={{ __html: activeChat.otherUser.avatar }} className="w-full h-full" />
                     ) : (
                        <span className="font-bold text-stone-400">{activeChat.otherUser?.name?.[0]}</span>
                     )}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 leading-tight">{activeChat.otherUser?.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       {activeChat.productName && (
                         <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                           {activeChat.productName}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVideoCallActive(true)} 
                  className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full border border-emerald-100 transition-colors"
                >
                   <Video size={20} />
                </button>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-stone-100">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUser._id;
                  
                  // System/Auto Messages
                  if (msg.type === "auto") {
                    return (
                        <div key={index} className="flex justify-center my-4">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-amber-50 border border-amber-200 text-stone-800 text-sm px-5 py-3 rounded-xl text-center shadow-sm max-w-md"
                            >
                                {renderMessageContent(msg)}
                                <span className="block text-[10px] text-stone-400 mt-2">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </motion.div>
                        </div>
                    );
                  }

                  // Regular Messages
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] p-4 px-5 rounded-2xl text-sm shadow-sm relative leading-relaxed ${
                        isMe 
                        ? "bg-emerald-600 text-white rounded-br-none shadow-emerald-900/10" 
                        : "bg-white text-stone-800 rounded-bl-none border border-stone-200 shadow-stone-200/50"
                      }`}>
                        <p className="break-words">{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1.5 font-medium ${isMe ? "text-emerald-100/80" : "text-stone-300"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* INPUT */}
              <div className="bg-white p-4 border-t border-stone-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
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
                    className="bg-stone-900 hover:bg-black disabled:bg-stone-300 disabled:cursor-not-allowed text-white p-3.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;