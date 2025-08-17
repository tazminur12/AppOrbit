import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaLightbulb, FaUsers, FaStar, FaGift, FaNewspaper, FaChartLine, FaShieldAlt, FaCode, FaHeart } from 'react-icons/fa';

import FeaturedProducts from '../../components/FeaturedProducts';
import TrendingProducts from '../../components/TrendingProducts';
import CouponSlider from '../../components/CouponSlider';
import HeroBanner from '../../components/HeroBanner';
import Home3DAnimation from '../../components/Home3DAnimation';
import NewsletterSection from '../../components/NewsletterSection';
import CallToActionSection from '../../components/CallToActionSection';
import CategoriesSection from '../../components/CategoriesSection';
import TestimonialsSection from '../../components/TestimonialsSection';

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

  // Sample data for sections
  const features = [
    {
      icon: <FaRocket className="text-4xl text-purple-400" />,
      title: "Launch Your Ideas",
      description: "Transform your tech concepts into reality with our comprehensive platform.",
      link: "/products"
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-400" />,
      title: "Innovation Hub",
      description: "Discover cutting-edge solutions and inspire your next breakthrough project.",
      link: "/products"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-400" />,
      title: "Community Driven",
      description: "Connect with developers, designers, and innovators worldwide.",
      link: "/about"
    },
    {
      icon: <FaStar className="text-4xl text-green-400" />,
      title: "Quality Assurance",
      description: "Curated content and verified products for the best user experience.",
      link: "/products"
    }
  ];

  const stats = [
    { number: "500+", label: "Products Launched" },
    { number: "10K+", label: "Active Users" },
    { number: "50+", label: "Categories" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

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

      {/* Beautiful 3D Animation Background */}
      <Home3DAnimation />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* 1. Hero Section */}
        <HeroBanner />

        {/* 2. Features Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">AppOrbit</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the features that make AppOrbit the ultimate platform for tech innovators
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 mb-6">{feature.description}</p>
                  <a
                    href={feature.link}
                    className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                  >
                    See More
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Featured Products Section */}
        <FeaturedProducts />

        {/* 4. Statistics Section */}
        <section className="py-20 px-6 relative bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
              <p className="text-xl text-gray-300">See how AppOrbit is growing and helping developers worldwide</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Trending Products Section */}
        <TrendingProducts />

        {/* 6. Categories Section */}
        <CategoriesSection />

        {/* 7. Sales Promotion Section */}
        <CouponSlider />

        {/* 8. Testimonials Section */}
        <TestimonialsSection />

        {/* 9. Newsletter Section */}
        <NewsletterSection />

        {/* 10. Call to Action Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

export default Home;
