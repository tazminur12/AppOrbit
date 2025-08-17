import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxios from '../../hooks/useAxios';
import AuthContext from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { FaSort, FaSortAmountDown, FaSortAmountUp, FaSearch, FaFilter } from 'react-icons/fa';

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
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const limit = 12; // Increased limit for better grid layout

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get('/products', {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          sort: sortBy,
          order: sortOrder
        }
      });

      let fetchedProducts = response.data.data || response.data;
      
      // Apply client-side sorting for price if needed
      if (sortBy === 'price') {
        fetchedProducts = fetchedProducts.sort((a, b) => {
          const priceA = a.price ? parseFloat(a.price) : 0;
          const priceB = b.price ? parseFloat(b.price) : 0;
          
          if (priceA === 0 && priceB === 0) return 0; // Both free
          if (priceA === 0) return sortOrder === 'asc' ? -1 : 1; // Free products first/last
          if (priceB === 0) return sortOrder === 'asc' ? 1 : -1; // Free products first/last
          
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
      }

      setProducts(fetchedProducts);
      const totalCount = response.data.total || response.data.length;
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data if API fails
      setProducts([
        {
          _id: '1',
          name: 'AI Code Assistant Pro',
          description: 'Advanced AI-powered coding companion with real-time suggestions and code review capabilities',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
          tags: ['AI', 'Development', 'Productivity'],
          price: 29.99,
          upvotes: 456,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '2',
          name: 'Cloud DevOps Suite',
          description: 'Enterprise-grade DevOps platform with automated deployment and monitoring features',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
          tags: ['DevOps', 'Cloud', 'Enterprise'],
          price: 99.99,
          upvotes: 389,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '3',
          name: 'Design System Builder',
          description: 'Professional design system builder for scalable UI/UX projects and team collaboration',
          image: 'https://images.unsplash.com/photo-1561070791-2526d41294b5?w=400&h=300&fit=crop',
          tags: ['Design', 'UI/UX', 'Professional'],
          price: 49.99,
          upvotes: 334,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '4',
          name: 'Data Analytics Dashboard',
          description: 'Enterprise data analytics platform with advanced visualization and ML insights',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          tags: ['Analytics', 'Data', 'Machine Learning'],
          price: 79.99,
          upvotes: 278,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '5',
          name: 'Mobile App Studio',
          description: 'Complete mobile app development studio with cross-platform support and native performance',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
          tags: ['Mobile', 'Development', 'Studio'],
          price: 149.99,
          upvotes: 245,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '6',
          name: 'Security Testing Pro',
          description: 'Comprehensive security testing suite for enterprise applications and compliance',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
          tags: ['Security', 'Testing', 'Enterprise'],
          price: 199.99,
          upvotes: 192,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '7',
          name: 'API Gateway Enterprise',
          description: 'Enterprise-grade API gateway with advanced security and monitoring capabilities',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
          tags: ['API', 'Gateway', 'Enterprise'],
          price: 299.99,
          upvotes: 167,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '8',
          name: 'Blockchain Development Kit',
          description: 'Professional blockchain development toolkit for enterprise DApps and smart contracts',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['Blockchain', 'Enterprise', 'DApp'],
          price: 399.99,
          upvotes: 203,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '9',
          name: 'Free Code Editor',
          description: 'Lightweight and fast code editor with syntax highlighting and extensions support',
          image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
          tags: ['Editor', 'Development', 'Free'],
          price: null, // Free product
          upvotes: 156,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '10',
          name: 'Open Source CMS',
          description: 'Flexible content management system built with modern web technologies',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
          tags: ['CMS', 'Open Source', 'Web'],
          price: null, // Free product
          upvotes: 134,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '11',
          name: 'Budget Task Manager',
          description: 'Simple and effective task management tool for small teams and individuals',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
          tags: ['Productivity', 'Management', 'Budget'],
          price: 9.99,
          upvotes: 89,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '12',
          name: 'Premium Project Suite',
          description: 'All-in-one project management solution with advanced features and integrations',
          image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
          tags: ['Project Management', 'Premium', 'Enterprise'],
          price: 499.99,
          upvotes: 78,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        }
      ]);
      setTotalPages(1);
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

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const getSortIcon = () => {
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
    }
    return <FaSort />;
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price':
        return `Price ${sortOrder === 'asc' ? 'Low to High' : 'High to Low'}`;
      case 'upvotes':
        return 'Most Upvoted';
      case 'name':
        return 'Name A-Z';
      case 'createdAt':
        return 'Newest First';
      default:
        return 'Sort By';
    }
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
        <div className="dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1 w-full lg:w-auto">
              <div className="relative w-full lg:w-[400px]">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products by tags, name, or description..."
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
              </div>
            </form>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Sort By Dropdown */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="
                    w-full sm:w-48
                    pl-10 pr-4 py-3
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
                  <option value="createdAt">Newest First</option>
                  <option value="upvotes">Most Upvoted</option>
                  <option value="name">Name A-Z</option>
                  <option value="price">Price</option>
                </select>
              </div>

              {/* Sort Order Toggle (only show for price sorting) */}
              {sortBy === 'price' && (
                <button
                  onClick={handleSortOrderChange}
                  className="
                    px-4 py-3
                    border border-green-500
                    rounded-lg
                    shadow-sm
                    bg-transparent
                    text-white
                    hover:border-green-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                    transition-colors duration-200 ease-in-out
                    flex items-center gap-2 justify-center
                    min-w-[120px]
                  "
                >
                  {getSortIcon()}
                  <span className="text-sm">
                    {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                  </span>
                </button>
              )}

              {/* Current Sort Display */}
              <div className="
                px-4 py-3
                border border-gray-600
                rounded-lg
                bg-gray-700/50
                text-gray-300
                flex items-center gap-2
                justify-center
                min-w-[160px]
              ">
                <FaSort className="text-green-400" />
                <span className="text-sm">{getSortLabel()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        )}

        {/* Products Summary */}
        {!loading && products.length > 0 && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <span className="text-gray-300">
                Showing <span className="text-white font-semibold">{products.length}</span> products
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300">
                Sorted by: <span className="text-green-400 font-semibold">{getSortLabel()}</span>
              </span>
              {searchTerm && (
                <>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-300">
                    Search: <span className="text-purple-400 font-semibold">"{searchTerm}"</span>
                  </span>
                </>
              )}
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div 
                key={product._id}
                className="transform hover:scale-105 transition-all duration-300"
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
    </div>
  );
};

export default ProductsPage;
