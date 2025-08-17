import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaHome, FaBoxOpen, FaInfoCircle, FaEnvelope, FaChartLine } from 'react-icons/fa';
import { FiHome, FiBookOpen, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutError('');
      navigate('/login');
    } catch (err) {
      setLogoutError('Logout failed. Please try again.');
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-3 text-center text-white bg-gray-900 sticky top-0 z-50 font-medium tracking-wide shadow-md">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
     <nav 
      aria-label="Main navigation" 
      className={`w-full px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen 
          ? 'bg-gradient-to-r from-gray-900 via-purple-900 to-black/95 backdrop-blur-md shadow-lg border-b border-purple-800' 
          : 'bg-gradient-to-r from-gray-900 via-purple-900 to-black/80 backdrop-blur-sm'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 z-50">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tight flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" 
          tabIndex={0} 
          aria-label="Go to homepage"
          onClick={handleLinkClick}
        >
          <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">App</span>
          <span className="text-white">Orbit</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        <div className="flex gap-6 mr-6">
          <NavLink to="/" currentPath={location.pathname} onClick={handleLinkClick}>
            Home
          </NavLink>
          <NavLink to="/products" currentPath={location.pathname} onClick={handleLinkClick}>
            Products
          </NavLink>
          <NavLink to="/about" currentPath={location.pathname} onClick={handleLinkClick}>
            About
          </NavLink>
          <NavLink to="/contact" currentPath={location.pathname} onClick={handleLinkClick}>
            Contact
          </NavLink>
          <NavLink to="/animation-demo" currentPath={location.pathname} onClick={handleLinkClick}>
            3D Animations
          </NavLink>
        </div>

        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Login"
              >
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium text-purple-100 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Register"
              >
                Register
              </button>
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button 
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={user.photoURL || 'https://i.ibb.co/2kR5zq0/default-user.png'}
                alt="User profile"
                className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-purple-500 transition-colors"
              />
              <FaChevronDown className={`text-xs text-gray-400 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-700 animate-fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  onClick={handleLinkClick}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-50">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu Content - Dark Gradient Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-start md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen shadow-2xl px-6 pt-6 pb-4 flex flex-col animate-fade-in">
          {/* Header: Logo and Close Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 text-2xl font-bold">App</span>
              <span className="text-white text-2xl font-bold">Orbit</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-gray-400 hover:text-indigo-400 bg-transparent rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close menu"
            >
              <FaTimes size={28} />
            </button>
          </div>
          {/* Menu Items */}
          <nav className="flex flex-col gap-2 mb-8">
            <NavLinkMobile to="/" currentPath={location.pathname} onClick={handleLinkClick}>
              <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-100 hover:bg-indigo-900/40 hover:text-indigo-300 transition-colors w-full">
                <FaHome className="text-lg" /> Home
              </span>
            </NavLinkMobile>
            <NavLinkMobile to="/products" currentPath={location.pathname} onClick={handleLinkClick}>
              <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-100 hover:bg-indigo-900/40 hover:text-indigo-300 transition-colors w-full">
                <FaBoxOpen className="text-lg" /> Products
              </span>
            </NavLinkMobile>
            <NavLinkMobile to="/about" currentPath={location.pathname} onClick={handleLinkClick}>
              <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-100 hover:bg-indigo-900/40 hover:text-indigo-300 transition-colors w-full">
                <FaInfoCircle className="text-lg" /> About
              </span>
            </NavLinkMobile>
            <NavLinkMobile to="/contact" currentPath={location.pathname} onClick={handleLinkClick}>
              <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-100 hover:bg-indigo-900/40 hover:text-indigo-300 transition-colors w-full">
                <FaEnvelope className="text-lg" /> Contact
              </span>
            </NavLinkMobile>
            <NavLinkMobile to="/animation-demo" currentPath={location.pathname} onClick={handleLinkClick}>
              <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-100 hover:bg-indigo-900/40 hover:text-indigo-300 transition-colors w-full">
                <FiBarChart2 className="text-lg" /> 3D Animations
              </span>
            </NavLinkMobile>
            <NavLinkMobile to="/dashboard" currentPath={location.pathname} onClick={handleLinkClick}>
              <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-100 hover:bg-indigo-900/40 hover:text-indigo-300 transition-colors w-full">
                <FaChartLine className="text-lg" /> Dashboard
              </span>
            </NavLinkMobile>
          </nav>
          <hr className="my-4 border-gray-700" />
          {/* Profile and Logout */}
          <div className="flex flex-col gap-3 mt-auto">
            {isLoggedIn && (
              <div className="flex items-center gap-3 px-2">
                <img
                  src={user.photoURL || 'https://i.ibb.co/2kR5zq0/default-user.png'}
                  alt="User profile"
                  className="w-10 h-10 rounded-full border-2 border-indigo-400 object-cover"
                />
                <span className="text-base font-medium text-gray-100">{user.displayName || 'User'}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-6 py-3 rounded-xl text-base font-bold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>


      {/* Logout Error Notification */}
      {logoutError && (
        <div className="fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span>{logoutError}</span>
            <button 
              onClick={() => setLogoutError('')}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Dismiss error"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, currentPath, onClick, children }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`relative px-1 py-2 text-sm font-medium transition-colors ${
        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></span>
      )}
    </Link>
  );
};

// Reusable NavLink component for mobile
const NavLinkMobile = ({ to, currentPath, onClick, children }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
        isActive 
          ? 'text-white bg-gray-800' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;