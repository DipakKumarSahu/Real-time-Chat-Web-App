import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    // Auto-rotate features
    const featureTimer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(featureTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const trendingTopics = [
    { topic: "General Chat", count: "2.1k", trend: "+5%" },
    { topic: "Tech Talk", count: "1.3k", trend: "+8%" },
    { topic: "Random", count: "800", trend: "+3%" },
    { topic: "Gaming", count: "650", trend: "+12%" },
    { topic: "Study Group", count: "420", trend: "+6%" },
  ];

  const stats = [
    { label: "Active Users", value: "5.2k", icon: "👥" },
    { label: "Messages Today", value: "12.5k", icon: "💬" },
    { label: "Group Chats", value: "150+", icon: "🌍" },
    { label: "Online Now", value: "856", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Matrix-like Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
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
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rotate-45 animate-float-1"></div>
        <div className="absolute top-40 right-32 w-3 h-3 border border-purple-500 rotate-45 animate-float-2"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-pink-500 rounded-full animate-float-3"></div>
        <div className="absolute top-60 left-3/4 w-6 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-px h-6 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>
      </div>

      {/* Holographic Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-cyan-500 via-transparent to-cyan-500"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-purple-500 via-transparent to-purple-500"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-pink-500 via-transparent to-pink-500"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-cyan-500 via-transparent to-cyan-500"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-purple-500 via-transparent to-purple-500"></div>
      </div>

      <div className="relative z-10 px-4">
        {/* Top Status Bar */}
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/30 rounded-full px-4 py-2 text-sm">
              <span className="text-cyan-400">●</span>
              <span className="text-white ml-2">LIVE</span>
            </div>
            <div className="text-gray-400 text-sm font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {stats.slice(0, 2).map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs"
              >
                <span className="text-gray-400">{stat.icon}</span>
                <span className="text-white ml-1">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Hero Section */}
        <div
          className="text-center mb-20 relative"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {/* Holographic Logo */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-pink-500/20 border border-cyan-400/50 rounded-2xl p-6 transform hover:rotate-y-12 transition-all duration-500">
              <div className="text-6xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                Welcome
              </div>
              <div className="text-sm text-gray-400 mt-1 tracking-widest">
                CHAT PROTOCOL
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-none">
            <span className="block text-white drop-shadow-2xl">
              THE FUTURE OF
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
              COMMUNICATION
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with friends and communities through our modern chat
            platform. Simple, fast, and secure messaging for everyone.
          </p>

          {/* Trending Topics Bar */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-3 inline-flex items-center space-x-4 mb-12 flex-wrap justify-center">
            <span className="text-gray-400 text-sm">🔥 POPULAR:</span>
            <div className="flex items-center space-x-4 lg:space-x-6 text-sm flex-wrap justify-center">
              {trendingTopics.slice(0, 3).map((trend, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-white">{trend.topic}</span>
                  <span className="text-green-400 text-xs">{trend.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
          {[
            {
              icon: "👥",
              title: "Group Chats",
              desc: "Create and join group conversations with friends and communities",
              tech: "Real-time Sync",
              color: "from-cyan-500/20 to-blue-600/20",
              accent: "cyan",
            },
            {
              icon: "💬",
              title: "Private Messages",
              desc: "Send personal messages directly to other users securely",
              tech: "End-to-End",
              color: "from-purple-500/20 to-violet-600/20",
              accent: "purple",
            },
            {
              icon: "😊",
              title: "Rich Emojis",
              desc: "Express yourself with a wide variety of emojis and reactions",
              tech: "Unicode Support",
              color: "from-pink-500/20 to-red-600/20",
              accent: "pink",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`group relative backdrop-blur-2xl bg-gradient-to-br ${
                feature.color
              } border border-white/20 rounded-3xl p-8 transform transition-all duration-700 hover:scale-105 hover:-translate-y-4 ${
                activeFeature === index ? "ring-2 ring-cyan-400/50" : ""
              }`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              {/* Tech Badge */}
              <div className="absolute -top-3 right-4 backdrop-blur-xl bg-black/50 border border-white/20 rounded-full px-3 py-1 text-xs text-gray-300">
                {feature.tech}
              </div>

              {/* Holographic Icon */}
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 bg-${feature.accent}-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-full`}
                ></div>
                <div className="relative text-7xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-white transition-colors">
                {feature.desc}
              </p>

              {/* Progress Indicator */}
              <div className="relative">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${feature.accent}-400 to-${feature.accent}-600 rounded-full transition-all duration-1000`}
                    style={{ width: activeFeature === index ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
              ></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 mb-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl lg:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs lg:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="text-center mb-20">
          {isAuthenticated ? (
            <button className="group relative inline-flex items-center px-16 py-6 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold text-xl rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 mr-4 text-2xl group-hover:animate-spin">
                🚀
              </span>
              <span className="relative z-10">ENTER NEXUS</span>

              {/* Scanning Line Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/chatarea"
                className="group relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold text-lg rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* <span className="relative z-10 mr-3 text-xl">⚡</span> */}
                <span className="mr-3 text-xl group-hover:animate-bounce z-40">
                  ✨
                </span>
                <span className="relative z-10">GO TO CHAT AREA</span>
              </Link>

              {/* <button className="group relative inline-flex items-center px-12 py-5 backdrop-blur-2xl bg-white/10 border-2 border-white/30 text-white font-bold text-lg rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                <span className="mr-3 text-xl group-hover:animate-bounce z-40">
                  ✨
                </span>
                <span className=" z-40">JOIN PROTOCOL</span> */}

              {/* Animated Border */}
              {/* <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5">
                  <div className="h-full w-full backdrop-blur-2xl bg-white/10 rounded-full"></div>
                </div>
              </button> */}
            </div>
          )}
        </div>

        {/* Footer Section  */}
        <div className="text-center text-gray-500 text-sm mb-8">
          <p>Simple • Secure • Fast Messaging</p>
          <p className="mt-2">
            © 2025 Chat Web App. Built for real conversations.
          </p>
        </div>
      </div>

      {/* Custom Animations */}
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

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes rotate-y-12 {
          from {
            transform: perspective(1000px) rotateY(0deg);
          }
          to {
            transform: perspective(1000px) rotateY(12deg);
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
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .hover\\:rotate-y-12:hover {
          transform: perspective(1000px) rotateY(12deg);
        }
      `}</style>
    </div>
  );
};

export default MainPage;
