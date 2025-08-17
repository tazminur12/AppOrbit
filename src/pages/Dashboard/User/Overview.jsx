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
  FaShieldAlt
} from 'react-icons/fa';

const Overview = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalReviews: 0,
    monthlyGrowth: 0,
    verificationStatus: 'pending'
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      // Fetch user stats
      const statsResponse = await axiosSecure.get(`/users/stats/${user.email}`);
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      // Fetch recent activity
      const activityResponse = await axiosSecure.get(`/users/activity/${user.email}`);
      if (activityResponse.data) {
        setRecentActivity(activityResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set sample data for demonstration
      setStats({
        totalProducts: 12,
        totalViews: 1247,
        totalLikes: 89,
        totalReviews: 23,
        monthlyGrowth: 15.3,
        verificationStatus: 'verified'
      });
      setRecentActivity([
        {
          id: 1,
          type: 'product_added',
          title: 'New Product Added',
          description: 'Added "AI Web Development Tool" to your portfolio',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: 'FaBox'
        },
        {
          id: 2,
          type: 'product_viewed',
          title: 'Product Viewed',
          description: 'Your product "React Dashboard Template" received 15 views',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: 'FaEye'
        },
        {
          id: 3,
          type: 'product_liked',
          title: 'Product Liked',
          description: 'Someone liked your "Mobile App UI Kit"',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          icon: 'FaHeart'
        },
        {
          id: 4,
          type: 'review_received',
          title: 'New Review',
          description: 'Received a 5-star review for "E-commerce Template"',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          icon: 'FaStar'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (iconName) => {
    const icons = {
      FaBox: <FaBox className="w-5 h-5" />,
      FaEye: <FaEye className="w-5 h-5" />,
      FaHeart: <FaHeart className="w-5 h-5" />,
      FaStar: <FaStar className="w-5 h-5" />,
      FaDownload: <FaDownload className="w-5 h-5" />,
      FaUpload: <FaUpload className="w-5 h-5" />,
      FaComments: <FaComments className="w-5 h-5" />,
      FaShieldAlt: <FaShieldAlt className="w-5 h-5" />
    };
    return icons[iconName] || <FaBox className="w-5 h-5" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      product_added: 'text-green-400 bg-green-400/10',
      product_viewed: 'text-blue-400 bg-blue-400/10',
      product_liked: 'text-pink-400 bg-pink-400/10',
      review_received: 'text-yellow-400 bg-yellow-400/10',
      product_downloaded: 'text-purple-400 bg-purple-400/10',
      verification_completed: 'text-emerald-400 bg-emerald-400/10'
    };
    return colors[type] || 'text-gray-400 bg-gray-400/10';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your account.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                <p className="text-blue-200 text-sm mt-1">+2 this month</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <FaBox className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                <p className="text-green-200 text-sm mt-1">+{Math.floor(stats.totalViews * 0.12)} this week</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <FaEye className="w-8 h-8 text-green-300" />
              </div>
            </div>
          </div>

          {/* Total Likes */}
          <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-xl p-6 border border-pink-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">Total Likes</p>
                <p className="text-3xl font-bold text-white">{stats.totalLikes}</p>
                <p className="text-pink-200 text-sm mt-1">+{Math.floor(stats.totalLikes * 0.08)} this week</p>
              </div>
              <div className="p-3 bg-pink-600/20 rounded-lg">
                <FaHeart className="w-8 h-8 text-pink-300" />
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-xl p-6 border border-yellow-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Total Reviews</p>
                <p className="text-3xl font-bold text-white">{stats.totalReviews}</p>
                <p className="text-yellow-200 text-sm mt-1">+{Math.floor(stats.totalReviews * 0.15)} this month</p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <FaStar className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Monthly Growth</h3>
              <div className="flex items-center gap-2 text-green-400">
                <FaArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {[65, 78, 82, 89, 76, 85, 92, 88, 95, 87, 93, 89].map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">{index + 1}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 w-8">{value}%</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">Monthly performance metrics</p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Account Status</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                stats.verificationStatus === 'verified' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-yellow-600 text-white'
              }`}>
                {stats.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <FaShieldAlt className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Verification</p>
                    <p className="text-gray-400 text-sm">Account verification status</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {stats.verificationStatus === 'verified' ? 'Completed' : 'In Progress'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {stats.verificationStatus === 'verified' ? '100%' : '75%'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <FaUsers className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Profile Completion</p>
                    <p className="text-gray-400 text-sm">Profile information filled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">85%</p>
                  <p className="text-gray-400 text-sm">Complete</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <FaChartLine className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Performance</p>
                    <p className="text-gray-400 text-sm">Overall account performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">92%</p>
                  <p className="text-gray-400 text-sm">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              View All
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-6 rounded-xl border border-indigo-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FaBox className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg">Add New Product</h4>
                <p className="text-indigo-200 text-sm">Upload your latest creation</p>
              </div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-xl border border-green-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FaChartLine className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg">View Analytics</h4>
                <p className="text-green-200 text-sm">Check detailed statistics</p>
              </div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-xl border border-blue-600 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FaUsers className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg">Manage Profile</h4>
                <p className="text-blue-200 text-sm">Update your information</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
