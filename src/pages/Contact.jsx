import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
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
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
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
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className={`max-w-5xl w-full mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-300 text-sm">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Animated Picture */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  {/* Animated Icon */}
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-ping"></div>
                  </div>
                  
                  {/* Contact Info */}
                  <h3 className="text-lg font-semibold text-indigo-300 mb-4">Let's Connect</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>hello@apporbit.com</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+880 1712-345678</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Dhaka, Bangladesh</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>BDT Time Zone (GMT+6)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
              <div className="absolute top-1/2 -right-3 w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 text-sm ${
                      errors.name 
                        ? 'border-red-500 bg-red-500/10' 
                        : focusedField === 'name'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    } text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50`}
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 text-sm ${
                      errors.email 
                        ? 'border-red-500 bg-red-500/10' 
                        : focusedField === 'email'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    } text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50`}
                    placeholder="you@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 text-sm ${
                      errors.subject 
                        ? 'border-red-500 bg-red-500/10' 
                        : focusedField === 'subject'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    } text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50`}
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 resize-none text-sm ${
                      errors.message 
                        ? 'border-red-500 bg-red-500/10' 
                        : focusedField === 'message'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    } text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50`}
                    placeholder="Type your message..."
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitted}
                  className={`w-full py-2 rounded-lg font-medium text-sm mt-3 transition-all duration-300 relative overflow-hidden ${
                    submitted
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {submitted ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-green-500/30 shadow-2xl animate-bounce">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300 text-sm">We'll get back to you soon.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact; 