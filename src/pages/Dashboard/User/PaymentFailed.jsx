import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTimesCircle, FaExclamationTriangle, FaRedo, FaHome, FaHeadset } from "react-icons/fa";
import { MdError } from "react-icons/md";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  
  const tranId = searchParams.get('tran_id');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency') || 'BDT';
  const failReason = searchParams.get('fail_reason') || 'Payment was not completed';

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
        {/* Error Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FaTimesCircle className="text-white text-4xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <FaExclamationTriangle className="text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-red-600/20 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Failed ❌
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Unfortunately, your payment could not be completed. Don't worry, you can try again.
          </p>

          {/* Error Details */}
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold text-lg mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white font-mono text-sm">{tranId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-red-400 font-semibold">{currency} {amount || '5000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white">SSLCommerz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-red-400 font-semibold">✗ Failed</span>
              </div>
            </div>
          </div>

          {/* Error Reason */}
          <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-600/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MdError className="text-red-400 text-2xl" />
              <h3 className="text-white font-semibold text-lg">What Happened?</h3>
            </div>
            <p className="text-red-200 text-sm mb-4">
              {failReason}
            </p>
            <div className="text-left space-y-2 text-sm text-gray-300">
              <p>• Check your internet connection</p>
              <p>• Ensure sufficient balance in your account</p>
              <p>• Verify your payment details</p>
              <p>• Contact your bank if needed</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/user/sslcommerz-payment')}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <FaRedo className="text-white" />
            Try Payment Again
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard/user/profile')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all border border-gray-600 flex items-center justify-center gap-2"
            >
              <FaHome className="text-white" />
              Back to Profile
            </button>
            
            <button
              onClick={() => {
                // Open support chat or email
                window.open('mailto:support@apporbit.com?subject=Payment%20Issue', '_blank');
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all border border-gray-600 flex items-center justify-center gap-2"
            >
              <FaHeadset className="text-white" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Auto Redirect */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Redirecting to profile in {countdown} seconds...
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-xl">
            <div className="flex items-center gap-3">
              <FaHeadset className="text-blue-400" />
              <div className="text-left">
                <p className="text-blue-200 font-medium text-sm">Need Help?</p>
                <p className="text-blue-300 text-xs">Our support team is available 24/7 to assist you</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-yellow-400" />
              <div className="text-left">
                <p className="text-yellow-200 font-medium text-sm">Common Issues</p>
                <p className="text-yellow-300 text-xs">Network issues, insufficient balance, or bank restrictions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed; 