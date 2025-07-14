import React from 'react';
import { CheckCircle, Shield, Star, Zap, Users, Award } from 'lucide-react';

const VerificationBenefits = () => {
  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Badge",
      description: "Get a prestigious verified badge on your profile and products"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Priority Listing",
      description: "Your products appear higher in search results and featured sections"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Approval",
      description: "Products get approved faster with priority review process"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Enhanced Trust",
      description: "Build trust with customers through verified seller status"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Support",
      description: "Access to dedicated customer support and priority assistance"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Analytics Access",
      description: "Detailed analytics and insights for your product performance"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-700 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Premium Verification Benefits</h3>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl font-bold text-green-500">$50</span>
          <span className="text-gray-400">one-time payment</span>
        </div>
        <p className="text-gray-400 text-sm">
          Unlock premium features and boost your credibility on AppOrbit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
            <div className="text-green-500 mt-1">
              {benefit.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-center">
        <p className="text-white font-semibold">
          🎉 Limited Time Offer: Get verified today and start building trust with your customers!
        </p>
      </div>
    </div>
  );
};

export default VerificationBenefits; 