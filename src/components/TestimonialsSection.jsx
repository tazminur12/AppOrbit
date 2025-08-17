import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Full Stack Developer",
      content: "AppOrbit helped me discover amazing tools that boosted my productivity by 300%! The community here is incredibly supportive and the quality of products is outstanding.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      content: "The community here is incredible. I've found solutions to problems I didn't even know I had. AppOrbit has become my go-to resource for tech innovation.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "AppOrbit is my go-to place for discovering the latest design tools and resources. The curated selection and community reviews make finding quality tools effortless.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-6 relative bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real feedback from developers and innovators using AppOrbit. Join thousands of satisfied users 
            who have transformed their workflow with our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <FaQuoteLeft className="text-3xl text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <p className="text-gray-300 italic mb-6 text-center leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center justify-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-purple-500/30"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://i.ibb.co/2kR5zq0/default-user.png';
                  }}
                />
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Testimonial Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-2">4.9/5</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-300">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
