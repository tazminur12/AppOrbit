import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SSLCommerzPayment = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customer_name: user?.displayName || "",
    customer_email: user?.email || "",
    customer_address: "",
    customer_phone: "",
    customer_city: "",
    customer_postcode: "",
    customer_country: "Bangladesh"
  });

  const [paymentAmount] = useState(5000); // 5000 BDT = $50 USD
  const [discountedAmount, setDiscountedAmount] = useState(5000);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const response = await axiosSecure.post("/coupons/validate", { code: couponCode });
      const { discountAmount, discountType, couponCode: validatedCode } = response.data;

      let newAmount = paymentAmount;
      if (discountType === "percentage") {
        newAmount = Math.max(0, paymentAmount - Math.floor((paymentAmount * discountAmount) / 100));
      } else {
        newAmount = Math.max(0, paymentAmount - discountAmount);
      }

      setDiscountedAmount(newAmount);
      setAppliedCoupon(validatedCode);

      Swal.fire({
        icon: "success",
        title: "Coupon Applied!",
        text: `You got ৳${paymentAmount - newAmount} off your verification fee!`,
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "The coupon code you entered is invalid or expired.",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
      setAppliedCoupon(null);
      setDiscountedAmount(paymentAmount);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_address) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }
    
    setProcessing(true);
    try {
      // Use the backend API endpoint for payment initiation
      const { data } = await axiosSecure.post("/api/payment/initiate", {
        amount: discountedAmount,
        name: formData.customer_name,
        email: formData.customer_email,
        phone: formData.customer_phone,
        productName: "AppOrbit Verification"
      });
      
      if (data.GatewayPageURL) {
        setCurrentStep(2);
        
        // Show loading message
        Swal.fire({
          title: "Redirecting to SSLCommerz",
          text: "Please complete your payment in the new window",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Open SSLCommerz payment page in a new window
        const paymentWindow = window.open(data.GatewayPageURL, '_blank', 'width=1000,height=700');
        
        // Check if window was opened successfully
        if (!paymentWindow) {
          Swal.close();
          Swal.fire("Error", "Please allow popups to proceed with payment", "error");
          return;
        }
        
        // Listen for window close event
        const checkWindowClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkWindowClosed);
            Swal.close();
            // Payment will be handled by success/fail redirects from backend
          }
        }, 1000);
        
        // Stop checking after 15 minutes
        setTimeout(() => {
          clearInterval(checkWindowClosed);
        }, 900000);
        
      } else {
        Swal.fire("Error", "Failed to create payment session", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setProcessing(false);
    }
  };

  const checkPaymentStatus = async (sessionId) => {
    try {
      const statusResponse = await axiosSecure.get(`/sslcommerz/status/${sessionId}`);
      if (statusResponse.data.status === 'VALID') {
        handlePaymentSuccess();
      } else if (statusResponse.data.status === 'FAILED') {
        Swal.fire("Payment Failed", "Payment was not completed successfully.", "error");
      } else {
        Swal.fire("Payment Pending", "Your payment is being processed. Please wait a moment and try again.", "info");
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      Swal.fire("Error", "Unable to verify payment status. Please contact support.", "error");
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await axiosSecure.patch(`/users/subscribe/${user.email}`);
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "You are now a verified member. Welcome to AppOrbit!",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate('/dashboard/user/profile');
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const steps = [
    { id: 1, title: "Payment Details", description: "Enter your information" },
    { id: 2, title: "Payment Gateway", description: "Complete payment" },
    { id: 3, title: "Confirmation", description: "Payment verification" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SSLCommerz Payment</h1>
              <p className="text-gray-400">Secure payment gateway for Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-white font-medium">{steps[currentStep - 1]?.title}</p>
            <p className="text-gray-400 text-sm">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Payment Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address *</label>
                    <textarea
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      rows="3"
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                    <input
                      type="text"
                      name="customer_city"
                      value={formData.customer_city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="customer_postcode"
                      value={formData.customer_postcode}
                      onChange={handleInputChange}
                      placeholder="Enter postal code"
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium">Apply Coupon Code</h3>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-green-400 text-sm mt-2">✓ Coupon applied: {appliedCoupon}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 transition-all shadow-xl flex items-center justify-center text-lg"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                                             Pay ৳${discountedAmount} with SSLCommerz
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                                 <div className="flex justify-between">
                   <span className="text-gray-400">Verification Fee</span>
                   <span className="text-white">৳${paymentAmount}</span>
                 </div>
                {discountedAmount < paymentAmount && (
                                     <div className="flex justify-between">
                     <span className="text-green-400">Discount</span>
                     <span className="text-green-400">-৳${paymentAmount - discountedAmount}</span>
                   </div>
                )}
                <hr className="border-gray-600" />
                                 <div className="flex justify-between">
                   <span className="text-white font-semibold">Total</span>
                   <span className="text-white font-semibold text-lg">৳${discountedAmount}</span>
                 </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Credit/Debit Cards</p>
                    <p className="text-gray-400 text-xs">Visa, MasterCard, Amex</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Mobile Banking</p>
                    <p className="text-gray-400 text-xs">bKash, Nagad, Rocket</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Internet Banking</p>
                    <p className="text-gray-400 text-xs">All major banks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold">Secure Payment</h4>
              </div>
              <div className="space-y-2 text-sm text-green-200">
                <p>• 256-bit SSL encryption</p>
                <p>• PCI DSS compliant</p>
                <p>• Instant payment confirmation</p>
                <p>• 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard/user/profile')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSLCommerzPayment; 