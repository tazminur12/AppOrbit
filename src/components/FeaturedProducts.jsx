import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';

// Floating Stars for Featured Section
const FloatingStars = () => {
  const groupRef = React.useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.002;
        child.rotation.z += 0.01;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, index) => (
        <Float key={index} speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            0
          ]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#FFD700" : "#FFA500"}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Fetch products from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/products?status=accepted&sort=createdAt');
      const products = Array.isArray(res.data) ? res.data : res.data.data;
      const featured = (products || []).filter(p => p.isFeatured).slice(0, 8); // Show 8 products for better grid
      setProducts(featured);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      // Fallback to sample data if API fails
      setProducts([
        {
          _id: '1',
          name: 'AI Code Assistant',
          description: 'Intelligent coding companion that helps developers write better code faster',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
          tags: ['AI', 'Development', 'Productivity'],
          upvotes: 156,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '2',
          name: 'Cloud DevOps Platform',
          description: 'Streamline your deployment pipeline with automated CI/CD workflows',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
          tags: ['DevOps', 'Cloud', 'Automation'],
          upvotes: 89,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '3',
          name: 'Design System Builder',
          description: 'Create consistent design systems that scale across your entire product',
          image: 'https://images.unsplash.com/photo-1561070791-2526d41294b5?w=400&h=300&fit=crop',
          tags: ['Design', 'UI/UX', 'System'],
          upvotes: 234,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '4',
          name: 'Data Analytics Dashboard',
          description: 'Transform raw data into actionable insights with beautiful visualizations',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          tags: ['Analytics', 'Data', 'Visualization'],
          upvotes: 178,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '5',
          name: 'Mobile App Framework',
          description: 'Build cross-platform mobile apps with native performance',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
          tags: ['Mobile', 'Cross-platform', 'Framework'],
          upvotes: 145,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '6',
          name: 'Security Testing Suite',
          description: 'Comprehensive security testing tools for modern applications',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
          tags: ['Security', 'Testing', 'Compliance'],
          upvotes: 92,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '7',
          name: 'API Gateway Manager',
          description: 'Centralized API management with advanced routing and monitoring',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
          tags: ['API', 'Gateway', 'Management'],
          upvotes: 167,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '8',
          name: 'Blockchain Development Kit',
          description: 'Complete toolkit for building decentralized applications',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['Blockchain', 'DApp', 'Development'],
          upvotes: 203,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Upvote toggle handler
  const handleUpvoteToggle = async (productId) => {
    try {
      await axiosSecure.patch(`/products/upvote/${productId}`);
      // Refresh data to get updated votes
      await fetchData();
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      throw error; // Rethrow to allow ProductCard to handle error toast
    }
  };

  // Report toggle handler
  const handleReportToggle = async (productId) => {
    try {
      await axiosSecure.post(`/products/report/${productId}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to toggle report:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="my-16 max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="animate-pulse">🌟</span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Featured Products
            </span>
            <span className="animate-pulse">🌟</span>
          </h2>
          <p className="text-xl text-gray-300">Loading amazing products...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
              <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-3 rounded mb-4"></div>
              <div className="bg-gray-700 h-8 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 max-w-7xl mx-auto px-6 relative">
      {/* 3D Animation Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} />
          
          <FloatingStars />
          
          <Sparkles
            count={50}
            scale={15}
            size={2}
            speed={0.2}
            opacity={0.3}
            color="#FFD700"
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="animate-pulse">🌟</span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Featured Products
            </span>
            <span className="animate-pulse">🌟</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the most innovative and highly-rated tech products from our community
          </p>
        </div>
        
        {/* Grid Layout: 4 columns on large screens, 2 on medium, 1 on small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="transform hover:scale-105 transition-all duration-300"
            >
              <ProductCard
                product={product}
                onUpvoteToggle={handleUpvoteToggle}
                onReportToggle={handleReportToggle}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg transform hover:scale-105"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
