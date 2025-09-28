import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService.js";
// CSS file removed - using Tailwind instead

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-2xl bg-black/70 border-b border-white/10 shadow-2xl shadow-cyan-500/10"
          : "backdrop-blur-xl bg-black/30"
      }`}
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-lg"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 rounded-lg p-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  💬
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                Chat Application
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Chat Area Link */}
                <Link
                  to="/chatarea"
                  className="group relative px-4 py-2 text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Chat Area</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>

                {/* User Info Section */}
                <div className="flex items-center space-x-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-2">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>

                  {/* Welcome Text */}
                  <span className="text-gray-300 text-sm hidden lg:block">
                    Welcome,{" "}
                    <span className="text-cyan-300 font-medium">
                      {currentUser?.username}
                    </span>
                  </span>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group relative px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-medium rounded-full hover:from-red-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    <span className="relative z-10">Logout</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="group relative px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium rounded-full hover:from-cyan-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Signup Button */}
                <Link
                  to="/signup"
                  className="group relative px-6 py-2 backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white font-medium rounded-full hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Signup</span>
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5">
                    <div className="h-full w-full backdrop-blur-xl bg-white/10 rounded-full"></div>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block w-full h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 top-3" : "top-2"
                }`}
              ></span>
              <span
                className={`absolute block w-full h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "top-3"
                }`}
              ></span>
              <span
                className={`absolute block w-full h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 top-3" : "top-4"
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mt-4 space-y-4">
            {isAuthenticated ? (
              <>
                {/* Mobile User Info */}
                <div className="flex items-center space-x-3 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Welcome!</div>
                    <div className="text-cyan-300 text-sm">
                      {currentUser?.username}
                    </div>
                  </div>
                </div>

                {/* Mobile Chat Area Link */}
                <Link
                  to="/chatarea"
                  className="flex items-center space-x-3 p-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">💬</span>
                  <span>Chat Area</span>
                </Link>

                {/* Mobile Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-500 hover:to-pink-500 transition-all duration-300"
                >
                  <span className="text-xl">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Mobile Login Button */}
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium rounded-xl hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">⚡</span>
                  <span>Login</span>
                </Link>

                {/* Mobile Signup Button */}
                <Link
                  to="/signup"
                  className="flex items-center justify-center space-x-3 p-4 backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">✨</span>
                  <span>Signup</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating particles for decoration */}
      <div className="absolute top-4 left-20 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
      <div className="absolute top-6 right-32 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
    </nav>
  );
};

export default Navbar;


// import {Link, useNavigate} from "react-router-dom";
// import {authService} from "../services/authService.js";
// import '../styles/Navbar.css';

// const Navbar = () =>{

//     const navigate = useNavigate();
//     const isAuthenticated = authService.isAuthenticated();
//     const currentUser = authService.getCurrentUser();

//     const handleLogout = async () => {
//         try{
//             await authService.logout();
//             navigate('/login');
//         }
//         catch (error) {
//             console.error('Logout failed', error);
//             localStorage.clear();
//             navigate('/login');
//         }
//     }

//     return (

//         <nav className="navbar">
//             <div className="navbar-container">
//                 <Link to="/" className="navbar-brand">
//                     Chat Application
//                 </Link>

//                 <div className="navbar-menu">
//                     {isAuthenticated ? (
//                         <>
//                             <Link to="/chatarea" className="navbar-link">
//                                 Chat area
//                             </Link>
//                             <div className="navbar-user">
//                                 <span className="user-info">
//                                     Welcome, {currentUser.username}
//                                 </span>
//                                 <button className="logout-btn" onClick={handleLogout}>
//                                     Logout
//                                 </button>
//                             </div>
//                         </>
//                     ) : (
//                             <>
//                                 <Link to='/login' className="navbar-link">
//                                     Login
//                                 </Link>
//                                 <Link to='/signup' className="navbar-link">
//                                     Signup
//                                 </Link>
//                             </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;