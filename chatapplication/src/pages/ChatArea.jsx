// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
// import { authService } from '../services/authService';
// import PrivateChat from './PrivateChat';
// import '../styles/ChatArea.css';

// const ChatArea = () => {
//     const navigate = useNavigate();
//     const currentUser = authService.getCurrentUser();

//     useEffect(() => {
//         if (!currentUser) {
//             navigate('/login');
//             return;
//         }
//     }, [currentUser, navigate]);

//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [isTyping, setIsTyping] = useState('');
//     const [privateChats, setPrivateChats] = useState(new Map());
//     const [unreadMessages, setUnreadMessages] = useState(new Map());

//     const privateMessageHandlers = useRef(new Map());
//     const stompClient = useRef(null);
//     const messagesEndRef = useRef(null);
//     const typingTimeoutRef = useRef(null);

//     const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '😎', '⭐', '✨', '💯','🎂'];

//     if (!currentUser) {
//         return null;
//     }

//     const { username, color: userColor } = currentUser;

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const registerPrivateMessageHandler = useCallback((otherUser, handler) => {
//         privateMessageHandlers.current.set(otherUser, handler);
//     }, []);

//     const unregisterPrivateMessageHandler = useCallback((otherUser) => {
//         privateMessageHandlers.current.delete(otherUser);
//     }, []);

//     useEffect(() => {
//         let reconnectInterval;
//         const connectAndFetch = async () => {
//             if (!username) return;

//             setOnlineUsers(prev => {
//                 const newSet = new Set(prev);
//                 newSet.add(username);
//                 return newSet;
//             });

//             const socket = new SockJS('http://localhost:8080/ws');
//             stompClient.current = Stomp.over(socket);

//             stompClient.current.connect({
//                 'client-id': username,
//                 'session-id': Date.now().toString(),
//                 'username': username
//             }, (frame) => {
//                 clearInterval(reconnectInterval);

//                 const publicSub = stompClient.current.subscribe('/topic/public', (msg) => {
//                     const chatMessage = JSON.parse(msg.body);

//                     setOnlineUsers(prev => {
//                         const newUsers = new Set(prev);
//                         if (chatMessage.type === 'JOIN') {
//                             newUsers.add(chatMessage.sender);
//                         } else if (chatMessage.type === 'LEAVE') {
//                             newUsers.delete(chatMessage.sender);
//                         }
//                         return newUsers;
//                     });

//                     if (chatMessage.type === 'TYPING') {
//                         setIsTyping(chatMessage.sender);
//                         clearTimeout(typingTimeoutRef.current);
//                         typingTimeoutRef.current = setTimeout(() => {
//                             setIsTyping('');
//                         }, 2000);
//                         return;
//                     }

//                     setMessages(prev => [...prev, {
//                         ...chatMessage,
//                         timestamp: chatMessage.timestamp || new Date(),
//                         id: chatMessage.id || (Date.now() + Math.random())
//                     }]);
//                 });

//                 const privateSub = stompClient.current.subscribe(`/user/${username}/queue/private`, (msg) => {
//                     const privateMessage = JSON.parse(msg.body);
//                     const otherUser = privateMessage.sender === username ? privateMessage.recipient : privateMessage.sender;
//                     const handler = privateMessageHandlers.current.get(otherUser);

//                     if (handler) {
//                         try {
//                             handler(privateMessage);
//                         } catch (error) {
//                             console.error('Error calling handler:', error);
//                         }
//                     } else if (privateMessage.recipient === username) {
//                         setUnreadMessages(prev => {
//                             const newUnread = new Map(prev);
//                             const currentCount = newUnread.get(otherUser) || 0;
//                             newUnread.set(otherUser, currentCount + 1);
//                             return newUnread;
//                         });
//                     }
//                 });

//                 stompClient.current.send("/app/chat.addUser", {}, JSON.stringify({
//                     sender: username,
//                     type: 'JOIN',
//                     color: userColor
//                 }));

//                 authService.getOnlineUsers()
//                     .then(data => {
//                         const fetchedUsers = Object.keys(data);
//                         setOnlineUsers(prev => {
//                             const mergedSet = new Set(prev);
//                             fetchedUsers.forEach(user => mergedSet.add(user));
//                             mergedSet.add(username);
//                             return mergedSet;
//                         });
//                     })
//                     .catch(error => {
//                         console.error('Error fetching initial online users:', error);
//                     });

//             }, (error) => {
//                 console.error('STOMP connection error:', error);
//                 if (!reconnectInterval) {
//                     reconnectInterval = setInterval(() => {
//                         connectAndFetch();
//                     }, 5000);
//                 }
//             });
//         };

//         connectAndFetch();

//         return () => {
//             if (stompClient.current && stompClient.current.connected) {
//                 stompClient.current.disconnect();
//             }
//             clearTimeout(typingTimeoutRef.current);
//             clearInterval(reconnectInterval);
//         };
//     }, [username, userColor, registerPrivateMessageHandler, unregisterPrivateMessageHandler]);

//     const openPrivateChat = (otherUser) => {
//         if (otherUser === username) return;

//         setPrivateChats(prev => {
//             const newChats = new Map(prev);
//             newChats.set(otherUser, true);
//             return newChats;
//         });

//         setUnreadMessages(prev => {
//             const newUnread = new Map(prev);
//             newUnread.delete(otherUser);
//             return newUnread;
//         });
//     };

//     const closePrivateChat = (otherUser) => {
//         setPrivateChats(prev => {
//             const newChats = new Map(prev);
//             newChats.delete(otherUser);
//             return newChats;
//         });
//         unregisterPrivateMessageHandler(otherUser);
//     };

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (message.trim() && stompClient.current && stompClient.current.connected) {
//             const chatMessage = {
//                 sender: username,
//                 content: message,
//                 type: 'CHAT',
//                 color: userColor
//             };

//             stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
//             setMessage('');
//             setShowEmojiPicker(false);
//         }
//     };

//     const handleTyping = (e) => {
//         setMessage(e.target.value);

//         if (stompClient.current && stompClient.current.connected && e.target.value.trim()) {
//             stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify({
//                 sender: username,
//                 type: 'TYPING'
//             }));
//         }
//     };

//     const addEmoji = (emoji) => {
//         setMessage(prev => prev + emoji);
//         setShowEmojiPicker(false);
//     };

//     const formatTime = (timestamp) => {
//         return new Date(timestamp).toLocaleTimeString('en-US', {
//             timeZone: 'Asia/Kolkata',
//             hour12: false,
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const handleDisconnect = async () => {
//         try {
//             await authService.logout();
//             navigate('/login');
//         } catch (error) {
//             console.error('Logout error:', error);
//             navigate('/login');
//         }
//     };

//     return (
//         <div className="chat-container">
//             <div className="sidebar">
//                 <div className="sidebar-header">
//                     <h3>Users</h3>

//                 </div>
//                 <div className="users-list">
//                     {Array.from(onlineUsers).map(user => (
//                         <div
//                             key={user}
//                             className={`user-item ${user === username ? 'current-user' : ''}`}
//                             onClick={() => openPrivateChat(user)}
//                         >
//                             <div className="user-avatar" style={{ backgroundColor: user === username ? userColor : '#007bff' }}>
//                                 {user.charAt(0).toUpperCase()}
//                             </div>
//                             <span>{user}</span>
//                             {user === username && <span className="you-label">(You)</span>}
//                             {unreadMessages.has(user) && (
//                                 <span className="unread-count">{unreadMessages.get(user)}</span>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="main-chat">
//                 <div className="chat-header">
//                     <h2>Chat Area</h2>
//                     <p>Welcome, {username}!</p>
//                 </div>

//                 <div className="messages-container">
//                     {messages.map((msg) => (
//                         <div key={msg.id} className={`message ${msg.type.toLowerCase()}`}>
//                             {msg.type === 'JOIN' && (
//                                 <div className="system-message">
//                                     {msg.sender} joined the chat
//                                 </div>
//                             )}
//                             {msg.type === 'LEAVE' && (
//                                 <div className="system-message">
//                                     {msg.sender} left the chat
//                                 </div>
//                             )}
//                             {msg.type === 'CHAT' && (
//                                 <div className={`chat-message ${msg.sender === username ? 'own-message' : ''}`}>
//                                     <div className="message-info">
//                                         <span className="sender" style={{ color: msg.color || '#007bff' }}>
//                                             {msg.sender}
//                                         </span>
//                                         <span className="time">{formatTime(msg.timestamp)}</span>
//                                     </div>
//                                     <div className="message-text">{msg.content}</div>
//                                 </div>
//                             )}
//                         </div>
//                     ))}

//                     {isTyping && isTyping !== username && (
//                         <div className="typing-indicator">
//                             {isTyping} is typing...
//                         </div>
//                     )}

//                     <div ref={messagesEndRef} />
//                 </div>

//                 <div className="input-area">
//                     {showEmojiPicker && (
//                         <div className="emoji-picker">
//                             {emojis.map(emoji => (
//                                 <button key={emoji} onClick={() => addEmoji(emoji)}>
//                                     {emoji}
//                                 </button>
//                             ))}
//                         </div>
//                     )}

//                     <form onSubmit={sendMessage} className="message-form">
//                         <button
//                             type="button"
//                             onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                             className="emoji-btn"
//                         >
//                             😀
//                         </button>
//                         <input
//                             type="text"
//                             placeholder="Type a message..."
//                             value={message}
//                             onChange={handleTyping}
//                             className="message-input"
//                             maxLength={500}
//                         />
//                         <button type="submit" disabled={!message.trim()} className="send-btn">
//                             Send
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {Array.from(privateChats.keys()).map(otherUser => (
//                 <PrivateChat
//                     key={otherUser}
//                     currentUser={username}
//                     recipientUser={otherUser}
//                     userColor={userColor}
//                     stompClient={stompClient}
//                     onClose={() => closePrivateChat(otherUser)}
//                     registerPrivateMessageHandler={registerPrivateMessageHandler}
//                     unregisterPrivateMessageHandler={unregisterPrivateMessageHandler}
//                 />
//             ))}
//         </div>
//     );
// };

// export default ChatArea;




import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { authService } from "../services/authService";
import PrivateChat from "./PrivateChat";

const ChatArea = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState("");
  const [privateChats, setPrivateChats] = useState(new Map());
  const [unreadMessages, setUnreadMessages] = useState(new Map());

  const privateMessageHandlers = useRef(new Map());
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "👍",
    "❤️",
    "🎉",
    "🔥",
    "😎",
    "⭐",
    "✨",
    "💯",
    "🎂",
  ];

  if (!currentUser) {
    return null;
  }

  const { username, color: userColor } = currentUser;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const registerPrivateMessageHandler = useCallback((otherUser, handler) => {
    privateMessageHandlers.current.set(otherUser, handler);
  }, []);

  const unregisterPrivateMessageHandler = useCallback((otherUser) => {
    privateMessageHandlers.current.delete(otherUser);
  }, []);

  useEffect(() => {
    let reconnectInterval;
    const connectAndFetch = async () => {
      if (!username) return;

      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.add(username);
        return newSet;
      });

      const socket = new SockJS("http://localhost:8080/ws");
      stompClient.current = Stomp.over(socket);

      stompClient.current.connect(
        {
          "client-id": username,
          "session-id": Date.now().toString(),
          username: username,
        },
        (frame) => {
          clearInterval(reconnectInterval);

          const publicSub = stompClient.current.subscribe(
            "/topic/public",
            (msg) => {
              const chatMessage = JSON.parse(msg.body);

              setOnlineUsers((prev) => {
                const newUsers = new Set(prev);
                if (chatMessage.type === "JOIN") {
                  newUsers.add(chatMessage.sender);
                } else if (chatMessage.type === "LEAVE") {
                  newUsers.delete(chatMessage.sender);
                }
                return newUsers;
              });

              if (chatMessage.type === "TYPING") {
                setIsTyping(chatMessage.sender);
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                  setIsTyping("");
                }, 2000);
                return;
              }

              setMessages((prev) => [
                ...prev,
                {
                  ...chatMessage,
                  timestamp: chatMessage.timestamp || new Date(),
                  id: chatMessage.id || Date.now() + Math.random(),
                },
              ]);
            }
          );

          const privateSub = stompClient.current.subscribe(
            `/user/${username}/queue/private`,
            (msg) => {
              const privateMessage = JSON.parse(msg.body);
              const otherUser =
                privateMessage.sender === username
                  ? privateMessage.recipient
                  : privateMessage.sender;
              const handler = privateMessageHandlers.current.get(otherUser);

              if (handler) {
                try {
                  handler(privateMessage);
                } catch (error) {
                  console.error("Error calling handler:", error);
                }
              } else if (privateMessage.recipient === username) {
                setUnreadMessages((prev) => {
                  const newUnread = new Map(prev);
                  const currentCount = newUnread.get(otherUser) || 0;
                  newUnread.set(otherUser, currentCount + 1);
                  return newUnread;
                });
              }
            }
          );

          stompClient.current.send(
            "/app/chat.addUser",
            {},
            JSON.stringify({
              sender: username,
              type: "JOIN",
              color: userColor,
            })
          );

          authService
            .getOnlineUsers()
            .then((data) => {
              const fetchedUsers = Object.keys(data);
              setOnlineUsers((prev) => {
                const mergedSet = new Set(prev);
                fetchedUsers.forEach((user) => mergedSet.add(user));
                mergedSet.add(username);
                return mergedSet;
              });
            })
            .catch((error) => {
              console.error("Error fetching initial online users:", error);
            });
        },
        (error) => {
          console.error("STOMP connection error:", error);
          if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
              connectAndFetch();
            }, 5000);
          }
        }
      );
    };

    connectAndFetch();

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect();
      }
      clearTimeout(typingTimeoutRef.current);
      clearInterval(reconnectInterval);
    };
  }, [
    username,
    userColor,
    registerPrivateMessageHandler,
    unregisterPrivateMessageHandler,
  ]);

  const openPrivateChat = (otherUser) => {
    if (otherUser === username) return;

    setPrivateChats((prev) => {
      const newChats = new Map(prev);
      newChats.set(otherUser, true);
      return newChats;
    });

    setUnreadMessages((prev) => {
      const newUnread = new Map(prev);
      newUnread.delete(otherUser);
      return newUnread;
    });
  };

  const closePrivateChat = (otherUser) => {
    setPrivateChats((prev) => {
      const newChats = new Map(prev);
      newChats.delete(otherUser);
      return newChats;
    });
    unregisterPrivateMessageHandler(otherUser);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (
      message.trim() &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const chatMessage = {
        sender: username,
        content: message,
        type: "CHAT",
        color: userColor,
      };

      stompClient.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (
      stompClient.current &&
      stompClient.current.connected &&
      e.target.value.trim()
    ) {
      stompClient.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({
          sender: username,
          type: "TYPING",
        })
      );
    }
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDisconnect = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Matrix Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rotate-45 animate-float-1 opacity-30"></div>
        <div className="absolute top-40 right-32 w-3 h-3 border border-purple-500 rotate-45 animate-float-2 opacity-30"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-pink-500 rounded-full animate-float-3 opacity-30"></div>
        <div className="absolute top-60 left-3/4 w-6 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-px h-6 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse opacity-50"></div>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-80 lg:w-96 flex-col backdrop-blur-2xl bg-white/5 border-r border-white/10 transition-all duration-300">
          {/* Sidebar Header */}
          <div className="p-4 lg:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Users
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {Array.from(onlineUsers).length} ONLINE
                </p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-4 space-y-2">
            {Array.from(onlineUsers).map((user) => (
              <div
                key={user}
                className={`group relative p-3 lg:p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 animate-fade-in ${
                  user === username
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30"
                    : "backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50"
                }`}
                onClick={() => openPrivateChat(user)}
              >
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="relative">
                    <div
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg transform group-hover:scale-110 transition-all duration-300"
                      style={{
                        backgroundColor:
                          user === username ? userColor : "#007bff",
                      }}
                    >
                      {user.charAt(0).toUpperCase()}
                    </div>
                    {/* Online Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>

                    {/* Holographic Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm lg:text-base group-hover:text-cyan-300 transition-colors">
                        {user}
                      </span>
                      {user === username && (
                        <span className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs rounded-full font-bold">
                          (You)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Active now</span>
                    </div>
                  </div>

                  {/* Unread Messages Badge */}
                  {unreadMessages.has(user) && (
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce shadow-lg shadow-pink-500/50">
                      {unreadMessages.get(user)}
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col backdrop-blur-2xl bg-black/50">
          {/* Chat Header */}
          <div className="p-4 lg:p-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Chat Area
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Welcome,{" "}
                  <span className="text-cyan-400 font-medium">{username}!</span>
                </p>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="backdrop-blur-xl bg-white/10 border border-green-400/30 rounded-full px-2 md:px-3 py-1 flex items-center space-x-1 md:space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium hidden sm:inline">
                    CONNECTED
                  </span>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-cyan-400/30 rounded-full px-2 md:px-3 py-1 text-xs text-cyan-400 font-mono">
                  {Array.from(onlineUsers).length}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`animate-fade-in-up`}>
                {msg.type === "JOIN" && (
                  <div className="flex justify-center">
                    <div className="backdrop-blur-xl bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 text-green-400 text-sm font-medium">
                      ✨ {msg.sender} joined the chat
                    </div>
                  </div>
                )}

                {msg.type === "LEAVE" && (
                  <div className="flex justify-center">
                    <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2 text-red-400 text-sm font-medium">
                      ⚡ {msg.sender} left the chat
                    </div>
                  </div>
                )}

                {msg.type === "CHAT" && (
                  <div
                    className={`flex ${
                      msg.sender === username ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`group relative max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                        msg.sender === username
                          ? "backdrop-blur-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/50"
                          : "backdrop-blur-xl bg-white/10 border border-white/20"
                      } rounded-2xl p-3 md:p-4 transform hover:scale-105 transition-all duration-300 shadow-lg`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-sm font-bold truncate"
                          style={{ color: msg.color || "#007bff" }}
                        >
                          {msg.sender}
                        </span>
                        <span className="text-xs text-gray-400 font-mono ml-3 flex-shrink-0">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <div className="text-white break-words leading-relaxed text-sm md:text-base">
                        {msg.content}
                      </div>

                      {/* Message Glow Effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none ${
                          msg.sender === username
                            ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                            : "bg-white/10"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && isTyping !== username && (
              <div className="flex justify-start">
                <div className="backdrop-blur-xl bg-white/10 border border-purple-400/30 rounded-2xl px-4 py-3 flex items-center space-x-2 animate-pulse">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-purple-400 text-sm font-medium ml-2">
                    {isTyping} is typing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 lg:p-6 border-t border-white/10 backdrop-blur-xl bg-white/5">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-4 p-3 md:p-4 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl">
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:scale-110 hover:border-cyan-400/50 transition-all duration-300 text-lg md:text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={sendMessage}
              className="flex items-center space-x-2 md:space-x-3"
            >
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="group w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:border-cyan-400/50 hover:scale-110 transition-all duration-300 text-lg md:text-xl lg:text-2xl flex-shrink-0"
              >
                <span className="group-hover:animate-bounce">😀</span>
              </button>

              {/* Message Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={handleTyping}
                  maxLength={500}
                  className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm md:text-base"
                />

                {/* Input Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim()}
                className="group relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:scale-110 enabled:hover:shadow-lg enabled:hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden flex-shrink-0"
              >
                <span className="relative z-10 text-white text-lg md:text-xl lg:text-2xl group-hover:animate-pulse">
                  🚀
                </span>

                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>

            {/* Character Counter */}
            <div className="mt-2 text-right">
              <span
                className={`text-xs font-mono ${
                  message.length > 450 ? "text-red-400" : "text-gray-500"
                }`}
              >
                {message.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Users List Toggle - Only shown on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 text-white hover:bg-white/20 transition-all duration-300">
          <div className="w-5 h-5 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
          </div>
        </button>
      </div>

      {/* Private Chats */}
      {Array.from(privateChats.keys()).map((otherUser) => (
        <PrivateChat
          key={otherUser}
          currentUser={username}
          recipientUser={otherUser}
          userColor={userColor}
          stompClient={stompClient}
          onClose={() => closePrivateChat(otherUser)}
          registerPrivateMessageHandler={registerPrivateMessageHandler}
          unregisterPrivateMessageHandler={unregisterPrivateMessageHandler}
        />
      ))}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes matrix-rain {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(225deg);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg) scale(1);
          }
          50% {
            transform: translateY(-15px) rotate(135deg) scale(1.2);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.3);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-matrix-rain {
          animation: matrix-rain linear infinite;
        }
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ChatArea;
