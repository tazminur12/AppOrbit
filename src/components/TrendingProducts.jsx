import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

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
  const axiosSecure = useAxiosSecure();

  const fetchData = async () => {
    try {
      const res = await axiosSecure.get('/products?status=accepted');
      const sorted = res.data
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 6);
      setProducts(sorted);
    } catch (error) {
      console.error("Failed to fetch trending products:", error);
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

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
        <h2 className="text-3xl font-bold mb-6 dark:text-gray-100 flex items-center gap-3">
          <span className="animate-bounce">🔥</span>
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Trending Products
          </span>
          <span className="animate-bounce delay-1000">🔥</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div 
              key={product._id}
              className="transform hover:scale-105 transition-all duration-300 hover:rotate-1"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ProductCard
                product={product}
                onUpvoteToggle={handleUpvoteToggle}
                onReportToggle={handleReportToggle}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/products">
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Show All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
