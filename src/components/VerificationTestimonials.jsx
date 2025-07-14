import React from 'react';
import { Star, Quote } from 'lucide-react';

const VerificationTestimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Product Creator",
      avatar: "https://i.ibb.co/VqKJ8Mp/avatar1.jpg",
      rating: 5,
      text: "Getting verified for $50 was the best investment for my business. My products now get approved within hours instead of days, and customers trust me more. Sales increased by 300%!",
      verified: true
    },
    {
      name: "Mike Chen",
      role: "App Developer",
      avatar: "https://i.ibb.co/0jZ3Q8M/avatar2.jpg",
      rating: 5,
      text: "The verification badge gives me instant credibility. Customers are more likely to purchase from verified sellers. The $50 fee paid for itself in the first week.",
      verified: true
    },
    {
      name: "Emily Rodriguez",
      role: "Designer",
      avatar: "https://i.ibb.co/9vKJ8Mp/avatar3.jpg",
      rating: 5,
      text: "Priority listing and faster approval times make a huge difference. My products now appear at the top of search results. Worth every penny of the $50 investment.",
      verified: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-700 shadow-xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Quote className="w-6 h-6 text-yellow-500" />
          <h3 className="text-2xl font-bold text-white">Success Stories</h3>
        </div>
        <p className="text-gray-400 text-sm">
          See how verification helped other sellers grow their business
        </p>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
            <div className="flex items-start gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border-2 border-green-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  {testimonial.verified && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{testimonial.role}</p>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-center">
        <p className="text-white font-semibold">
          🚀 Join thousands of verified sellers who transformed their business with AppOrbit verification!
        </p>
      </div>
    </div>
  );
};

export default VerificationTestimonials; 