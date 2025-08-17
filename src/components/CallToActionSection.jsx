import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

const CallToActionSection = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-12 border border-purple-500/30 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }} />
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            <FaRocket className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Launch Your Idea?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and innovators who are already building the future on AppOrbit. 
              Start your journey today and make your mark in the tech world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Get Started Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 font-semibold text-lg hover:shadow-lg"
              >
                Explore Products
              </motion.a>
            </div>

            {/* Additional Benefits */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Free to join</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
