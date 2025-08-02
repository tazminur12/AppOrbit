import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { getAuth, updateProfile } from "firebase/auth";
import VerificationBenefits from "../../../components/VerificationBenefits";
import VerificationPricing from "../../../components/VerificationPricing";
import VerificationFAQ from "../../../components/VerificationFAQ";
import VerificationTestimonials from "../../../components/VerificationTestimonials";

// Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return { url: data.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Image validation function
const validateImageFile = (file) => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a valid image file (JPG, PNG, GIF, WebP)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 2MB' };
  }

  return { valid: true };
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CouponSection = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    try {
      await onApplyCoupon(couponCode);
      setCouponCode("");
    } catch {
      // handled by parent
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Apply Coupon Code</h3>
      </div>
      <form onSubmit={handleApplyCoupon} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          <button
            type="submit"
            disabled={isApplying || !couponCode.trim()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 font-medium rounded-lg transition-all disabled:opacity-50 text-sm shadow-md w-full sm:w-auto flex items-center justify-center"
          >
            {isApplying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </>
            ) : "Apply"}
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
        Enter a valid coupon code to get discounts on your verification fee.
      </p>
    </div>
  );
};

const MembershipForm = ({ email, onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { data } = await axiosSecure.post("/create-payment-intent", { amount });
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });
      if (result.error) {
        Swal.fire("Payment Failed", result.error.message, "error");
      } else if (result.paymentIntent?.status === "succeeded") {
        await axiosSecure.post("/payments", {
          email,
          amount,
          paymentIntentId: result.paymentIntent.id,
        });
        await axiosSecure.patch(`/users/subscribe/${email}`);
        Swal.fire("Success", "Verification successful! You are now a verified member.", "success");
        onSuccess();
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#f3f4f6",
                "::placeholder": { color: "#9ca3af" },
                iconColor: "#6366f1",
              },
              invalid: { color: "#ef4444" },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 transition-all shadow-lg flex items-center justify-center"
      >
        {processing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : `Pay $${amount}`}
      </button>
    </form>
  );
};

