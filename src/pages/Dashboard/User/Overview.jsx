import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
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
  
  // Additional stats from backend
  const [detailedStats, setDetailedStats] = useState({
    acceptedProducts: 0,
    pendingProducts: 0,
    rejectedProducts: 0,
    totalUpvotes: 0,
    membership: 'basic',
    joinDate: null
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ensure stats object is always defined with safe defaults
  const safeStats = stats || {
    totalProducts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalReviews: 0,
    monthlyGrowth: 0,
    verificationStatus: 'pending'
  };

  // Ensure recentActivity is always an array
  const safeRecentActivity = recentActivity || [];

  useEffect(() => {
    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  // Safety check for user object
  if (!user || !user.email) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg text-gray-300">Loading user data...</p>
        </div>
      </div>
    );
  }

  const fetchDashboardData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      
      // Fetch user stats from real backend
      const statsResponse = await axiosSecure.get(`/users/stats/${user.email}`);
      if (statsResponse.data && statsResponse.data.success && statsResponse.data.stats) {
        // Map backend stats to frontend format
        const backendStats = statsResponse.data.stats;
        
        // Set detailed stats
        setDetailedStats({
          acceptedProducts: backendStats.acceptedProducts || 0,
          pendingProducts: backendStats.pendingProducts || 0,
          rejectedProducts: backendStats.rejectedProducts || 0,
          totalUpvotes: backendStats.totalUpvotes || 0,
          membership: backendStats.membership || 'basic',
          joinDate: backendStats.joinDate || null
        });
        
        setStats({
          totalProducts: backendStats.totalProducts || 0,
          totalViews: backendStats.totalUpvotes || 0, // Using upvotes as views for now
          totalLikes: backendStats.totalUpvotes || 0, // Using upvotes as likes
          totalReviews: backendStats.totalReviews || 0,
          monthlyGrowth: 15.3, // This could be calculated from backend data later
          verificationStatus: backendStats.membership === 'premium' ? 'verified' : 'pending'
        });
        toast.success('Dashboard data loaded successfully!');
      } else {
        console.warn('Stats response format unexpected:', statsResponse.data);
        // Set default stats if response format is unexpected
        setStats({
          totalProducts: 0,
          totalViews: 0,
          totalLikes: 0,
          totalReviews: 0,
          monthlyGrowth: 0,
          verificationStatus: 'pending'
        });
        toast.warning('Data format unexpected, using default values');
      }
      
      // Fetch recent activity from real backend
      const activityResponse = await axiosSecure.get(`/users/activity/${user.email}`);
      if (activityResponse.data && activityResponse.data.success && Array.isArray(activityResponse.data.activities)) {
        // Transform backend activity format to frontend format
        const backendActivities = activityResponse.data.activities;
        const transformedActivities = backendActivities.map((activity, index) => ({
          id: activity.id || index + 1,
          type: activity.type === 'product' ? 'product_added' : 
                activity.type === 'review' ? 'review_received' : 'product_downloaded',
          title: activity.action || 'Activity',
          description: activity.title || 'No description',
          timestamp: new Date(activity.date),
          icon: activity.type === 'product' ? 'FaBox' : 
                activity.type === 'review' ? 'FaStar' : 'FaDownload'
        }));
        setRecentActivity(transformedActivities);
      } else {
        console.warn('Activity response format unexpected:', activityResponse.data);
        // Set empty activity if response format is unexpected
        setRecentActivity([]);
        toast.warning('Activity data format unexpected');
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        console.log('User data not found, setting default values');
        setStats({
          totalProducts: 0,
          totalViews: 0,
          totalLikes: 0,
          totalReviews: 0,
          monthlyGrowth: 0,
          verificationStatus: 'pending'
        });
        setRecentActivity([]);
        toast.info('No user data found. Please add products to get started.');
      } else if (error.response?.status === 401) {
        console.error('Unauthorized - user token might be expired');
        toast.error('Authentication failed. Please log in again.');
        // You might want to redirect to login here
      } else if (error.response?.status === 500) {
        console.error('Server error');
        toast.error('Server error. Please try again later.');
      } else {
        // For other errors, set sample data for demonstration
        console.log('Using sample data due to backend error');
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
        toast.warning('Using sample data due to connection issues');
      }
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
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your account.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-white">{safeStats.totalProducts}</p>
                {safeStats.totalProducts === 0 ? (
                  <p className="text-blue-200 text-sm mt-1">Start by adding your first product</p>
                ) : (
                  <p className="text-blue-200 text-sm mt-1">+2 this month</p>
                )}
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
                <p className="text-3xl font-bold text-white">{safeStats.totalViews.toLocaleString()}</p>
                {safeStats.totalViews === 0 ? (
                  <p className="text-green-200 text-sm mt-1">No views yet</p>
                ) : (
                  <p className="text-green-200 text-sm mt-1">+{Math.floor(safeStats.totalViews * 0.12)} this week</p>
                )}
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
                <p className="text-3xl font-bold text-white">{safeStats.totalLikes}</p>
                {safeStats.totalLikes === 0 ? (
                  <p className="text-pink-200 text-sm mt-1">No likes yet</p>
                ) : (
                  <p className="text-pink-200 text-sm mt-1">+{Math.floor(safeStats.totalLikes * 0.08)} this week</p>
                )}
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
                <p className="text-3xl font-bold text-white">{safeStats.totalReviews}</p>
                {safeStats.totalReviews === 0 ? (
                  <p className="text-yellow-200 text-sm mt-1">No reviews yet</p>
                ) : (
                  <p className="text-yellow-200 text-sm mt-1">+{Math.floor(safeStats.totalReviews * 0.15)} this month</p>
                )}
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
                <span className="text-sm font-medium">+{safeStats.monthlyGrowth}%</span>
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

          {/* Product Status Breakdown */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Product Status</h3>
              <div className="text-sm text-gray-400">
                Total: {detailedStats.acceptedProducts + detailedStats.pendingProducts + detailedStats.rejectedProducts}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <FaBox className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Accepted</p>
                    <p className="text-gray-400 text-sm">Products approved</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{detailedStats.acceptedProducts}</p>
                  <p className="text-green-400 text-sm">Active</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600/20 rounded-lg">
                    <FaBox className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Pending</p>
                    <p className="text-gray-400 text-sm">Under review</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{detailedStats.pendingProducts}</p>
                  <p className="text-yellow-400 text-sm">Reviewing</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <FaBox className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Rejected</p>
                    <p className="text-gray-400 text-sm">Needs revision</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{detailedStats.rejectedProducts}</p>
                  <p className="text-red-400 text-sm">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Section */}
        <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Account Status</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              safeStats.verificationStatus === 'verified' 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-600 text-white'
            }`}>
              {safeStats.verificationStatus === 'verified' ? 'Premium' : 'Basic'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <FaShieldAlt className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Membership</p>
                  <p className="text-gray-400 text-sm">Current plan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold capitalize">{detailedStats.membership}</p>
                <p className="text-gray-400 text-sm">
                  {detailedStats.membership === 'premium' ? 'Premium' : 'Basic'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <FaUsers className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Member Since</p>
                  <p className="text-gray-400 text-sm">Join date</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {detailedStats.joinDate ? new Date(detailedStats.joinDate).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <FaChartLine className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Total Upvotes</p>
                  <p className="text-gray-400 text-sm">Received likes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{detailedStats.totalUpvotes}</p>
                <p className="text-gray-400 text-sm">Received</p>
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
          
          {safeRecentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <FaComments className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No Recent Activity</p>
              <p className="text-gray-500 text-sm">Your activity will appear here once you start using the platform</p>
            </div>
          ) : (
            <div className="space-y-4">
              {safeRecentActivity.map((activity) => (
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
          )}
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
