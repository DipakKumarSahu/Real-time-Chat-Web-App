import React, { useState, useEffect, useRef } from "react";

const PrivateChat = ({
  currentUser,
  recipientUser,
  userColor,
  stompClient,
  onClose,
  registerPrivateMessageHandler,
  unregisterPrivateMessageHandler,
}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM has fully updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  const createMessageId = (msg) => {
    return `${msg.sender}-${msg.recipient}-${msg.content}-${msg.timestamp}`;
  };

  const handleIncomingPrivateMessage = (privateMessage) => {
    const messageId = privateMessage.id || createMessageId(privateMessage);
    const isOwnMessage = privateMessage.sender === currentUser;

    const isRelevantMessage =
      (privateMessage.sender === currentUser &&
        privateMessage.recipient === recipientUser) ||
      (privateMessage.sender === recipientUser &&
        privateMessage.recipient === currentUser);

    if (isRelevantMessage && !isOwnMessage) {
      if (!messageIdsRef.current.has(messageId)) {
        const newMessage = {
          ...privateMessage,
          id: messageId,
        };

        messageIdsRef.current.add(messageId);
        setMessages((prev) => [...prev, newMessage]);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadMessageHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/messages/private?user1=${currentUser}&user2=${recipientUser}`
        );
        if (response.ok && isMounted) {
          const history = await response.json();
          const processedHistory = history.map((msg) => {
            const messageId = msg.id || createMessageId(msg);
            return {
              ...msg,
              id: messageId,
            };
          });

          messageIdsRef.current.clear();
          processedHistory.forEach((msg) => {
            messageIdsRef.current.add(msg.id);
          });

          setMessages(processedHistory);
        }
      } catch (error) {
        console.error("Error loading message history:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMessageHistory();
    registerPrivateMessageHandler(recipientUser, handleIncomingPrivateMessage);

    return () => {
      isMounted = false;
      unregisterPrivateMessageHandler(recipientUser);
    };
  }, [
    currentUser,
    recipientUser,
    registerPrivateMessageHandler,
    unregisterPrivateMessageHandler,
  ]);

  const sendPrivateMessage = (e) => {
    e.preventDefault();

    if (
      message.trim() &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const timestamp = new Date();
      const privateMessage = {
        sender: currentUser,
        recipient: recipientUser,
        content: message.trim(),
        type: "PRIVATE_MESSAGE",
        color: userColor,
        timestamp: timestamp,
      };

      const messageId = createMessageId(privateMessage);
      const messageWithId = {
        ...privateMessage,
        id: messageId,
      };

      // Clear input first
      setMessage("");

      if (!messageIdsRef.current.has(messageId)) {
        messageIdsRef.current.add(messageId);
        setMessages((prev) => [...prev, messageWithId]);
      }

      try {
        if (stompClient.current.connected) {
          stompClient.current.send(
            "/app/chat.sendPrivateMessage",
            {},
            JSON.stringify(privateMessage)
          );
        } else {
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
          messageIdsRef.current.delete(messageId);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        messageIdsRef.current.delete(messageId);
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-0 right-5 w-[350px] h-[500px] backdrop-blur-2xl bg-black/80 border border-cyan-400/30 rounded-t-3xl shadow-[0_-4px_30px_rgba(6,182,212,0.3)] flex flex-col z-[1000] animate-slideUp overflow-hidden max-[480px]:right-2.5 max-[480px]:w-[calc(100vw-20px)] max-[480px]:max-w-[350px]">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${Math.random() * 100 + 30}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-b border-cyan-400/30 p-5 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center">
              <span className="mr-2">💬</span>
              {recipientUser}
            </h3>
            <button
              onClick={onClose}
              className="group relative w-8 h-8 backdrop-blur-xl bg-red-500/20 border border-red-400/40 rounded-full text-red-400 hover:bg-red-500/30 hover:border-red-400/60 hover:scale-110 transition-all duration-300 flex items-center justify-center text-sm overflow-hidden"
            >
              <span className="relative z-10">✕</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-cyan-400 text-base font-medium">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span>Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-5 w-[350px] h-[500px] backdrop-blur-2xl bg-black/80 border border-cyan-400/30 rounded-t-3xl shadow-[0_-4px_30px_rgba(6,182,212,0.3)] flex flex-col z-[1000] animate-slideUp overflow-hidden max-[480px]:right-2.5 max-[480px]:w-[calc(100vw-20px)] max-[480px]:max-w-[350px]">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 30}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-1 h-1 bg-purple-400 rounded-full animate-float-1 opacity-40"></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 border border-cyan-400 rotate-45 animate-float-2 opacity-40"></div>
        <div className="absolute bottom-20 left-8 w-2 h-2 bg-pink-500 rounded-full animate-float-3 opacity-40"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-b border-cyan-400/30 px-6 py-4 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {recipientUser.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
            </div>
            <div>
              <h3 className="m-0 text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center">
                <span className="mr-2">💬</span>
                {recipientUser}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400 font-mono">
                  ACTIVE NOW
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group relative w-8 h-8 backdrop-blur-xl bg-red-500/20 border border-red-400/40 rounded-full text-red-400 hover:bg-red-500/30 hover:border-red-400/60 hover:scale-110 transition-all duration-300 flex items-center justify-center text-sm overflow-hidden"
          >
            <span className="relative z-10">✕</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-400 italic">No messages yet.</p>
              <p className="text-cyan-400 text-sm font-medium">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`group max-w-[80%] animate-fade-in-up max-[480px]:max-w-[85%] ${
                msg.sender === currentUser
                  ? "self-end ml-auto"
                  : "self-start mr-auto"
              }`}
            >
              <div className="flex items-center justify-between mb-1 px-1">
                <span
                  className="text-xs font-bold"
                  style={{ color: msg.color || "#6B73FF" }}
                >
                  {msg.sender === currentUser ? "You" : msg.sender}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div
                className={`relative overflow-hidden py-3 px-4 break-words leading-relaxed text-sm shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] ${
                  msg.sender === currentUser
                    ? "backdrop-blur-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 text-white rounded-[18px_18px_4px_18px]"
                    : "backdrop-blur-xl bg-white/10 text-white border border-white/20 rounded-[18px_18px_18px_4px]"
                }`}
              >
                {msg.content}

                {/* Message Glow Effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none ${
                    msg.sender === currentUser
                      ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-[18px_18px_4px_18px]"
                      : "bg-white/10 rounded-[18px_18px_18px_4px]"
                  }`}
                ></div>

                {/* Holographic Border Effect */}
                <div
                  className={`absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    msg.sender === currentUser
                      ? "border-cyan-400/30 rounded-[18px_18px_4px_18px]"
                      : "border-purple-400/30 rounded-[18px_18px_18px_4px]"
                  }`}
                ></div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 px-5 py-4 border-t border-cyan-400/30 backdrop-blur-xl bg-black/30 max-[480px]:px-4 max-[480px]:py-3">
        <div
          className="flex gap-3 items-center"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendPrivateMessage(e);
            }
          }}
        >
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder={`Message ${recipientUser}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendPrivateMessage(e);
                }
              }}
              className="w-full py-3 px-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 text-sm outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/5 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.2)]"
              maxLength={500}
            />

            {/* Input Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <button
            onClick={sendPrivateMessage}
            disabled={!message.trim()}
            className="group relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white transition-all duration-300 shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:scale-110 hover:shadow-[0_6px_25px_rgba(6,182,212,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none overflow-hidden flex items-center justify-center text-lg"
          >
            <span className="relative z-10 group-hover:animate-pulse">🚀</span>

            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

            {/* Pulse Ring Effect */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 animate-ping"></div>
          </button>
        </div>

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

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes matrix-rain {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg) scale(1);
          }
          50% {
            transform: translateY(-8px) rotate(135deg) scale(1.2);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.3);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-matrix-rain {
          animation: matrix-rain linear infinite;
        }

        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 6s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 3s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default PrivateChat;
