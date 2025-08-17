import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaCheck, FaEnvelope } from 'react-icons/fa';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setIsSubscribed(true);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
      
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
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

          {/* Success State */}
          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-emerald-900/80 rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Successfully Subscribed!</h3>
                <p className="text-green-200">Thank you for joining our newsletter. We'll keep you updated with the latest tech trends!</p>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="relative z-10">
            <FaNewspaper className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest tech trends, product launches, and community updates delivered to your inbox. 
              Join thousands of developers staying ahead of the curve.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    disabled={isLoading || isSubscribed}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || isSubscribed}
                  className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    isLoading ? 'animate-pulse' : ''
                  }`}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-left"
                >
                  {error}
                </motion.p>
              )}

              {/* Success Message */}
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm"
                >
                  Welcome to the AppOrbit community! 🎉
                </motion.p>
              )}
            </form>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-400">
              <p>🔒 We respect your privacy. Unsubscribe at any time.</p>
              <p>📧 Get updates 2-3 times per month with the latest tech insights.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
