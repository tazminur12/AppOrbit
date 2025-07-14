import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

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
      console.log('Reported products response:', res.data); // Debug log
      
      if (Array.isArray(res.data)) {
        setReportedProducts(res.data);
      } else {
        console.warn('Unexpected response format:', res.data);
        setReportedProducts([]);
      }
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
    navigate(`/product/${id}`);
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
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        <div>
          <div className="animate-spin h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4 rounded-full"></div>
          Loading reported products...
        </div>
      </div>
    );
  }

  if (reportedProducts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-lg">No reported products</p>
        <p className="text-sm">All products are currently clean.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold text-gray-100 mb-1">Reported Contents</h1>
        <p className="text-gray-400 mb-6">Review and manage reported products</p>
      </header>

      <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-xl">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Reports</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {reportedProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 flex items-center gap-3 max-w-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-100 truncate max-w-xs">{product.name}</p>
                    <p className="text-sm text-gray-400 truncate max-w-xs">{product.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <img
                    src={product.owner?.image || 'https://i.ibb.co/SsZ9LgB/user.png'}
                    alt={product.owner?.name || 'Owner'}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://i.ibb.co/SsZ9LgB/user.png';
                    }}
                  />
                  <span>{product.owner?.name || 'Unknown'}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityClass(getReportCount(product))}`}
                  >
                    {getReportCount(product)} report{getReportCount(product) > 1 ? 's' : ''}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                <td className="px-6 py-4">{new Date(product.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleViewDetails(product._id)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                  >
                    Delete
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