const SSLCommerzForm = ({ email, amount }) => {
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: email,
    customer_address: "",
    customer_phone: "",
    customer_city: "",
    customer_postcode: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        amount: amount,
        name: formData.customer_name,
        email: formData.customer_email,
        phone: formData.customer_phone,
        productName: "AppOrbit Verification"
      });
      
      if (data.GatewayPageURL) {
        // Show loading message
        Swal.fire({
          title: "Redirecting to Payment Gateway",
          text: "Please complete your payment in the new window",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Open SSLCommerz payment page in a new window
        const paymentWindow = window.open(data.GatewayPageURL, '_blank', 'width=800,height=600');
        
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



  return (
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
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">SSLCommerz Secure Payment</h4>
            <p className="text-gray-300 text-sm">Bangladesh's leading payment gateway</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
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
          
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
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
          
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
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
          
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="p-2 bg-orange-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Secure SSL</p>
              <p className="text-gray-400 text-xs">256-bit encryption</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Instant payment confirmation • Secure SSL encrypted • Multiple payment options</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-600/30 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h5 className="text-white font-semibold text-base mb-3">Payment Process</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className="text-blue-200 text-sm">Fill in your details above</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="text-blue-200 text-sm">Click "Pay with SSLCommerz" button</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span className="text-blue-200 text-sm">New window opens with payment options</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                  <span className="text-green-200 text-sm">Complete payment in SSLCommerz</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
                  <span className="text-green-200 text-sm">Close payment window when done</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">6</div>
                  <span className="text-green-200 text-sm">Automatic redirect back to app</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
              <div className="flex items-center gap-2 text-blue-200 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Your payment is secure and encrypted. SSLCommerz is Bangladesh's most trusted payment gateway.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
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
              Pay ৳${amount * 100} with SSLCommerz
            </>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure SSL Encrypted Payment</span>
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            Swal.fire({
              title: "Check Payment Status",
              text: "If you've completed payment but haven't received confirmation, click OK to check status",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Check Status",
              cancelButtonText: "Cancel"
            }).then((result) => {
              if (result.isConfirmed) {
                // This would need to be implemented to check the last payment session
                Swal.fire("Info", "Please contact support to check your payment status.", "info");
              }
            });
          }}
          className="text-green-400 hover:text-green-300 text-sm underline"
        >
          Check Payment Status
        </button>
      </div>
    </form>
  );
};

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(10);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  
  // Settings state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  const subscriptionAmount = 50; // USD for Stripe
  const sslcommerzAmount = 5000; // BDT for SSLCommerz

  const fetchUserProfile = async () => {
    if (!user?.email) return;
    try {
      const { data } = await axiosSecure.get(`/users/profile/${user.email}`);
      setMembership(data.membership || null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const handleSubscriptionSuccess = () => {
    setShowPayment(false);
    setAppliedCoupon(null);
    setDiscountedAmount(subscriptionAmount);
    fetchUserProfile();
  };

  const handleApplyCoupon = async (couponCode) => {
    try {
      const response = await axiosSecure.post("/coupons/validate", { code: couponCode });
      const { discountAmount, discountType, couponCode: validatedCode } = response.data;

      let newAmount = subscriptionAmount;
      if (discountType === "percentage") {
        newAmount = Math.max(0, subscriptionAmount - Math.floor((subscriptionAmount * discountAmount) / 100));
      } else {
        newAmount = Math.max(0, subscriptionAmount - discountAmount);
      }

      setDiscountedAmount(newAmount);
      setAppliedCoupon(validatedCode);

      Swal.fire({
        icon: "success",
        title: "Coupon Applied!",
        text: `You got $${subscriptionAmount - newAmount} off your verification fee!`,
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
      setDiscountedAmount(subscriptionAmount);
      throw error;
    }
  };

  // File handling functions
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file using utility function
    const validation = validateImageFile(file);
    if (!validation.valid) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: validation.error,
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Settings handlers
  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      let photoUrl = profileData.photoURL;

      // Upload photo if file is selected
      if (photoFile) {
        setIsUploading(true);
        try {
          const uploadResult = await uploadToCloudinary(photoFile);
          photoUrl = uploadResult.url;
        } catch (uploadError) {
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: uploadError.message || 'Failed to upload image. Please try again.',
            background: "#1f2937",
            color: "#f9fafb",
            confirmButtonColor: "#ef4444",
          });
          setIsUpdating(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Update backend
      await axiosSecure.patch(`/users/profile/${user.email}`, {
        displayName: profileData.displayName,
        photoURL: photoUrl
      });
      
      // Update Firebase user profile
      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName,
          photoURL: photoUrl
        });
      }
      
      // Update local state
      setProfileData(prev => ({ ...prev, photoURL: photoUrl }));
      
      // Force re-render by updating the user object in context
      // This will trigger the AuthContext to refresh
      window.location.reload();
      
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile information has been updated successfully.",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsUpdating(false);
    }
  };



  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Account</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Manage your profile, subscription, and account settings</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={user.photoURL || "https://i.ibb.co/SsZ9LgB/user.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
                  />
                  {membership === "verified" && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white text-center">
                  {user.displayName || "Anonymous User"}
                </h2>
                <p className="text-gray-400 text-sm text-center">{user.email}</p>
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    membership === "verified" 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-700 text-gray-300"
                  }`}>
                    {membership === "verified" ? "Verified Member" : "Free Account"}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeTab === "overview"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("verification")}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeTab === "verification"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Account Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700 rounded-lg p-5 border border-gray-600">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Member Since</h3>
                    <p className="text-lg font-semibold text-white">
                      {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-5 border border-gray-600">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Last Login</h3>
                    <p className="text-lg font-semibold text-white">
                      {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-5 border border-gray-600 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg mr-4 ${
                        membership === "verified" ? "bg-green-600" : "bg-indigo-600"
                      }`}>
                        {membership === "verified" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {membership === "verified" ? "Verified Account" : "Basic Account"}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {membership === "verified" 
                            ? "You have full access to all features" 
                            : "Upgrade to unlock premium features"}
                        </p>
                      </div>
                    </div>
                    {membership !== "verified" && (
                      <button 
                        onClick={() => setActiveTab("verification")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="space-y-8">
                {membership === "verified" ? (
                  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-green-600/20">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="bg-green-600/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-white">You're Verified!</h3>
                        <p className="text-gray-400 mt-1">
                          Thank you for verifying your account. You now have full access to all premium features.
                        </p>
                        <div className="mt-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600/20 text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Verified Member
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                      <h2 className="text-2xl font-semibold text-white mb-2">Get Verified</h2>
                      <p className="text-gray-400 mb-6">
                        Upgrade to a verified account to unlock premium features and benefits.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-700 rounded-lg p-5 border border-gray-600">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">Basic</h3>
                            <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">Current</span>
                          </div>
                          <ul className="space-y-3 text-gray-400 text-sm mb-6">
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Standard access
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Basic features
                            </li>
                            <li className="flex items-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Limited support
                            </li>
                          </ul>
                          <div className="text-center">
                            <span className="text-2xl font-bold text-white">$0</span>
                            <span className="text-gray-400 text-sm">/month</span>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-indigo-900 to-gray-800 rounded-lg p-5 border border-indigo-600 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 transform translate-x-2 translate-y-2 rotate-12">
                            Recommended
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-3">Verified</h3>
                          <ul className="space-y-3 text-gray-300 text-sm mb-6">
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Full access
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Premium features
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Priority support
                            </li>
                          </ul>
                          <div className="text-center">
                            <span className="text-2xl font-bold text-white">${subscriptionAmount}</span>
                            <span className="text-gray-300 text-sm">/one-time</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-5 border border-gray-600">
                          <h3 className="text-lg font-semibold text-white mb-3">Enterprise</h3>
                          <ul className="space-y-3 text-gray-400 text-sm mb-6">
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Custom solutions
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Dedicated support
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Advanced analytics
                            </li>
                          </ul>
                          <div className="text-center">
                            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                              Contact Sales
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <CouponSection onApplyCoupon={handleApplyCoupon} />
                      
                      <div className="mt-8 space-y-4">
                        <button
                          onClick={() => setShowPayment(true)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-lg"
                        >
                          Get Verified for ${discountedAmount}
                        </button>
                        
                        <div className="text-center">
                          <span className="text-gray-400 text-sm">or</span>
                        </div>
                        
                        <button
                          onClick={() => navigate('/dashboard/user/sslcommerz-payment')}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Pay ৳${sslcommerzAmount} with SSLCommerz
                        </button>
                      </div>
                    </div>
                    
                    <VerificationBenefits />
                    <VerificationTestimonials />
                    <VerificationFAQ />
                  </>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Enter your display name"
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email || ""}
                      disabled
                      className="w-full bg-gray-700 border border-gray-600 text-gray-400 rounded-lg px-4 py-3 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Profile Photo</label>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={photoPreview || profileData.photoURL || "https://i.ibb.co/SsZ9LgB/user.png"}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
                        />
                        {photoPreview && (
                          <button
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        <div 
                          className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 cursor-pointer hover:bg-indigo-700 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Upload New Photo
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleProfileUpdate}
                    disabled={isUpdating || isUploading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {(isUpdating || isUploading) ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isUploading ? 'Uploading...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4" onClick={() => setShowPayment(false)}>
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                <button 
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex justify-between mb-2 text-white font-medium">
                  <span>Verification Fee</span>
                  <span>${subscriptionAmount}</span>
                </div>
                {discountedAmount < subscriptionAmount && (
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Discount</span>
                    <span>-${subscriptionAmount - discountedAmount}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <p className="text-xs text-green-400 mt-1">Coupon: {appliedCoupon}</p>
                )}
                <hr className="my-3 border-gray-700" />
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${discountedAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Choose Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedPaymentMethod("stripe")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === "stripe"
                        ? "border-indigo-500 bg-indigo-600/20"
                        : "border-gray-600 bg-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white">Stripe</div>
                        <div className="text-xs text-gray-400">Credit/Debit Cards</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPaymentMethod("sslcommerz")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === "sslcommerz"
                        ? "border-green-500 bg-green-600/20"
                        : "border-gray-600 bg-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white">SSLCommerz</div>
                        <div className="text-xs text-gray-400">Multiple Options</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Payment Forms */}
              {selectedPaymentMethod === "stripe" ? (
                <Elements stripe={stripePromise}>
                  <MembershipForm
                    email={user.email}
                    onSuccess={handleSubscriptionSuccess}
                    amount={discountedAmount}
                  />
                </Elements>
              ) : (
                <SSLCommerzForm
                  email={user.email}
                  onSuccess={handleSubscriptionSuccess}
                  amount={discountedAmount}
                />
              )}
              
              <div className="mt-4 flex items-center text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payments are secure and encrypted
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;