import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaLightbulb, FaUsers, FaArrowRight } from 'react-icons/fa';

const HeroBanner = () => {
  const heroFeatures = [
    { icon: <FaRocket className="text-2xl" />, text: "Launch Ideas" },
    { icon: <FaLightbulb className="text-2xl" />, text: "Innovate" },
    { icon: <FaUsers className="text-2xl" />, text: "Connect" }
  ];

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Discover
                </span>
                <br />
                <span className="text-white">
                  Tech Innovation
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl lg:mx-0 mx-auto leading-relaxed"
            >
              Connect with developers, designers, and innovators worldwide. Share your tech ideas, discover amazing tools, and build the future together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                <span className="flex items-center gap-2">
                  Get Started Free
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-purple-500 text-purple-400 font-semibold text-lg hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                Explore Products
              </button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mt-8"
            >
              {heroFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-800/30 border border-purple-500/30 rounded-full text-purple-300 backdrop-blur-sm"
                >
                  {feature.icon}
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/15 to-pink-500/15 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 delay-200" />
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl w-[350px] h-[400px] flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform duration-500">
                {/* Hero Image */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mb-4 border-4 border-purple-300/30 shadow-lg group-hover:border-purple-300/50 transition-all duration-300">
                    <img
                      src="/ai.png"
                      alt="AI Innovation"
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/48x48?text=AI';
                      }}
                    />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  AI-Powered Innovation
                </h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  Discover cutting-edge AI tools and solutions that are transforming the tech landscape
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">500+</div>
                    <div className="text-xs text-gray-400">AI Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400">10K+</div>
                    <div className="text-xs text-gray-400">Users</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
