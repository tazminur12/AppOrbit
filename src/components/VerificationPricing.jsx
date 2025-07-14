import React from 'react';
import { CreditCard, DollarSign, Shield, CheckCircle } from 'lucide-react';

const VerificationPricing = ({ onGetVerified }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-700 shadow-xl">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-green-500" />
          <h3 className="text-2xl font-bold text-white">Premium Verification</h3>
        </div>
        <span className="text-4xl font-bold text-green-500">$50</span>
        <p className="text-gray-400 text-sm mt-2">One-time payment</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-white text-sm">Lifetime verification badge</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-white text-sm">Priority product approval</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-white text-sm">Enhanced customer trust</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-white text-sm">Premium support access</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onGetVerified}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Get Verified Now
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by Stripe
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">100% secure & encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPricing; 