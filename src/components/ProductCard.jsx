import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';

const ProductCard = ({ product, onUpvoteToggle, onReportToggle }) => {
  const { user } = useContext(AuthContext);
  const [hasUpvoted, setHasUpvoted] = useState(product?.upvotedUsers?.includes(user?.email));
  const [hasReported, setHasReported] = useState(product?.reportedUsers?.includes(user?.email));
  const [isProcessing, setIsProcessing] = useState(false);
  const [localProduct, setLocalProduct] = useState(product);

  const handleAction = async (actionType) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (!user) {
      toast.warning(`Please log in to ${actionType} this product.`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setIsProcessing(false);
      return;
    }

    try {
      await (actionType === 'upvote'
        ? onUpvoteToggle(localProduct._id)
        : onReportToggle(localProduct._id));

      if (actionType === 'upvote') {
        setHasUpvoted(!hasUpvoted);
        setLocalProduct((prev) => ({
          ...prev,
          upvotes: hasUpvoted ? (prev.upvotes || 1) - 1 : (prev.upvotes || 0) + 1,
          upvotedUsers: hasUpvoted
            ? prev.upvotedUsers.filter(email => email !== user.email)
            : [...(prev.upvotedUsers || []), user.email],
        }));

        toast.success(hasUpvoted ? 'Upvote removed!' : 'Upvoted successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      } else {
        setHasReported(!hasReported);
        setLocalProduct((prev) => ({
          ...prev,
          reportCount: hasReported ? (prev.reportCount || 1) - 1 : (prev.reportCount || 0) + 1,
          reportedUsers: hasReported
            ? prev.reportedUsers.filter(email => email !== user.email)
            : [...(prev.reportedUsers || []), user.email],
          reported: !hasReported,
        }));

        toast.success(hasReported ? 'Report removed!' : 'Reported successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error(`Error toggling ${actionType}:`, error);
      toast.error(`Failed to ${actionType} product. Please try again.`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="group border border-gray-700 rounded-lg shadow-lg p-4 flex flex-col bg-gray-900/80 backdrop-blur-sm text-white hover:shadow-2xl transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/90 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={localProduct.image}
          alt={localProduct.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Corrected Link path to /products/:id */}
        <Link
          to={`/products/${localProduct._id}`}
          className="hover:text-indigo-400 transition-colors"
        >
          <h3 className="font-bold text-lg cursor-pointer line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {localProduct.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-300 mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
          {localProduct.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {localProduct.tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-800/80 text-white px-2 py-0.5 rounded-full text-xs border border-indigo-600/50 hover:bg-indigo-700/80 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* External Link */}
        {localProduct.externalLink && (
          <a
            href={localProduct.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 hover:underline mb-2 text-sm truncate transition-colors duration-200 flex items-center gap-1"
          >
            <span>🔗</span>
            {new URL(localProduct.externalLink).hostname}
          </a>
        )}

        {/* Report Count */}
        {localProduct.reportCount > 0 && (
          <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
            <span>⚠️</span>
            Reports: {localProduct.reportCount}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex justify-between items-center pt-2">
          <button
            onClick={() => handleAction('upvote')}
            disabled={isProcessing}
            className={`px-3 py-1 rounded-md transition-all duration-200 flex items-center gap-1 transform hover:scale-105 ${
              hasUpvoted
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/50'
                : 'bg-green-800/80 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-700/50'
            } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span className="animate-pulse">👍</span>
            {hasUpvoted ? 'Upvoted' : 'Upvote'} ({localProduct.upvotes || 0})
          </button>

          <button
            onClick={() => handleAction('report')}
            disabled={isProcessing}
            className={`px-3 py-1 rounded-md transition-all duration-200 flex items-center gap-1 transform hover:scale-105 ${
              hasReported
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-red-800/80 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-700/50'
            } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span className="animate-pulse">⚠️</span>
            {hasReported ? 'Reported' : 'Report'}
          </button>
        </div>
      </div>

      {/* Corner Decoration */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ProductCard;
