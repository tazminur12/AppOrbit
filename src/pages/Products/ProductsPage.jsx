import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxios from '../../hooks/useAxios';
import AuthContext from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

// Floating Product Icons for Products Page
const FloatingProductIcons = () => {
  const groupRef = React.useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.002;
        child.rotation.x += 0.015;
        child.rotation.z += 0.008;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Product Boxes */}
      {[...Array(15)].map((_, index) => (
        <Float key={index} speed={1.8} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={[
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            0
          ]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
              color={index % 4 === 0 ? "#10b981" : index % 4 === 1 ? "#3b82f6" : index % 4 === 2 ? "#8b5cf6" : "#f59e0b"}
              transparent
              opacity={0.7}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const limit = 6;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get('/products', {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          sort: sortBy
        }
      });

      // API এর ফরম্যাট চেক করে নিচের লাইন ঠিক করো
      setProducts(response.data.data || response.data);
      const totalCount = response.data.total || response.data.length;
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await axiosSecure.patch(`/products/upvote/${productId}`);
      const { upvoted } = response.data;
      setProducts(prev =>
        prev.map(product => {
          if (product._id !== productId) return product;
          let upvotes = product.upvotes || 0;
          let upvotedUsers = product.upvotedUsers || [];
          if (upvoted) {
            upvotes += 1;
            upvotedUsers = [...upvotedUsers, user.email];
          } else {
            upvotes = Math.max(0, upvotes - 1);
            upvotedUsers = upvotedUsers.filter(email => email !== user.email);
          }
          return { ...product, upvotes, upvotedUsers };
        })
      );
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleReport = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axiosSecure.post(`/products/report/${productId}`);
      setProducts(prev =>
        prev.map(product =>
          product._id === productId ? { ...product, reported: true } : product
        )
      );
    } catch (error) {
      console.error('Error reporting:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8 relative">
      {/* 3D Animation Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#10b981" />
          
          <FloatingProductIcons />
          
          <Sparkles
            count={100}
            scale={25}
            size={2}
            speed={0.3}
            opacity={0.4}
            color="#10b981"
          />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="animate-pulse">🚀</span>
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Discover Amazing Products
            </span>
            <span className="animate-pulse delay-1000">🚀</span>
          </h1>
          <p className="text-lg text-white dark:text-gray-400">
            Explore the latest products shared by our community
          </p>
        </div>

        {/* Search and Sort Container */}
        <div className="dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-700">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1 w-full md:w-auto">
            <div className="relative w-full lg:w-[40%]">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products by tags..."
                className="
                  w-full
                  pl-10 pr-4 py-3
                  border border-green-500
                  rounded-lg
                  shadow-sm
                  bg-transparent
                  text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  transition-colors duration-200 ease-in-out
                  hover:border-green-400
                "
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </form>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="
              w-full md:w-48
              px-4 py-3
              border border-green-500
              rounded-lg
              shadow-sm
              bg-transparent
              text-white
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              transition-colors duration-200 ease-in-out
              cursor-pointer
              hover:border-green-400
            "
          >
            <option value="createdAt">Newest</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to share a product!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div 
                key={product._id}
                className="transform hover:scale-105 transition-all duration-300 hover:rotate-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onUpvoteToggle={() => handleUpvote(product._id)}
                  onReportToggle={() => handleReport(product._id)}
                />
              </div>
            ))}
          </div>
        )}

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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
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
    </div>
  );
};

export default ProductsPage;
