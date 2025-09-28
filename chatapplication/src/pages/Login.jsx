import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setMessage("Login successful");
        setTimeout(() => {
          navigate("/chatarea");
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message || "login failed, please try again.");
      console.error("login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Matrix Background */}
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rotate-45 animate-float-1 opacity-40"></div>
        <div className="absolute top-40 right-32 w-3 h-3 border border-purple-500 rotate-45 animate-float-2 opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-pink-500 rounded-full animate-float-3 opacity-40"></div>
        <div className="absolute top-60 left-1/4 w-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-60"></div>
        <div className="absolute bottom-40 right-1/4 w-px h-8 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse opacity-60"></div>
      </div>

      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-cyan-500 via-transparent to-cyan-500"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-purple-500 via-transparent to-purple-500"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-cyan-500 via-transparent to-cyan-500"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-purple-500 via-transparent to-purple-500"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Holographic Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30 blur-3xl opacity-60 animate-pulse-slow"></div>

        {/* Login Box */}
        <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-10">
            {/* Logo/Title */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative backdrop-blur-xl bg-white/10 border border-cyan-400/30 rounded-2xl px-6 py-3">
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Login
                </h1>
              </div>
            </div>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Login to start chatting
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
                disabled={isLoading}
                className="relative w-full px-6 py-4 md:px-8 md:py-5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              />
              {/* Input Glow */}
              <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Password Input */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
                required
                disabled={isLoading}
                className="relative w-full px-6 py-4 md:px-8 md:py-5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              />
              <div className="absolute inset-0 rounded-2xl border border-purple-400/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!username.trim() || !password.trim() || isLoading}
              className="group relative w-full py-4 md:py-5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-bold text-base md:text-lg rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button Content */}
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl group-hover:animate-pulse">
                      🔐
                    </span>
                    <span>login</span>
                  </>
                )}
              </div>

              {/* Scanning Line Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-2xl backdrop-blur-xl border text-center text-sm md:text-base font-medium animate-fade-in ${
                  message.includes("successful")
                    ? "bg-green-500/20 border-green-400/30 text-green-400"
                    : "bg-red-500/20 border-red-400/30 text-red-400"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">
                    {message.includes("successful") ? "✅" : "❌"}
                  </span>
                  <span>{message}</span>
                </div>
              </div>
            )}
          </form>

          {/* Signup Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm md:text-base">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors duration-300"
              >
                Join Us
              </button>
            </p>
          </div>

          {/* Forgot Password Link */}
          {/* <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium hover:underline transition-colors duration-300"
            >
              Forgot Password?
            </button>
          </div> */}

          {/* Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-50"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400 opacity-50"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-pink-400 opacity-50"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-50"></div>
        </div>

        {/* Tech Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-cyan-400 font-medium">SECURE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-400 font-medium">
                INSTANT
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        
      </div>

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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
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
          animation: fade-in 0.8s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
