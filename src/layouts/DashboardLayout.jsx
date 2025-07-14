import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useUserRole from '../hooks/useUserRole';
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';

const sidebarLinks = {
  user: [
    { to: '/dashboard/user/my-profile', label: 'My Profile' },
    { to: '/dashboard/user/add-product', label: 'Add Product' },
    { to: '/dashboard/user/my-products', label: 'My Products' },
  ],
  moderator: [
    { to: '/dashboard/moderator/review-queue', label: 'Product Review Queue' },
    { to: '/dashboard/moderator/reported-contents', label: 'Reported Contents' },
  ],
  admin: [
    { to: '/dashboard/admin/statistics', label: 'Statistics' },
    { to: '/dashboard/admin/manage-users', label: 'Manage Users' },
    { to: '/dashboard/admin/manage-coupons', label: 'Manage Coupons' },
  ],
};

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (roleLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-indigo-400 bg-dot-grid">
        Loading Dashboard...
      </div>
    );
  }

  const links = sidebarLinks[role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 via-purple-900 to-black border-b border-purple-800">
        <button 
          onClick={goToHomepage}
          className="text-purple-400 hover:text-purple-300"
        >
          <FaHome size={20} />
        </button>
        <button 
          onClick={goToHomepage}
          className="text-xl font-bold text-purple-400 tracking-tight hover:text-purple-300 transition-colors cursor-pointer"
        >
          App<span className="text-gray-200">Orbit</span>
        </button>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-black bg-opacity-95">
          <div className="flex flex-col h-full p-4">
            {/* Close Button */}
            <div className="flex justify-end">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white mb-4"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* User Profile Info */}
            <div className="flex flex-col items-center text-center py-4 border-b border-purple-800 px-4">
              <img
                src={user?.photoURL || 'https://i.ibb.co/SsZ9LgB/user.png'}
                alt="User"
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
              <p className="text-sm font-medium text-gray-200">{user?.displayName || 'Guest User'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition ${
                    location.pathname === link.to
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-purple-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-purple-800">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-md text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-900 via-purple-900 to-black border-r border-purple-800 shadow-md hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-purple-800">
          <button 
            onClick={goToHomepage}
            className="text-2xl font-bold text-purple-400 tracking-tight hover:text-purple-300 transition-colors cursor-pointer"
          >
            App<span className="text-gray-200">Orbit</span>
          </button>
        </div>

        {/* User Profile Info */}
        <div className="flex flex-col items-center text-center py-6 border-b border-purple-800 px-4">
          <img
            src={user?.photoURL || 'https://i.ibb.co/SsZ9LgB/user.png'}
            alt="User"
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
          <p className="text-sm font-medium text-gray-200">{user?.displayName || 'Guest User'}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2 rounded-lg font-medium transition ${
                location.pathname === link.to
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-purple-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-purple-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-md text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;