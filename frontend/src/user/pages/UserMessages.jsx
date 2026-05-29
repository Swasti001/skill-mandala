import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import api, { getBackendBase, getWsUrl } from "../api";
import axios from "axios";
import { 
  Plus, Video, MoreVertical, 
  Send, Loader2, MessageSquare, ArrowLeft,
  CheckCircle2, Sparkles, MoreHorizontal,
  Lock, ShieldAlert, ExternalLink, CalendarPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../components/Avatar";

/**
 * UserMessages Component
 * Connects to Spring Boot backend to facilitate real-time skill-weaving communication.
 */
const UserMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const selectedConvRef = useRef(selectedConv);
    useEffect(() => {
        selectedConvRef.current = selectedConv;
    }, [selectedConv]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);
    const [error, setError] = useState(null);
    const { state } = useLocation();
    const { chatId } = useParams();
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const scrollRef = useRef();
    const fileInputRef = useRef();
    
    // Agreement Modal State
    const [agreementModal, setAgreementModal] = useState({ isOpen: false, type: 'set', direction: 'teach', amount: 5, subject: '' });
    const [actionLoading, setActionLoading] = useState(false);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const socketRef = useRef(null);

    // Fetch conversations list
    const fetchConversations = React.useCallback(async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/user/messages/conversations/${userId}`);
            const fetchedConvs = res.data || [];
            setConversations(fetchedConvs);

            if (chatId) {
                const target = fetchedConvs.find(c => c.id === parseInt(chatId));
                if (target) setSelectedConv(target);
            } else if (state?.autoSelectChatId) {
                const target = fetchedConvs.find(c => c.id === state.autoSelectChatId);
                if (target) setSelectedConv(target);
            } else if (state?.autoSelectUserId) {
                const target = fetchedConvs.find(c => c.otherUserId === state.autoSelectUserId);
                if (target) {
                    setSelectedConv(target);
                } else {
                    setSelectedConv({
                        id: null,
                        otherUserId: state.autoSelectUserId,
                        otherUserName: state.autoSelectUserName || "Skill Partner",
                        matched: true
                    });
                }
            }
        } catch (err) {
            console.error("Conversations fetch failed:", err);
            setError("Unable to synchronize your active chats.");
        } finally {
            setLoading(false);
        }
    }, [state, chatId, userId]);

    // Fetch messages for a specific conversation
    const fetchMessages = React.useCallback(async (convId) => {
        if (!convId || !userId) {
            setMessages([]);
            return;
        }
        setMsgLoading(true);
        try {
            const res = await api.get(`/user/messages/conversation/${convId}/${userId}`);
            setMessages(res.data || []);
            setConversations(prev => prev.map(c => 
                c.id === convId ? { ...c, unreadCount: 0 } : c
            ));
        } catch (err) {
            console.error("Messages fetch failed:", err);
        } finally {
            setMsgLoading(false);
        }
    }, [userId]);

    // Initial load
    useEffect(() => {
        if (userId && token) {
            fetchConversations();
        } else {
            setLoading(false);
            setError("Session expired. Please login again.");
        }
    }, [fetchConversations, userId, token]);

    // WebSocket Initialization
    useEffect(() => {
        if (!userId || !token) return;

        // Only establish connection if not already connecting/connected
        if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
            const socket = new WebSocket(getWsUrl(token));
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("WebSocket connected");
                // If a conversation is already selected, join the room immediately on reconnection
                if (selectedConvRef.current?.id) {
                    socket.send(JSON.stringify({ type: "JOIN_ROOM", roomId: selectedConvRef.current.id }));
                }
            };

            socket.onmessage = (event) => {
                try {
                    const incomingMsg = JSON.parse(event.data);
                    
                    // Always refresh the conversation list to update last message/timestamp
                    fetchConversations();
                    
                    if (selectedConvRef.current?.id && incomingMsg.conversationId === selectedConvRef.current.id) {
                         // Only append if it's not our own optimistic message (or just rely on the server message entirely)
                         setMessages((prev) => {
                             // Guard against duplicate messages (optimistic ID won't match server ID, but content does)
                             // To be safe, let's just use the server message and filter by exact timestamp/content if we did optimistic
                             // More robust: just load the server message directly
                             if (prev.find(m => m.id === incomingMsg.id)) return prev;
                             
                             // Remove optimistic message if present (based on content matching - simplistic approach)
                             const cleaned = prev.filter(m => !(m.content === incomingMsg.content && m.senderId === incomingMsg.senderId && m.id > 1000000000000));
                             return [...cleaned, incomingMsg];
                         });
                    }
                } catch(e) {
                    console.error("Error parsing websocket message", e);
                }
            };
            socket.onerror = (err) => console.error("WebSocket Error:", err);
            socket.onclose = () => console.log("WebSocket disconnected");
        }

        return () => {
             if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                 socketRef.current.close();
                 socketRef.current = null;
             }
        };
    }, [userId, token, fetchConversations]);

    // Selection Side Effects
    useEffect(() => {
        if (selectedConv) {
            if (selectedConv.id) {
                fetchMessages(selectedConv.id);
                // Join the Chat Room
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: "JOIN_ROOM", roomId: selectedConv.id }));
                }
            } else {
                setMessages([]); // New match stub
            }
            // On mobile, hide sidebar when chat is selected
            if (window.innerWidth < 1024) setShowSidebar(false);
        }
    }, [selectedConv, fetchMessages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        const content = newMessage.trim();
        setNewMessage("");

        const optimisticMsg = {
            id: Date.now(), // High dummy ID
            senderId: parseInt(userId),
            content: content,
            createdAt: new Date().toISOString(),
            conversationId: selectedConv.id
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            // Send exclusively via WebSocket to ensure Socket.IO-like real-time DB persisting and Broadcasting
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: "CHAT_MESSAGE",
                    senderId: parseInt(userId),
                    receiverId: selectedConv.otherUserId,
                    roomId: selectedConv.id,
                    content: content
                }));
            }

            setConversations(prev => prev.map(c => 
                c.id === selectedConv.id ? { ...c, lastMessage: content } : c
            ));
        } catch (err) {
            console.error("Send failed:", err);
        }
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedConv) return;

        // 1. Size Validation (50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert("File size exceeds 50MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            // 2. Upload file
            const res = await api.post("/chat/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            const { fileUrl, fileName } = res.data;

            // 3. Optimistic Update
            const optimisticMsg = {
                id: Date.now(),
                senderId: parseInt(userId),
                content: `sent a file: ${fileName}`,
                messageType: "file",
                fileUrl: fileUrl,
                createdAt: new Date().toISOString(),
                conversationId: selectedConv.id
            };
            setMessages(prev => [...prev, optimisticMsg]);

            // 4. Send WebSocket Message
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: "CHAT_MESSAGE",
                    senderId: parseInt(userId),
                    receiverId: selectedConv.otherUserId,
                    roomId: selectedConv.id,
                    content: `sent a file: ${fileName}`,
                    messageType: "file",
                    fileUrl: fileUrl
                }));
            }
        } catch (err) {
            console.error("File upload failed:", err);
            alert("Failed to share file. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };


    const renderMessageContent = (msg) => {
        const { content, messageType, fileUrl, senderId } = msg;
        const isMe = senderId === parseInt(userId);
        const name = isMe ? "You" : selectedConv.otherUserName;

        // Handle File Types
        if (messageType === "file" && fileUrl) {
            const fileName = content ? content.replace("sent a file: ", "") : "attachment";
            return (
                <div className="flex flex-col gap-2 min-w-[180px]">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#A78BFA] opacity-80">
                        {name} sent a file
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Plus size={18} className="rotate-45" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[12px] font-black text-white truncate">{fileName}</p>
                            <button 
                                onClick={() => window.open(`${getBackendBase()}${fileUrl}`, '_blank')}
                                className="text-[10px] text-emerald-400 hover:text-white font-black uppercase tracking-widest mt-1 flex items-center gap-1 transition-colors"
                            >
                                <ExternalLink size={10} /> View / Download
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Handle System/Legacy Zoom Messages
        if (content && content.includes("Zoom meeting has been started:")) {
            const url = content.split("Zoom meeting has been started:")[1].trim();
            return (
                <div className="space-y-4 min-w-[200px]">
                    <div className="flex items-center gap-3 text-emerald-400 font-black mb-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Video size={16} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest">Neural Meeting Hub</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed font-bold">A standardized Zoom meeting has been started for this session.</p>
                    <button 
                        onClick={() => window.open(url, '_blank')}
                        className="w-full py-4 bg-emerald-500 text-[#0B101E] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                    >
                        <ExternalLink size={14} /> Join Now
                    </button>
                </div>
            );
        }
        return content;
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-[#A78BFA] animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Syncing Mandala Hub...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-white">
                <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 opacity-80" />
                <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">Connection Sync Failure</h2>
                <p className="max-w-xs text-slate-500 font-medium text-sm mb-10 leading-relaxed">{error}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#A78BFA] hover:bg-white/10 transition">Reactivate Node</button>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-140px)] flex gap-6 relative z-10 transition-all duration-500 overflow-hidden lg:overflow-visible">
            
            {/* Left Column: Chat List */}
            <AnimatePresence>
              {(showSidebar || window.innerWidth >= 1024) && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  className={`${showSidebar ? 'w-full lg:w-[320px]' : 'hidden lg:flex lg:w-[320px]'} shrink-0 bg-[#0B101E] flex flex-col pt-1 z-30 transition-all`}
                >
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-[22px] font-black text-white tracking-tighter">Active Hubs</h2>
                        <button className="text-[#A78BFA] hover:rotate-90 transition-transform"><Plus size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pr-2">
                        {conversations.length === 0 ? (
                            <div className="py-10 text-center px-4 bg-white/5 rounded-3xl border border-white/5 opacity-40">
                                <MessageSquare className="mx-auto mb-2 opacity-30" />
                                <p className="text-[11px] font-black uppercase tracking-widest">No Active Nodes</p>
                            </div>
                        ) : (
                            conversations.map(conv => {
                                const isSelected = (selectedConv?.id === conv.id && conv.id !== null) || (selectedConv?.otherUserId === conv.otherUserId);
                                const isUnread = conv.unreadCount > 0;
                                return (
                                    <div 
                                        key={conv.id || `stub-${conv.otherUserId}`}
                                        onClick={() => setSelectedConv(conv)}
                                        className={`p-4 flex items-center gap-4 rounded-[28px] cursor-pointer transition-all relative group ${
                                            isSelected 
                                                ? 'bg-[#1C2133] border border-slate-700/60 shadow-xl' 
                                                : isUnread 
                                                    ? 'bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.08)]' 
                                                    : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        {(isSelected || isUnread) && (
                                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full shadow-[0_0_10px_#A78BFA] ${isSelected ? 'bg-[#A78BFA]' : 'bg-[#A78BFA]/50'}`}></div>
                                        )}
                                        <div className="relative shrink-0">
                                            <Avatar 
                                                src={conv.otherUserProfilePictureUrl} 
                                                name={conv.otherUserName} 
                                                size="sm" 
                                                border={false} 
                                                className="border-2 border-[#0B101E]" 
                                            />
                                            {isUnread && (
                                                <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-purple-500/30 animate-pulse">
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <h4 className={`text-[14px] truncate leading-none ${
                                                        isSelected 
                                                            ? 'text-white font-black' 
                                                            : isUnread 
                                                                ? 'text-[#A78BFA] font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]' 
                                                                : 'text-slate-300 font-bold'
                                                    }`}>{conv.otherUserName}</h4>
                                                    {!conv.matched && <Lock size={10} className="text-slate-600 shrink-0" />}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-tighter shrink-0 ${isUnread ? 'text-[#A78BFA]' : 'text-slate-500'}`}>{formatTime(conv.lastMessageAt)}</span>
                                            </div>
                                            <p className={`text-[12px] truncate leading-tight ${isUnread ? 'text-slate-200 font-bold' : 'text-slate-500 font-semibold'}`}>
                                               {conv.lastMessage || "Establish first contact..."}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Middle Column: Chat Canvas */}
            <div className={`flex-1 bg-[#12182B] border border-slate-700/60 rounded-[40px] flex flex-col overflow-hidden shadow-2xl relative ${!showSidebar ? 'flex' : 'hidden lg:flex'}`}>
                
                {selectedConv ? (
                    <>
                        {/* Header */}
                        <div className="h-24 border-b border-white/5 px-8 flex justify-between items-center bg-[#12182B]/80 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setShowSidebar(true)} 
                                  className="lg:hidden p-2 text-slate-400 hover:text-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <Avatar 
                                    src={selectedConv.otherUserProfilePictureUrl} 
                                    name={selectedConv.otherUserName} 
                                    size="sm" 
                                    border={false} 
                                />
                                <div className="overflow-hidden">
                                    <h3 className="text-xl font-black text-white truncate leading-tight tracking-tight">{selectedConv.otherUserName}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5 animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#A78BFA]">Active Synchronizer</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 text-slate-400">
                                <button 
                                  onClick={() => navigate('/book-session', { state: { teacherId: selectedConv.otherUserId, teacherName: selectedConv.otherUserName, teacherProfilePic: selectedConv.otherUserProfilePictureUrl, conversationId: selectedConv.id } })}
                                  className="h-11 px-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center gap-2 transition hover:bg-indigo-500 hover:text-white text-indigo-400 text-[10px] font-black uppercase tracking-widest"
                                >
                                  <CalendarPlus size={16} /> Book Session
                                </button>
                                <button className="w-11 h-11 rounded-2xl hover:bg-white/5 flex items-center justify-center transition border border-white/5"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Stream */}
                        <div className="flex-1 relative overflow-hidden flex flex-col">
                            
                            {/* Locked Overlay */}
                            <AnimatePresence>
                                {!selectedConv.matched && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-30 bg-[#12182B]/60 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
                                    >
                                        <motion.div 
                                            initial={{ scale: 0.9, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            className="max-w-xs"
                                        >
                                            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.1)] border border-indigo-500/20">
                                                <ShieldAlert size={36} />
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">Hub Lock Active</h3>
                                            <p className="text-slate-400 text-[11px] font-bold leading-relaxed uppercase tracking-[0.2em] mb-10">
                                                 calibrate your skill-weave in the <span className="text-indigo-400">Sessions Hub</span> to unlock this communication node.
                                            </p>
                                            <button 
                                                onClick={() => window.location.href='/sessions'}
                                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 transition"
                                            >
                                                Go to Sessions
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div 
                               ref={scrollRef}
                               className={`flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8 scroll-smooth transition-all duration-700 ${!selectedConv.matched ? 'filter blur-[10px] grayscale pointer-events-none opacity-40' : ''}`}
                            >
                                {msgLoading && messages.length === 0 ? (
                                    <div className="flex justify-center"><Loader2 className="animate-spin text-slate-700" size={24} /></div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-20 opacity-20"><p className="text-xs font-black uppercase tracking-[0.3em]">Neural Link Standby</p></div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.senderId === parseInt(userId);
                                        const isSystem = msg.system === true;

                                        if (isSystem) {
                                            return (
                                                <motion.div 
                                                    key={msg.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="self-center flex flex-col items-center justify-center py-4 w-full"
                                                >
                                                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-[28px] max-w-[90%] shadow-2xl backdrop-blur-md">
                                                        {renderMessageContent(msg)}
                                                    </div>
                                                </motion.div>
                                            );
                                        }

                                        return (
                                            <motion.div 
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-4 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                                            >
                                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`p-5 rounded-[32px] text-[13.5px] font-medium leading-[1.1] shadow-xl ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-[#1C2133] text-slate-200 rounded-bl-sm border border-slate-700/50'}`}>
                                                        {renderMessageContent(msg)}
                                                    </div>
                                                    <span className="text-[9px] text-slate-600 font-black mt-2 uppercase tracking-widest">
                                                        {formatTime(msg.createdAt)} {isMe && '• Sent'}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-8 pt-2">
                           <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileChange} 
                              className="hidden" 
                           />
                           <form onSubmit={handleSendMessage} className={`bg-[#1C2133] border border-slate-700/60 rounded-[32px] p-2 flex items-center shadow-2xl focus-within:border-indigo-500/50 transition-all ${!selectedConv.matched ? 'opacity-20 pointer-events-none' : ''}`}>
                              <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition shrink-0"
                              >
                                {uploading ? <Loader2 size={20} className="animate-spin text-indigo-400" /> : <Plus size={22} />}
                              </button>
                              <input 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                type="text" 
                                disabled={!selectedConv.matched}
                                placeholder={selectedConv.matched ? `Write a message to ${selectedConv.otherUserName}...` : "Synchronization required..."} 
                                className="flex-1 bg-transparent border-none focus:outline-none text-[14px] text-white px-4 placeholder:text-slate-600 font-medium" 
                              />
                              <button 
                                type="submit" 
                                className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition shadow-lg shrink-0 disabled:opacity-50"
                                disabled={!newMessage.trim() || !selectedConv.matched}
                              >
                                <Send size={20} />
                              </button>
                           </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30 select-none">
                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-indigo-500/40 flex items-center justify-center mb-8 animate-pulse">
                           <MessageSquare size={48} className="text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-widest uppercase">Communication Node</h3>
                        <p className="max-w-xs text-[11px] font-bold mt-4 leading-relaxed tracking-widest uppercase text-[#A78BFA]">Initialize a secure synchronization link to begin skill weaving dialogues.</p>
                    </div>
                )}
            </div>

            {/* Right Column: Profile Panel (Synced with selection) */}
            <div className={`w-[320px] shrink-0 bg-[#0B101E]/40 border border-slate-700/40 rounded-[48px] overflow-hidden flex flex-col shadow-2xl hidden xl:flex`}>
               {selectedConv ? (
                 <>
                    <div className="p-10 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-[#1C2133] to-transparent">
                        <Avatar 
                            src={selectedConv.otherUserProfilePictureUrl} 
                            name={selectedConv.otherUserName} 
                            size="xl" 
                            border={false} 
                            className="mb-6 shadow-2xl shadow-indigo-500/20 rotate-3 group hover:rotate-0 transition-transform rounded-[40px]" 
                        />
                        <h3 className="text-2xl font-black text-white mb-1 tracking-tighter">{selectedConv.otherUserName}</h3>
                        <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-widest">Master Talent Hub</p>
                        
                        <div className="flex gap-3 w-full mt-8">
                           <button onClick={() => navigate(`/profile/${selectedConv.otherUserId}`)} className="flex-1 py-3.5 rounded-2xl bg-white text-[#0B101E] text-[10px] uppercase tracking-widest font-black shadow-xl hover:scale-105 transition">Profile</button>
                           <button className="w-12 h-12 rounded-2xl bg-[#1C2133] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition"><MoreHorizontal size={18} /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-10">
                        {/* Match Agreement Tracker */}
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6">Match Agreements</h4>
                           
                           {/* My Teaching Goal */}
                           <div className="bg-[#1C2133] border border-white/5 p-6 rounded-3xl group transition relative overflow-hidden mb-4">
                               <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                            <Sparkles size={14} />
                                        </div>
                                        <h5 className="text-[14px] font-black text-white">Your Teaching Goal {selectedConv.myTeachingSubject && <span className="text-[#A78BFA]">({selectedConv.myTeachingSubject})</span>}</h5>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-black/20 px-3 py-1 rounded-full">
                                        {selectedConv.myTeachingCompleted || 0} / {selectedConv.myTeachingGoal || 0}
                                    </span>
                                </div>

                               {selectedConv.myTeachingGoal ? (
                                    <>
                                        <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden mb-4">
                                            <div 
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(100, ((selectedConv.myTeachingCompleted || 0) / selectedConv.myTeachingGoal) * 100)}%` }}
                                            />
                                        </div>
                                        {selectedConv.myTeachingCompleted >= selectedConv.myTeachingGoal && selectedConv.myTeachingGoal > 0 ? (
                                            <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Goal Completed! 🎉</p>
                                            </div>
                                        ) : null}
                                        <button 
                                            onClick={() => setAgreementModal({ isOpen: true, type: 'extend', direction: 'teach', amount: 2, subject: selectedConv.myTeachingSubject || '' })}
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition mt-2 cursor-pointer"
                                        >
                                            Extend Goal
                                        </button>
                                    </>
                               ) : (
                                    <div className="text-center">
                                        <p className="text-[11px] text-slate-400 font-medium mb-4 leading-relaxed">
                                            You haven't set a teaching goal for this match.
                                        </p>
                                        <button 
                                            onClick={() => setAgreementModal({ isOpen: true, type: 'set', direction: 'teach', amount: 5, subject: '' })}
                                            className="px-6 py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition cursor-pointer"
                                        >
                                            Set Goal
                                        </button>
                                    </div>
                               )}
                           </div>

                           {/* My Learning Goal */}
                           <div className="bg-[#1C2133] border border-white/5 p-6 rounded-3xl group transition relative overflow-hidden">
                               <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                            <Sparkles size={14} />
                                        </div>
                                        <h5 className="text-[14px] font-black text-white">Your Learning Goal {selectedConv.myLearningSubject && <span className="text-[#A78BFA]">({selectedConv.myLearningSubject})</span>}</h5>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-black/20 px-3 py-1 rounded-full">
                                        {selectedConv.myLearningCompleted || 0} / {selectedConv.myLearningGoal || 0}
                                    </span>
                                </div>

                               {selectedConv.myLearningGoal ? (
                                    <>
                                        <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden mb-4">
                                            <div 
                                                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(100, ((selectedConv.myLearningCompleted || 0) / selectedConv.myLearningGoal) * 100)}%` }}
                                            />
                                        </div>
                                        {selectedConv.myLearningCompleted >= selectedConv.myLearningGoal && selectedConv.myLearningGoal > 0 ? (
                                            <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Goal Completed! 🎉</p>
                                            </div>
                                        ) : null}
                                    </>
                               ) : (
                                    <div className="text-center">
                                        <p className="text-[11px] text-slate-400 font-medium mb-1 leading-relaxed">
                                            {selectedConv.otherUserName} hasn't set a teaching goal for you.
                                        </p>
                                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                                            Only the teacher can configure this goal.
                                        </p>
                                    </div>
                               )}
                           </div>
                        </div>

                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6">Quick Actions</h4>
                           <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-[32px] p-6 text-center">
                              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                 <CalendarPlus size={24} />
                              </div>
                              <p className="text-[12px] font-bold text-slate-400 mb-5 px-2">Schedule a 1-on-1 learning session with {selectedConv.otherUserName}</p>
                              <button 
                                onClick={() => navigate('/book-session', { state: { teacherId: selectedConv.otherUserId, teacherName: selectedConv.otherUserName, teacherProfilePic: selectedConv.otherUserProfilePictureUrl, conversationId: selectedConv.id } })}
                                className="w-full py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-indigo-500 transition active:scale-95 flex items-center justify-center gap-2"
                              >
                                <CalendarPlus size={14} /> Book Session
                              </button>
                           </div>
                        </div>
                    </div>
                 </>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-10 grayscale scale-75">
                    <CheckCircle2 size={80} />
                    <p className="mt-4 font-black text-xs uppercase tracking-widest">Select Node</p>
                 </div>
               )}
            </div>

            {/* Agreement Modal */}
            <AnimatePresence>
                {agreementModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !actionLoading && setAgreementModal({ ...agreementModal, isOpen: false })}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-[#12182B] border border-slate-700/50 p-8 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                                {agreementModal.type === 'set' ? 'Set Session Goal' : 'Extend Goal'}
                            </h3>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                                {agreementModal.type === 'set' 
                                    ? `How many sessions are you committing to teach ${selectedConv.otherUserName}?`
                                    : `How many additional sessions would you like to add?`
                                }
                            </p>

                            {agreementModal.type === 'set' && (
                                <div className="mb-6">
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Subject / Skill Name</label>
                                    <input 
                                        type="text" 
                                        value={agreementModal.subject}
                                        onChange={(e) => setAgreementModal(prev => ({ ...prev, subject: e.target.value }))}
                                        placeholder="e.g., Python, Piano, UI Design"
                                        className="w-full bg-[#1C2133] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                    />
                                </div>
                            )}
                            
                            <div className="bg-[#1C2133] border border-white/5 rounded-[24px] p-2 flex items-center mb-8">
                                <button 
                                    onClick={() => setAgreementModal(prev => ({ ...prev, amount: Math.max(1, prev.amount - 1)}))}
                                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-[20px] transition cursor-pointer"
                                >
                                    -
                                </button>
                                <div className="flex-1 text-center font-black text-2xl text-white">
                                    {agreementModal.amount}
                                </div>
                                <button 
                                    onClick={() => setAgreementModal(prev => ({ ...prev, amount: prev.amount + 1}))}
                                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-[20px] transition cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <button 
                                disabled={actionLoading || (agreementModal.type === 'set' && !agreementModal.subject.trim())}
                                onClick={async () => {
                                    setActionLoading(true);
                                    try {
                                        let currentGoal = selectedConv.myTeachingGoal || 0;

                                        const totalSessions = agreementModal.type === 'set' 
                                            ? agreementModal.amount 
                                            : currentGoal + agreementModal.amount;
                                        
                                        const teacherId = parseInt(userId);
                                        const learnerId = selectedConv.otherUserId;

                                        await api.post('/user/matches/agreement', {
                                            teacherId,
                                            learnerId,
                                            goal: totalSessions,
                                            subject: agreementModal.subject.trim()
                                        });

                                        const skillName = agreementModal.type === 'set' ? agreementModal.subject.trim() : (selectedConv.myTeachingSubject || 'the skill');
                                        const sysMsg = agreementModal.type === 'set'
                                            ? `🤝 Set a new teaching goal of ${totalSessions} sessions for ${skillName}.`
                                            : `📈 Extended the teaching goal for ${skillName} to a total of ${totalSessions} sessions.`;

                                        if (socketRef.current?.readyState === WebSocket.OPEN) {
                                            socketRef.current.send(JSON.stringify({
                                                type: "CHAT_MESSAGE",
                                                senderId: parseInt(userId),
                                                receiverId: selectedConv.otherUserId,
                                                roomId: selectedConv.id,
                                                content: sysMsg,
                                                isSystem: true
                                            }));
                                        }
                                        
                                        setAgreementModal({ ...agreementModal, isOpen: false });
                                        fetchConversations();
                                    } catch(e) {
                                        console.error(e);
                                    } finally {
                                        setActionLoading(false);
                                    }
                                }}
                                className="w-full py-4 bg-indigo-600 text-white text-[12px] font-black uppercase tracking-widest rounded-[20px] shadow-xl hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'Confirm Goal'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserMessages;
