import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useUser } from "../utils/Usercontext";
import apiService from "../utils/apiService";

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState({});
  const [typingStatus, setTypingStatus] = useState({}); // { [userId]: boolean }
  const [connectionError, setConnectionError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const connectSocket = () => {
      const SOCKET_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";
      console.log("🔌 Attempting WebSocket connection to:", SOCKET_URL);
      
      const newSocket = io(SOCKET_URL, {
        transports: ["websocket"], // Force websocket for zero-latency
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket connected to server:", newSocket.id);
        setSocket(newSocket);
        setConnectionError(null);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("❌ Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          newSocket.connect();
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setConnectionError(
          "Unable to connect to chat server. Please try again later."
        );
      });

      newSocket.on("receive_message", (data) => {
        console.log("📥 Socket Event [receive_message] ARRIVED:", data);
        const { from, to, content, createdAt, _id, chatId } = data;
        
        // Use strings for all ID comparisons
        const myId = (user?._id || user?.id)?.toString();
        console.log("👤 My ID context:", myId);
        
        const roomId = chatId?.toString() || (from?.toString() === myId ? to?.toString() : from?.toString());
        console.log("📂 Determined Room ID:", roomId);
        
        setChatRooms((prev) => {
          console.log("📝 Updating state for room:", roomId);
          const currentMessages = prev[roomId] || [];
          
          // Prevent duplicates
          if (currentMessages.some(m => m._id === _id)) {
            console.log("⚠️ Duplicate message ignored:", _id);
            return prev;
          }

          return {
            ...prev,
            [roomId]: [...currentMessages, { 
              _id: _id?.toString(), 
              content, 
              sender: from?.toString(), 
              recipient: to?.toString(), 
              chatId: chatId?.toString(), 
              createdAt: createdAt || new Date() 
            }],
          };
        });
      });

      newSocket.on("typing", (data) => {
        const { from, isTyping } = data;
        setTypingStatus((prev) => ({
          ...prev,
          [from]: isTyping
        }));
      });

      newSocket.on("message_read_update", (data) => {
        const { chatId, messageId, readerId } = data;
        setChatRooms((prev) => {
          if (!prev[chatId]) return prev;
          return {
            ...prev,
            [chatId]: prev[chatId].map(msg => {
              // If we have a specific messageId, mark just that. 
              // Otherwise (bulk update), mark all messages from other side as read.
              if (messageId && msg._id === messageId) return { ...msg, read: true };
              if (!messageId && msg.sender !== readerId) return { ...msg, read: true };
              return msg;
            })
          };
        });
      });

      return newSocket;
    };

    let s;
    if (user && user._id) {
      s = connectSocket();
    }

    return () => {
      if (s) s.close();
    };
  }, [user]);

  // Handle joining user room when socket and user are both ready
  useEffect(() => {
    if (socket && user) {
      const myId = (user._id || user.id)?.toString();
      if (myId) {
        socket.emit("join", myId);
        console.log("👤 Emitted [join] for User:", myId);
      }
    }
  }, [socket, user]);

  const joinChatRoom = (chatId) => {
    if (socket) {
      socket.emit("join_chat", chatId);
    }
  };

  const leaveChatRoom = (chatId) => {
    if (socket) {
      socket.emit("leave_chat", chatId);
    }
  };

  const sendMessage = async (toUserId, messageContent, chatId = null) => {
    if (user) {
      const roomId = chatId || toUserId;
      const tempId = Date.now().toString();
      
      // 1. Optimistic UI Update - show message immediately
      const optimisticMessage = {
        _id: tempId,
        content: messageContent,
        sender: (user._id || user.id).toString(),
        recipient: toUserId,
        chatId: chatId,
        createdAt: new Date(),
        optimistic: true
      };

      setChatRooms((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), optimisticMessage],
      }));

      try {
        // 2. Persist to DB via API
        const res = await apiService.post("/api/messages/send", {
          recipient: toUserId,
          content: messageContent,
          chatId: chatId
        });

        if (res.data.success) {
          const actualMessage = res.data.data;
          
          // 3. Replace optimistic message with actual data from server
          setChatRooms((prev) => ({
            ...prev,
            [roomId]: prev[roomId].map(msg => msg._id === tempId ? actualMessage : msg),
          }));
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic message on failure
        setChatRooms((prev) => ({
          ...prev,
          [roomId]: prev[roomId].filter(msg => msg._id !== tempId),
        }));
      }
    }
  };

  const sendTypingStatus = (toUserId, isTyping, chatId) => {
    if (socket && user) {
      socket.emit("typing", { from: user._id, to: toUserId, isTyping, chatId });
    }
  };

  const markMessageAsRead = (messageId, senderId, chatId) => {
    if (socket && user) {
      socket.emit("message_read", { messageId, sender: senderId, recipient: user._id, chatId });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        chatRooms,
        setChatRooms,
        typingStatus,
        joinChatRoom,
        leaveChatRoom,
        sendMessage,
        sendTypingStatus,
        markMessageAsRead,
        connectionError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
