import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaShieldAlt, FaGift, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  const tranId = searchParams.get('tran_id');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency') || 'BDT';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard/user/profile');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FaCheckCircle className="text-white text-4xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <FaStar className="text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-green-600/20 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Your verification payment has been completed successfully. Welcome to the verified community!
          </p>

          {/* Payment Details */}
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold text-lg mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white font-mono text-sm">{tranId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-green-400 font-semibold">{currency} {amount || '5000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white">SSLCommerz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">✓ Completed</span>
              </div>
            </div>
          </div>

          {/* Verification Benefits */}
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MdVerified className="text-green-400 text-2xl" />
              <h3 className="text-white font-semibold text-lg">You're Now Verified!</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-green-400" />
                <span className="text-gray-300 text-sm">Verified Badge</span>
              </div>
              <div className="flex items-center gap-3">
                <FaGift className="text-green-400" />
                <span className="text-gray-300 text-sm">Premium Features</span>
              </div>
              <div className="flex items-center gap-3">
                <FaStar className="text-green-400" />
                <span className="text-gray-300 text-sm">Priority Listing</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400" />
                <span className="text-gray-300 text-sm">Analytics Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/user/profile')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold transition-all shadow-lg"
          >
            Go to My Profile
          </button>
          
          <button
            onClick={() => navigate('/dashboard/user/add-product')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all border border-gray-600"
          >
            Add Your First Product
          </button>
        </div>

        {/* Auto Redirect */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Redirecting to profile in {countdown} seconds...
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/30 rounded-xl">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-blue-400" />
            <div className="text-left">
              <p className="text-blue-200 font-medium text-sm">Secure Payment</p>
              <p className="text-blue-300 text-xs">Your payment was processed securely through SSLCommerz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 