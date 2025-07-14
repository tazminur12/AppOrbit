import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

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
  const axiosSecure = useAxiosSecure();

  // Fetch products from backend
  const fetchData = async () => {
    try {
      const res = await axiosSecure.get('/products?status=accepted&sort=createdAt');
      const products = Array.isArray(res.data) ? res.data : res.data.data;
      const featured = (products || []).filter(p => p.isFeatured).slice(0, 4);
      setProducts(featured);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
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

  // Report toggle handler (optional, you can implement similarly)
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
    <section className="my-16 max-w-6xl mx-auto px-4 relative">
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
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="animate-pulse">🌟</span>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Featured Products
          </span>
          <span className="animate-pulse">🌟</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product._id}
              className="transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                product={product}
                onUpvoteToggle={handleUpvoteToggle}
                onReportToggle={handleReportToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
