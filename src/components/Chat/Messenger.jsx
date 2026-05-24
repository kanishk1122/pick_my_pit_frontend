import React, { useState, useEffect, useRef } from "react";
import apiService from "../../utils/apiService";
import { useUser } from "../../utils/Usercontext";
import { useChatContext } from "../../context/ChatContext";

const Messenger = () => {
  const { user } = useUser();
  const { socket, chatRooms, sendMessage, setChatRooms, typingStatus, sendTypingStatus, markMessageAsRead, joinChatRoom, leaveChatRoom } = useChatContext();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await apiService.get("/api/messages/chats");
      if (res.data.success) {
        setChats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  const loadConversation = async (chatId, otherUserId) => {
    // 1. Set active chat immediately for snappy UI
    const prevChat = activeChat;
    setActiveChat(chatId);

    try {
      // Leave previous chat room if any
      if (prevChat) leaveChatRoom(prevChat);
      
      const res = await apiService.get(`/api/messages/conversation/${chatId}`);
      if (res.data.success) {
        setChatRooms((prev) => ({
          ...prev,
          [chatId]: res.data.data
        }));
        joinChatRoom(chatId);
      }
      // Mark as read in DB and via Socket
      markMessageAsRead(null, otherUserId, chatId);
    } catch (error) {
      console.error("Error loading conversation", error);
    }
  };

  // Mark incoming messages as read if chat is active
  useEffect(() => {
    if (activeChat && chatRooms[activeChat]?.length > 0) {
      const lastMsg = chatRooms[activeChat][chatRooms[activeChat].length - 1];
      const isOther = lastMsg.sender?.toString() !== user?._id?.toString() && lastMsg.sender?.toString() !== user?.id?.toString();
      if (isOther && !lastMsg.read) {
        markMessageAsRead(lastMsg._id, lastMsg.sender, activeChat);
      }
    }
  }, [chatRooms, activeChat]);

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    
    if (activeChat) {
      if (!isTyping) {
        setIsTyping(true);
        // Pass both recipient ID and chat ID
        const currentChat = chats.find(c => c._id === activeChat);
        const otherParticipant = currentChat?.participants.find(p => p?._id?.toString() !== user?._id?.toString() && p?._id?.toString() !== user?.id?.toString()) || {};
        sendTypingStatus(otherParticipant._id, true, activeChat);
      }

      // Reset timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        const currentChat = chats.find(c => c._id === activeChat);
        const otherParticipant = currentChat?.participants.find(p => p?._id?.toString() !== user?._id?.toString() && p?._id?.toString() !== user?.id?.toString()) || {};
        sendTypingStatus(otherParticipant._id, false, activeChat);
      }, 3000);
    }
  };

  const handleSend = async () => {
    if (messageText.trim() && activeChat) {
      // Find recipient from current chat
      const currentChat = chats.find(c => c._id === activeChat);
      const otherParticipant = currentChat?.participants.find(p => p?._id?.toString() !== user?._id?.toString() && p?._id?.toString() !== user?.id?.toString()) || {};
      
      // Clear typing status immediately
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
      sendTypingStatus(otherParticipant._id, false, activeChat);

      await sendMessage(otherParticipant._id, messageText, activeChat);
      setMessageText("");
      // Refresh chats list to update last message (non-blocking)
      fetchChats();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatRooms, activeChat]);

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  const [selectedPostId, setSelectedPostId] = useState('all');

  // Unique posts from chats
  const uniquePosts = chats.reduce((acc, chat) => {
    const postId = chat.post?._id;
    if (postId && !acc.find(p => p._id === postId)) {
      acc.push(chat.post);
    }
    return acc;
  }, []);

  const filteredChats = selectedPostId === 'all' 
    ? chats 
    : chats.filter(c => (c.post?._id || 'general') === selectedPostId);

  return (
    <div className="container mx-auto flex flex-col h-[85vh] bg-[#FDFCF8] border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 ease-in-out animate-in fade-in zoom-in duration-700">
      {/* Top Filter Bar */}
      <div className="flex items-center gap-3 p-4 border-b-2 border-black bg-white overflow-x-auto no-scrollbar scroll-smooth">
        <button 
          onClick={() => { setSelectedPostId('all'); setActiveChat(null); }}
          className={`px-5 py-2.5 border-2 border-black font-bold uppercase text-[11px] tracking-wider whitespace-nowrap rounded-full transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${selectedPostId === 'all' ? 'bg-emerald-400 text-black' : 'bg-white text-stone-600 hover:bg-emerald-50'}`}
        >
          All Messages
        </button>
        <button 
          onClick={() => { setSelectedPostId('general'); setActiveChat(null); }}
          className={`px-5 py-2.5 border-2 border-black font-bold uppercase text-[11px] tracking-wider whitespace-nowrap rounded-full transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${selectedPostId === 'general' ? 'bg-emerald-400 text-black' : 'bg-white text-stone-600 hover:bg-emerald-50'}`}
        >
          General
        </button>
        {uniquePosts.map(post => (
          <button 
            key={post._id}
            onClick={() => { setSelectedPostId(post._id); setActiveChat(null); }}
            className={`px-5 py-2 border-2 border-black font-bold uppercase text-[11px] tracking-wider flex items-center gap-2 whitespace-nowrap rounded-full transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${selectedPostId === post._id ? 'bg-emerald-400 text-black' : 'bg-white text-stone-600 hover:bg-emerald-50'}`}
          >
            {post.images?.[0] && <img src={post.images[0]} alt="" className="w-6 h-6 object-cover rounded-full border border-black shadow-sm" />}
            {post.title}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r-2 border-black flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.length === 0 ? (
              <div className="p-12 text-center">
                 <div className="w-16 h-16 mx-auto mb-4 opacity-20"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
                 <p className="font-bold text-stone-400 uppercase text-xs tracking-widest">No inquiries found</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const otherParticipant = chat.participants.find(p => p?._id?.toString() !== user?._id?.toString() && p?._id?.toString() !== user?.id?.toString()) || chat.participants[0] || {};
                const isActive = activeChat === chat._id;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => loadConversation(chat._id, otherParticipant._id)}
                    className={`p-5 border-b border-stone-100 cursor-pointer flex items-center gap-4 transition-all duration-300 relative group ${isActive ? 'bg-emerald-50' : 'bg-white hover:bg-stone-50'}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-full" />}
                    <div className="w-14 h-14 bg-emerald-100 border-2 border-black rounded-full flex items-center justify-center text-xl font-bold text-emerald-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
                      {otherParticipant?.userpic ? (
                         <img src={otherParticipant.userpic} className="w-full h-full object-cover rounded-full" alt="" />
                      ) : (
                         otherParticipant?.firstname?.[0] || 'U'
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-stone-800 text-sm">{otherParticipant?.firstname} {otherParticipant?.lastname}</h3>
                        {chat.unreadCount?.[user._id] > 0 && (
                          <span className="bg-amber-400 text-black text-[9px] px-2 py-0.5 font-black rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">NEW</span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-1 ${chat.unreadCount?.[user._id] > 0 ? 'font-bold text-stone-600' : 'text-stone-400'}`}>
                        {typingStatus[otherParticipant._id] ? (
                          <span className="text-emerald-600 italic">typing...</span>
                        ) : (
                          chat.lastMessage || "Start a conversation"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              {(() => {
                const currentChat = chats.find(c => c._id === activeChat);
                const other = currentChat?.participants.find(p => p?._id?.toString() !== user?._id?.toString() && p?._id?.toString() !== user?.id?.toString()) || {};
                
                return (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-200 border-2 border-black rounded-full flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-transform hover:scale-105">
                         {other?.userpic ? (
                           <img src={other.userpic} className="w-full h-full object-cover" alt="" />
                         ) : (
                           other.firstname?.[0]
                         )}
                      </div>
                      <div>
                        <h2 className="font-bold text-stone-800 text-lg leading-tight">{other.firstname} {other.lastname}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Now</p>
                        </div>
                      </div>
                    </div>

                    {currentChat?.post && (
                      <div 
                        className="flex items-center gap-3 bg-white p-2 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all cursor-pointer group" 
                        onClick={() => window.open(`/pet/${currentChat.post._id}`, '_blank')}
                      >
                        {currentChat.post.images?.[0] && (
                          <img src={currentChat.post.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl border border-black group-hover:scale-105 transition-transform" />
                        )}
                        <div className="pr-3">
                          <p className="text-[9px] font-bold uppercase text-stone-400 tracking-tighter">Inquiry regarding</p>
                          <p className="text-xs font-bold text-stone-800 truncate max-w-[120px]">{currentChat.post.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-30">
              {(() => {
                const currentChat = chats.find(c => c._id === activeChat);
                const messages = chatRooms[activeChat] || [];
                
                if (messages.length === 0) return (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale">
                     <img src="https://cdn-icons-png.flaticon.com/512/3662/3662817.png" className="w-24 h-24 mb-4" alt="" />
                     <p className="font-bold uppercase tracking-widest text-sm">No messages yet</p>
                  </div>
                );

                return messages.map((msg, idx) => {
                  const isMe = msg.sender?.toString() === user?._id?.toString() || msg.sender?.toString() === user?.id?.toString();
                  return (
                    <div key={msg._id || idx} className={`mb-8 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-5 py-3 border-2 border-black max-w-xs lg:max-w-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl ${isMe ? 'bg-emerald-400 rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                        <p className="font-bold text-sm text-stone-800 leading-relaxed">{msg.content}</p>
                        <div className={`text-[10px] mt-2 flex items-center gap-2 font-bold ${isMe ? 'text-black/60' : 'text-stone-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && (
                             <span className="text-xs font-black ml-1">
                               {msg.read ? '✓✓' : '✓'}
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t-2 border-black">
               <div className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTextChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 border-2 border-black px-6 py-3.5 rounded-full font-bold focus:outline-none focus:bg-emerald-50 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                />
                <button
                  onClick={handleSend}
                  className="bg-stone-900 text-white px-8 rounded-full font-bold uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                >
                  <span>Send</span>
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" /></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
             <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                <h3 className="text-3xl font-black uppercase mb-2">Select a Query</h3>
                <p className="font-bold text-gray-500">Pick a post from the sidebar to start chatting!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Messenger;
