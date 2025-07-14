import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className={`max-w-lg w-full mx-auto bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-12 flex flex-col items-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Header with staggered animation */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-3xl font-extrabold text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-300">
            Have a question, suggestion, or want to collaborate? Fill out the form below and we'll get back to you soon!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Name Field */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="name">
              Name
            </label>
            <div className="relative group">
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  errors.name 
                    ? 'border-red-500 bg-red-500/10' 
                    : focusedField === 'name'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/25'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                placeholder="Your Name"
              />
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-all duration-300 ${
                focusedField === 'name' ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-2 animate-pulse flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="email">
              Email
            </label>
            <div className="relative group">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500 bg-red-500/10' 
                    : focusedField === 'email'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/25'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                placeholder="you@email.com"
              />
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-all duration-300 ${
                focusedField === 'email' ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-2 animate-pulse flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className={`transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="message">
              Message
            </label>
            <div className="relative group">
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 resize-none ${
                  errors.message 
                    ? 'border-red-500 bg-red-500/10' 
                    : focusedField === 'message'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/25'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                placeholder="Type your message..."
              />
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-all duration-300 ${
                focusedField === 'message' ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>
            {errors.message && (
              <p className="text-red-400 text-sm mt-2 animate-pulse flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              type="submit"
              disabled={submitted}
              className={`w-full py-3 rounded-lg font-semibold text-lg mt-2 transition-all duration-300 relative overflow-hidden group ${
                submitted
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                {submitted ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Message Sent!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Success Message */}
        {submitted && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 border border-green-500/30 shadow-2xl animate-bounce">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-300">We'll get back to you soon.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact; 