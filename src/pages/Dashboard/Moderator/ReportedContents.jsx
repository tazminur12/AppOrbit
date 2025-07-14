import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { AlertCircle, Eye, Trash2, Flag } from 'lucide-react';

const ReportedContents = () => {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch reported products on component mount
  useEffect(() => {
    fetchReportedProducts();
  }, []);

  const fetchReportedProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get('/products/reported');
      // Use .data if present (new backend format), otherwise fallback
      let reported = Array.isArray(res.data) ? res.data : res.data.data;
      reported = reported || [];
      setReportedProducts(reported);
    } catch (error) {
      console.error('Error fetching reported products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to load reported products',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/products/${id}`);
  };

  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete "${name}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#f9fafb',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/products/${id}`);
        setReportedProducts((prev) => prev.filter((p) => p._id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'The product has been removed.',
          icon: 'success',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete product',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const getReportCount = (product) => product.reportCount || 1;

  const getSeverityClass = (count) => {
    if (count >= 5) return 'bg-red-600 text-white';
    if (count >= 3) return 'bg-orange-600 text-white';
    return 'bg-yellow-600 text-white';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-300">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full mb-6"></div>
        <p className="text-lg font-semibold text-indigo-400">Loading reported products...</p>
      </div>
    );
  }

  if (reportedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Flag className="w-16 h-16 text-indigo-500 mb-4" />
        <p className="text-2xl font-bold mb-2">No Reported Products</p>
        <p className="text-base">All products are currently clean. 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Reported Contents</h1>
            <p className="text-gray-400 text-base">Review and manage reported products flagged by users</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md flex items-center gap-2">
          <Flag className="w-5 h-5" />
          {reportedProducts.length} Reported
        </div>
      </header>

      <div className="overflow-x-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-2xl shadow-xl">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Reports</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportedProducts.map((product, idx) => (
              <tr
                key={product._id}
                className={
                  idx % 2 === 0
                    ? 'bg-gray-900 hover:bg-gray-800 transition-colors'
                    : 'bg-gray-800 hover:bg-gray-700 transition-colors'
                }
              >
                <td className="px-6 py-4 flex items-center gap-3 max-w-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded shadow-md border border-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                    }}
                  />
                  <div>
                    <p className="font-semibold text-white truncate max-w-xs">{product.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <img
                    src={product.owner?.image || 'https://i.ibb.co/SsZ9LgB/user.png'}
                    alt={product.owner?.name || 'Owner'}
                    className="w-8 h-8 rounded-full border border-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://i.ibb.co/SsZ9LgB/user.png';
                    }}
                  />
                  <span className="font-medium text-gray-200">{product.owner?.name || 'Unknown'}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getSeverityClass(getReportCount(product))}`}
                  >
                    {getReportCount(product)} report{getReportCount(product) > 1 ? 's' : ''}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      product.status === 'reported'
                        ? 'bg-red-600 text-white'
                        : product.status === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : product.status === 'accepted'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {product.status || 'unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{new Date(product.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleViewDetails(product._id)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-xs font-semibold shadow-md transition-all duration-150"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-semibold shadow-md transition-all duration-150"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportedContents;
