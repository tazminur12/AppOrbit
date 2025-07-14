import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import AuthContext from '../../../context/AuthContext';
import useUserRole from '../../../hooks/useUserRole';

const MyProducts = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role, roleLoading } = useUserRole();

  useEffect(() => {
    
    let isMounted = true;

    const fetchUserProducts = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        
        const res = await axiosSecure.get(`/products/users/${user.email}`);
        
        
        if (isMounted) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
        if (isMounted) {
          if (error.response?.status === 403) {
            Swal.fire({
              icon: 'warning',
              title: 'Session Expired',
              text: 'Please log in again',
              background: '#1f2937',
              color: '#f9fafb',
              confirmButtonColor: '#f59e0b'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to fetch your products',
              background: '#1f2937',
              color: '#f9fafb',
              confirmButtonColor: '#ef4444'
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProducts();

    return () => {
      isMounted = false;
    };
  }, [axiosSecure, user?.email, role, roleLoading]);

  const handleDelete = async (id, productName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete "${productName}" and cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#f9fafb',
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your product has been deleted.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete product',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleUpdate = (id) => {
    navigate(`/dashboard/user/update-product/${id}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600 text-white';
      case 'accepted':
        return 'bg-green-600 text-white';
      case 'rejected':
        return 'bg-red-600 text-white';
      case 'reported':
        return 'bg-red-800 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your products...</p>
        </div>
      </div>
    );
  }

  // Sort featured products to the top
  const sortedProducts = [...products].sort((a, b) => {
    const aFeatured = a.featured || a.isFeatured;
    const bFeatured = b.featured || b.isFeatured;
    return bFeatured - aFeatured;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">My Products</h1>
        <p className="text-gray-400">Manage your submitted products</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-100">{products.length}</p>
            </div>
          </div>
        </div>

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
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Featured</p>
              <p className="text-2xl font-bold text-gray-100">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-200">No products found</h3>
            <p className="mt-1 text-sm text-gray-400">You haven't submitted any products yet.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/user/add-product')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Your First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Votes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Featured</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedProducts.map((product) => (
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
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.upvotes || 0}
                    </td>
                    <td className="px-6 py-4">
                      {(product.featured || product.isFeatured) ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold shadow">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-semibold">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => handleUpdate(product._id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Button */}
      {products.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard/user/add-product')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Product
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
