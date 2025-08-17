import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaRocket, FaLightbulb, FaHeart, FaShieldAlt, FaChartLine } from 'react-icons/fa';

const CategoriesSection = () => {
  const categories = [
    { name: "Web Development", count: "150+", icon: <FaCode className="text-2xl" />, color: "from-blue-500 to-cyan-500" },
    { name: "Mobile Apps", count: "120+", icon: <FaRocket className="text-2xl" />, color: "from-purple-500 to-pink-500" },
    { name: "AI & Machine Learning", count: "80+", icon: <FaLightbulb className="text-2xl" />, color: "from-green-500 to-emerald-500" },
    { name: "Design Tools", count: "90+", icon: <FaHeart className="text-2xl" />, color: "from-red-500 to-orange-500" },
    { name: "DevOps", count: "60+", icon: <FaShieldAlt className="text-2xl" />, color: "from-indigo-500 to-purple-500" },
    { name: "Data Science", count: "70+", icon: <FaChartLine className="text-2xl" />, color: "from-teal-500 to-blue-500" }
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Explore Categories</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find the perfect tools and resources for your next project. Browse through our curated categories 
            to discover solutions that match your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                  {category.icon}
                </div>
                <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {category.name}
              </h3>
              <a
                href="/products"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium group-hover:scale-105 transform"
              >
                See More
              </a>
            </motion.div>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Categories
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
