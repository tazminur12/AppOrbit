import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, RefreshCw, Search, AlertTriangle } from 'lucide-react';

const ErrorPage = () => {
  const [particles, setParticles] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.8, 0.3],
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

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl w-full text-center">
          {/* Error Icon */}
          <motion.div
            className="mb-8 flex justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
                <AlertTriangle className="w-16 h-16 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-20"
                variants={pulseVariants}
                animate="animate"
              />
            </motion.div>
          </motion.div>

          {/* Error Number */}
          <motion.h1
            className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            404
          </motion.h1>

          {/* Error Title */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
            variants={itemVariants}
          >
            Oops! Page Not Found
          </motion.h2>

          {/* Error Description */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-lg mx-auto"
            variants={itemVariants}
          >
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, we'll help you find your way back!
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/">
                <button
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg flex items-center gap-2 group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Home className="w-5 h-5" />
                  </motion.div>
                  Back to Home
                </button>
              </Link>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <button
                onClick={() => window.history.back()}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold text-lg shadow-lg flex items-center gap-2 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </motion.div>
          </motion.div>

          {/* Additional Help Section */}
          <motion.div
            className="mt-16 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-300">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                <span>Check the URL spelling</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                <span>Try refreshing the page</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-400" />
                <span>Navigate from homepage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full opacity-60"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-6 h-6 bg-pink-400 rounded-full opacity-40"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-3 h-3 bg-blue-400 rounded-full opacity-50"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default ErrorPage;
