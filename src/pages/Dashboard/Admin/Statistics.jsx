import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosSecure.get("/admin/statistics");
        setStats(response.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 403) {
            setError("Access denied: Admins only");
          } else {
            setError(
              err.response.data?.message || "Failed to fetch statistics"
            );
          }
        } else {
          setError(err.message || "Network error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 max-w-md">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Dashboard Error</h3>
          <p className="text-gray-300 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!stats)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 max-w-md">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No Data Available</h3>
          <p className="text-gray-400">
            Statistics data could not be loaded at this time.
          </p>
        </div>
      </div>
    );

  const pieData = [
    { name: "Accepted Products", value: stats.accepted },
    { name: "Pending Products", value: stats.pending },
    { name: "Total Reviews", value: stats.totalReviews },
    { name: "Total Users", value: stats.totalUsers },
  ];

  const barData = [
    { name: 'Products', total: stats.totalProducts, accepted: stats.accepted, pending: stats.pending },
    { name: 'Users', total: stats.totalUsers },
    { name: 'Reviews', total: stats.totalReviews }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto">
            Comprehensive analytics and platform performance metrics
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Products</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.totalProducts.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-blue-900/30 rounded-lg group-hover:bg-blue-900/50 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
              <div>
                <p className="text-xs text-gray-400">Approved</p>
                <p className="text-sm font-medium text-green-400">{stats.accepted.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pending</p>
                <p className="text-sm font-medium text-yellow-400">{stats.pending.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.totalUsers.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-purple-900/30 rounded-lg group-hover:bg-purple-900/50 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">Active Members</p>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Reviews</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.totalReviews.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-amber-900/30 rounded-lg group-hover:bg-amber-900/50 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">User Feedback</p>
            </div>
          </div>

          {/* Approval Rate */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 font-medium">Approval Rate</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.totalProducts > 0 
                    ? `${Math.round((stats.accepted / stats.totalProducts) * 100)}%` 
                    : '0%'}
                </h3>
              </div>
              <div className="p-2 bg-emerald-900/30 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">Products approved</p>
            </div>
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Data Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    label={({ name, percent }) => (
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    )}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Platform Metrics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="accepted" name="Accepted" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Stats Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Detailed Statistics</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Metric</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Percentage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">Total Products</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stats.totalProducts.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">100%</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-400">
                      Total
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">Accepted Products</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stats.accepted.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {stats.totalProducts > 0 
                      ? `${Math.round((stats.accepted / stats.totalProducts) * 100)}%` 
                      : '0%'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400">
                      Approved
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">Pending Products</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stats.pending.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {stats.totalProducts > 0 
                      ? `${Math.round((stats.pending / stats.totalProducts) * 100)}%` 
                      : '0%'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900/30 text-yellow-400">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">Total Users</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stats.totalUsers.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900/30 text-purple-400">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">Total Reviews</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stats.totalReviews.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-900/30 text-amber-400">
                      Feedback
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;