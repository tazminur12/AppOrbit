import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CountAnimation = ({ number, label, duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      
      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(parseInt(number.replace(/[^0-9]/g, '')) * easeOutQuart);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          // Ensure final number is exact
          setCount(parseInt(number.replace(/[^0-9]/g, '')));
        }
      };

      const timer = setTimeout(() => {
        updateCount();
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, number, duration, delay]);

  // Handle different number formats (e.g., "500+", "99%")
  const formatNumber = (num) => {
    if (number.includes('+')) {
      return `${num}+`;
    } else if (number.includes('%')) {
      return `${num}%`;
    } else if (number.includes('K')) {
      return `${num}K`;
    }
    return num;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
        {formatNumber(count)}
      </div>
      <div className="text-gray-300 text-lg">{label}</div>
    </motion.div>
  );
};

export default CountAnimation;
