import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ReviewQueue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // You can adjust the page size
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Get paginated products for review
      const response = await axiosSecure.get(`/products?status=all&page=${currentPage}&limit=${limit}`);
      let allProducts = Array.isArray(response.data) ? response.data : response.data.data;
      allProducts = allProducts || [];
      const totalCount = response.data.total || allProducts.length;
      setTotalPages(Math.ceil(totalCount / limit));
      // Sort products: pending first, then accepted, then rejected
      const sortedProducts = allProducts.sort((a, b) => {
        const statusOrder = { pending: 0, accepted: 1, rejected: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch products',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleMakeFeatured = async (productId, isFeatured) => {
    try {
      await axiosSecure.patch(`/products/feature/${productId}`);
      
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, isFeatured: !isFeatured }
          : product
      ));

      Swal.fire({
        icon: 'success',
        title: isFeatured ? 'Removed from Featured' : 'Made Featured',
        text: isFeatured 
          ? 'Product removed from featured section' 
          : 'Product added to featured section',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update featured status',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      await axiosSecure.patch(`/products/status/${productId}`, { 
        status: newStatus 
      });
      
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, status: newStatus }
          : product
      ));

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Product status changed to ${newStatus}`,
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update product status',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600 text-white';
      case 'accepted':
        return 'bg-green-600 text-white';
      case 'rejected':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getFeaturedBadge = (featured) => {
    return featured 
      ? 'bg-purple-600 text-white' 
      : 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Product Review Queue</h1>
        <p className="text-gray-400">Review and manage product submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-100">
                {products.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Accepted</p>
              <p className="text-2xl font-bold text-gray-100">
                {products.filter(p => p.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-100">
                {products.filter(p => p.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Featured</p>
              <p className="text-2xl font-bold text-gray-100">
                {products.filter(p => p.isFeatured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Owner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Featured</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={product.owner?.image || 'https://i.ibb.co/SsZ9LgB/user.png'} 
                        alt="Owner"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-gray-200">{product.owner?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getFeaturedBadge(product.isFeatured)}`}>
                      {product.isFeatured ? 'Featured' : 'Not Featured'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(product._id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>

                      {/* Make Featured Button */}
                      <button
                        onClick={() => handleMakeFeatured(product._id, product.isFeatured)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          product.isFeatured
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {product.isFeatured ? 'Remove Featured' : 'Make Featured'}
                      </button>

                      {/* Accept Button */}
                      <button
                        onClick={() => handleStatusUpdate(product._id, 'accepted')}
                        disabled={product.status === 'accepted'}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          product.status === 'accepted'
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        Accept
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleStatusUpdate(product._id, 'rejected')}
                        disabled={product.status === 'rejected'}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          product.status === 'rejected'
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-200">No products found</h3>
            <p className="mt-1 text-sm text-gray-400">No products have been submitted for review yet.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            {/* Ellipsis Pagination Logic */}
            {(() => {
              const pages = [];
              const maxButtons = 5;
              if (totalPages <= maxButtons) {
                for (let page = 1; page <= totalPages; page++) {
                  pages.push(
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'text-gray-400 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              } else {
                // Always show first and last, current, and neighbors
                const first = 1;
                const last = totalPages;
                const prev = Math.max(currentPage - 1, first + 1);
                const next = Math.min(currentPage + 1, last - 1);
                // First page
                pages.push(
                  <button
                    key={first}
                    onClick={() => setCurrentPage(first)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === first
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-gray-400 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {first}
                  </button>
                );
                // Ellipsis before
                if (currentPage > first + 2) {
                  pages.push(
                    <span key="start-ellipsis" className="px-2 text-gray-400">...</span>
                  );
                }
                // Previous neighbor
                if (prev > first + 1) {
                  pages.push(
                    <button
                      key={prev}
                      onClick={() => setCurrentPage(prev)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === prev
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'text-gray-400 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {prev}
                    </button>
                  );
                }
                // Current page (if not first/last)
                if (currentPage !== first && currentPage !== last) {
                  pages.push(
                    <button
                      key={currentPage}
                      onClick={() => setCurrentPage(currentPage)}
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-green-600 text-white shadow-lg"
                    >
                      {currentPage}
                    </button>
                  );
                }
                // Next neighbor
                if (next < last - 1) {
                  pages.push(
                    <button
                      key={next}
                      onClick={() => setCurrentPage(next)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === next
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'text-gray-400 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {next}
                    </button>
                  );
                }
                // Ellipsis after
                if (currentPage < last - 2) {
                  pages.push(
                    <span key="end-ellipsis" className="px-2 text-gray-400">...</span>
                  );
                }
                // Last page
                pages.push(
                  <button
                    key={last}
                    onClick={() => setCurrentPage(last)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === last
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-gray-400 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {last}
                  </button>
                );
              }
              return pages;
            })()}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
