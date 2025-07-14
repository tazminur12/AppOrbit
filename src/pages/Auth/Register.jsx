import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Camera,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';

// Image URL validation function
const validateImageUrl = (url) => {
  if (!url) return { valid: true }; // Optional field
  
  try {
    const urlObj = new URL(url);
    
    // Check if it's a valid URL
    if (!urlObj.protocol || !urlObj.hostname) {
      return { valid: false, error: 'Please enter a valid URL' };
    }
    
    // Accept any valid URL (user can provide any image link)
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid URL' };
  }
};

const Register = () => {
  const { register, loginWithGoogle, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [particles, setParticles] = useState([]);
  const [isFocused, setIsFocused] = useState({ 
    name: false, 
    email: false, 
    password: false, 
    confirmPassword: false,
    photoUrl: false
  });
  const navigate = useNavigate();

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  // Handle photo URL change
  const handlePhotoUrlChange = (e) => {
    const url = e.target.value;
    setPhotoUrl(url);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Validate photo URL if provided
    if (photoUrl.trim()) {
      const urlValidation = validateImageUrl(photoUrl);
      if (!urlValidation.valid) {
        setError(urlValidation.error);
        return;
      }
    }

    try {
      await register(email, password, name, photoUrl);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
      transition: { duration: 0.2 },
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(139, 92, 246, 0)",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
    },
  };



  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full opacity-60"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full opacity-40"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="mb-6 flex justify-center"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <User className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">Join Us</h1>
            <p className="text-gray-300 text-lg">Create your account to get started</p>
          </motion.div>

          {/* Register Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <motion.div
                variants={inputVariants}
                animate={isFocused.name ? "focused" : "unfocused"}
              >
                <label className="block text-gray-200 mb-2 font-medium" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, name: true })}
                    onBlur={() => setIsFocused({ ...isFocused, name: false })}
                    required
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div
                variants={inputVariants}
                animate={isFocused.email ? "focused" : "unfocused"}
              >
                <label className="block text-gray-200 mb-2 font-medium" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    required
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                variants={inputVariants}
                animate={isFocused.password ? "focused" : "unfocused"}
              >
                <label className="block text-gray-200 mb-2 font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    required
                  />
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                variants={inputVariants}
                animate={isFocused.confirmPassword ? "focused" : "unfocused"}
              >
                <label className="block text-gray-200 mb-2 font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                    onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                    required
                  />
                </div>
              </motion.div>

              {/* Photo URL Input */}
              <motion.div
                variants={inputVariants}
                animate={isFocused.photoUrl ? "focused" : "unfocused"}
              >
                <label className="block text-gray-200 mb-2 font-medium" htmlFor="photoUrl">
                  Profile Photo URL (Optional)
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="photoUrl"
                    type="url"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                    placeholder="Your Image URL"
                    value={photoUrl}
                    onChange={handlePhotoUrlChange}
                    onFocus={() => setIsFocused({ ...isFocused, photoUrl: true })}
                    onBlur={() => setIsFocused({ ...isFocused, photoUrl: false })}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Any valid image URL (ImgBB, Cloudinary, Unsplash, Imgur, etc.)
                </p>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Register Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                      </motion.div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="flex items-center my-6"
              variants={itemVariants}
            >
              <div className="flex-grow h-px bg-gray-700" />
              <span className="mx-4 text-gray-400 font-medium">or continue with</span>
              <div className="flex-grow h-px bg-gray-700" />
            </motion.div>

            {/* Google Register Button */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <button
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <g>
                    <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.1 20-21 0-1.3-.1-2.1-.3-3z"/>
                    <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 17.1 18.3 15 24 15c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 15.3 3 7.7 8.6 6.3 14.7z"/>
                    <path fill="#FBBC05" d="M24 45c5.8 0 10.7-1.9 14.7-5.1l-7-5.7C29.7 35.5 27 36 24 36c-5.7 0-10.7-3.8-12.5-9.1l-7 5.4C7.7 39.4 15.3 45 24 45z"/>
                    <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.7 7.5-11.7 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.1 20-21 0-1.3-.1-2.1-.3-3z"/>
                  </g>
                </svg>
                {loading ? 'Please wait...' : 'Continue with Google'}
              </button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-6"
            variants={itemVariants}
          >
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
