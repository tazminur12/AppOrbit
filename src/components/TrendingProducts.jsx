import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/fiber';
import { motion } from 'framer-motion';

// Floating Fire Particles for Trending Section
const FloatingFireParticles = () => {
  const groupRef = React.useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.003;
        child.rotation.x += 0.02;
        child.rotation.z += 0.01;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, index) => (
        <Float key={index} speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <mesh position={[
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15,
            0
          ]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? "#FF4500" : index % 3 === 1 ? "#FF6347" : "#FF8C00"}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/products?sort=upvotes');
      const products = Array.isArray(res.data) ? res.data : res.data.data;
      const trending = (products || []).sort((a, b) => b.upvotes - a.upvotes);
      setProducts(trending.slice(0, 8)); // Show 8 products for better grid
    } catch (error) {
      console.error('Failed to fetch trending products:', error);
      // Fallback to sample data if API fails
      setProducts([
        {
          _id: '1',
          name: 'AI Code Assistant Pro',
          description: 'Advanced AI-powered coding companion with real-time suggestions and code review',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
          tags: ['AI', 'Development', 'Productivity'],
          upvotes: 456,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '2',
          name: 'Cloud DevOps Suite',
          description: 'Enterprise-grade DevOps platform with automated deployment and monitoring',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
          tags: ['DevOps', 'Cloud', 'Enterprise'],
          upvotes: 389,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '3',
          name: 'Design System Pro',
          description: 'Professional design system builder for scalable UI/UX projects',
          image: 'https://images.unsplash.com/photo-1561070791-2526d41294b5?w=400&h=300&fit=crop',
          tags: ['Design', 'UI/UX', 'Professional'],
          upvotes: 334,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '4',
          name: 'Data Analytics Pro',
          description: 'Enterprise data analytics platform with advanced visualization and ML insights',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          tags: ['Analytics', 'Data', 'Machine Learning'],
          upvotes: 278,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '5',
          name: 'Mobile App Studio',
          description: 'Complete mobile app development studio with cross-platform support',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
          tags: ['Mobile', 'Development', 'Studio'],
          upvotes: 245,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '6',
          name: 'Security Testing Pro',
          description: 'Comprehensive security testing suite for enterprise applications',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
          tags: ['Security', 'Testing', 'Enterprise'],
          upvotes: 192,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '7',
          name: 'API Gateway Enterprise',
          description: 'Enterprise-grade API gateway with advanced security and monitoring',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
          tags: ['API', 'Gateway', 'Enterprise'],
          upvotes: 167,
          externalLink: 'https://example.com',
          upvotedUsers: [],
          reportedUsers: [],
          reportCount: 0
        },
        {
          _id: '8',
          name: 'Blockchain Development Pro',
          description: 'Professional blockchain development toolkit for enterprise DApps',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['Blockchain', 'Enterprise', 'DApp'],
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

  const handleUpvoteToggle = async (productId) => {
    try {
      await axiosSecure.patch(`/products/upvote/${productId}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      throw error;
    }
  };

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
            <span className="animate-bounce">🔥</span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Trending Products
            </span>
            <span className="animate-bounce delay-1000">🔥</span>
          </h2>
          <p className="text-xl text-gray-300">Loading trending products...</p>
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
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#FF4500" />
          
          <FloatingFireParticles />
          
          <Sparkles
            count={80}
            scale={20}
            size={2.5}
            speed={0.4}
            opacity={0.4}
            color="#FF4500"
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="animate-bounce">🔥</span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Trending Products
            </span>
            <span className="animate-bounce delay-1000">🔥</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The most popular and highly-rated products that are making waves in the tech community
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
              className="transform hover:scale-105 transition-all duration-300 hover:rotate-1"
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
          <Link to="/products">
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
