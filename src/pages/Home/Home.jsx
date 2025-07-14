import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import FeaturedProducts from '../../components/FeaturedProducts';
import TrendingProducts from '../../components/TrendingProducts';
import CouponSlider from '../../components/CouponSlider';
import ExtraSectionOne from '../../components/ExtraSectionOne';
import ExtraSectionTwo from '../../components/ExtraSectionTwo';
import FeatureCard from '../../components/FeaturedCard';
import HeroBanner from '../../components/HeroBanner';
import Home3DAnimation from '../../components/Home3DAnimation';

const Home = () => {
  const [particles, setParticles] = useState([]);

  // Generate floating particles like login page
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full opacity-60"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full opacity-40"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Beautiful 3D Animation Background */}
      <Home3DAnimation />
      
      {/* Main Content */}
      <div className="relative z-10">
        <HeroBanner />
        <FeaturedProducts />
        <TrendingProducts />
        <CouponSlider />
        <ExtraSectionOne />
        <ExtraSectionTwo />
        <FeatureCard />
      </div>
    </div>
  );
};

export default Home;
