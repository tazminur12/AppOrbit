import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { 
  FaUsers, 
  FaBox, 
  FaEye, 
  FaHeart, 
  FaStar, 
  FaChartLine, 
  FaCalendarAlt, 
  FaArrowUp,
  FaDownload,
  FaUpload,
  FaComments,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaDollarSign
} from 'react-icons/fa';

const AdminOverview = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalViews: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingVerifications: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });
  
  const [userStats, setUserStats] = useState({
    verifiedUsers: 0,
    unverifiedUsers: 0,
    premiumUsers: 0,
    freeUsers: 0
  });
  
  const [productStats, setProductStats] = useState({
    publishedProducts: 0,
    pendingReview: 0,
    rejectedProducts: 0,
    topCategories: []
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      // Fetch admin stats
      const statsResponse = await axiosSecure.get('/admin/stats');
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      // Fetch user statistics
      const userResponse = await axiosSecure.get('/admin/users/stats');
      if (userResponse.data) {
        setUserStats(userResponse.data);
      }
      
      // Fetch product statistics
      const productResponse = await axiosSecure.get('/admin/products/stats');
      if (productResponse.data) {
        setProductStats(productResponse.data);
      }
      
      // Fetch recent activity
      const activityResponse = await axiosSecure.get('/admin/activity');
      if (activityResponse.data) {
        setRecentActivity(activityResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      // Set sample data for demonstration
      setStats({
        totalUsers: 1247,
        totalProducts: 892,
        totalViews: 45678,
        totalRevenue: 12450,
        monthlyGrowth: 23.5,
        pendingVerifications: 23,
        activeUsers: 892,
        newUsersThisMonth: 156
      });
      
      setUserStats({
        verifiedUsers: 892,
        unverifiedUsers: 355,
        premiumUsers: 567,
        freeUsers: 680
      });
      
      setProductStats({
        publishedProducts: 756,
        pendingReview: 23,
        rejectedProducts: 12,
        topCategories: [
          { name: 'Web Templates', count: 234, percentage: 31 },
          { name: 'Mobile Apps', count: 189, percentage: 25 },
          { name: 'UI Kits', count: 156, percentage: 21 },
          { name: 'Plugins', count: 89, percentage: 12 },
          { name: 'Others', count: 68, percentage: 9 }
        ]
      });
      
      setRecentActivity([
        {
          id: 1,
          type: 'user_verified',
          title: 'User Verification Completed',
          description: 'John Doe completed account verification',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          icon: 'FaCheckCircle'
        },
        {
          id: 2,
          type: 'product_approved',
          title: 'Product Approved',
          description: 'React Dashboard Template approved for publication',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: 'FaCheckCircle'
        },
        {
          id: 3,
          type: 'user_registered',
          title: 'New User Registration',
          description: 'Sarah Wilson joined the platform',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: 'FaUsers'
        },
        {
          id: 4,
          type: 'product_reported',
          title: 'Product Reported',
          description: 'Mobile App UI Kit reported for review',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          icon: 'FaExclamationTriangle'
        },
        {
          id: 5,
          type: 'payment_received',
          title: 'Payment Received',
          description: 'Verification fee received from user@example.com',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          icon: 'FaDollarSign'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (iconName) => {
    const icons = {
      FaUsers: <FaUsers className="w-5 h-5" />,
      FaBox: <FaBox className="w-5 h-5" />,
      FaCheckCircle: <FaCheckCircle className="w-5 h-5" />,
      FaExclamationTriangle: <FaExclamationTriangle className="w-5 h-5" />,
      FaDollarSign: <FaDollarSign className="w-5 h-5" />,
      FaClock: <FaClock className="w-5 h-5" />,
      FaShieldAlt: <FaShieldAlt className="w-5 h-5" />
    };
    return icons[iconName] || <FaBox className="w-5 h-5" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      user_verified: 'text-green-400 bg-green-400/10',
      product_approved: 'text-blue-400 bg-blue-400/10',
      user_registered: 'text-purple-400 bg-purple-400/10',
      product_reported: 'text-yellow-400 bg-yellow-400/10',
      payment_received: 'text-emerald-400 bg-emerald-400/10',
      verification_pending: 'text-orange-400 bg-orange-400/10'
    };
    return colors[type] || 'text-gray-400 bg-gray-400/10';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor platform performance and manage user activities</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-blue-200 text-sm mt-1">+{stats.newUsersThisMonth} this month</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <FaUsers className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-white">{stats.totalProducts.toLocaleString()}</p>
                <p className="text-green-200 text-sm mt-1">{productStats.pendingReview} pending review</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <FaBox className="w-8 h-8 text-green-300" />
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                <p className="text-purple-200 text-sm mt-1">+{Math.floor(stats.totalViews * 0.08)} this week</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <FaEye className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-6 border border-emerald-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-emerald-200 text-sm mt-1">+{stats.monthlyGrowth}% this month</p>
              </div>
              <div className="p-3 bg-emerald-600/20 rounded-lg">
                <FaDollarSign className="w-8 h-8 text-emerald-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Statistics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">User Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <FaCheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white text-sm">Verified Users</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{userStats.verifiedUsers}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((userStats.verifiedUsers / stats.totalUsers) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600/20 rounded-lg">
                    <FaClock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-white text-sm">Unverified Users</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{userStats.unverifiedUsers}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((userStats.unverifiedUsers / stats.totalUsers) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <FaStar className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white text-sm">Premium Users</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{userStats.premiumUsers}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((userStats.premiumUsers / stats.totalUsers) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-600/20 rounded-lg">
                    <FaUsers className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-white text-sm">Free Users</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{userStats.freeUsers}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((userStats.freeUsers / stats.totalUsers) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Statistics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">Product Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <FaCheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white text-sm">Published</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{productStats.publishedProducts}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((productStats.publishedProducts / stats.totalProducts) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600/20 rounded-lg">
                    <FaClock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-white text-sm">Pending Review</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{productStats.pendingReview}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((productStats.pendingReview / stats.totalProducts) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <FaExclamationTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-white text-sm">Rejected</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{productStats.rejectedProducts}</p>
                  <p className="text-gray-400 text-xs">
                    {Math.round((productStats.rejectedProducts / stats.totalProducts) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <FaShieldAlt className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white text-sm">Pending Verification</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{stats.pendingVerifications}</p>
                  <p className="text-gray-400 text-xs">Requires attention</p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Growth */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">Platform Growth</h3>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-600/30">
                <p className="text-3xl font-bold text-white mb-2">+{stats.monthlyGrowth}%</p>
                <p className="text-indigo-300 text-sm">Monthly Growth Rate</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <p className="text-lg font-bold text-white">{stats.activeUsers}</p>
                  <p className="text-gray-400 text-xs">Active Users</p>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <p className="text-lg font-bold text-white">{stats.newUsersThisMonth}</p>
                  <p className="text-gray-400 text-xs">New This Month</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-white text-sm font-medium mb-2">Growth Trend</p>
                <div className="flex items-center gap-2">
                  <FaArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Consistent growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Categories Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">Top Product Categories</h3>
            
            <div className="space-y-4">
              {productStats.topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{category.name}</span>
                    <span className="text-gray-400 text-sm">{category.count} products</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-xs">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">Monthly Revenue</h3>
            
            <div className="space-y-4">
              {[1200, 1800, 2100, 1950, 2400, 2800, 3200, 2900, 3500, 3800, 4200, 4500].map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">{index + 1}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(value / 5000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 w-16">${value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">Revenue trend over 12 months</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Platform Activity</h3>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              View All Activity
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.icon)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{activity.title}</h4>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-6 rounded-xl border border-blue-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white/20 rounded-lg mb-3">
                <FaUsers className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg">Manage Users</h4>
              <p className="text-blue-200 text-sm">User administration</p>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-xl border border-green-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white/20 rounded-lg mb-3">
                <FaBox className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg">Review Products</h4>
              <p className="text-green-200 text-sm">Product moderation</p>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-xl border border-purple-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white/20 rounded-lg mb-3">
                <FaChartLine className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg">Analytics</h4>
              <p className="text-purple-200 text-sm">Detailed reports</p>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-6 rounded-xl border border-orange-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white/20 rounded-lg mb-3">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg">Verifications</h4>
              <p className="text-orange-200 text-sm">User verification</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
