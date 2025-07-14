import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxios from '../../hooks/useAxios';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

// Floating Product Details Icons
const FloatingProductDetailsIcons = () => {
  const groupRef = React.useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.001;
        child.rotation.x += 0.01;
        child.rotation.z += 0.005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Product Details Icons */}
      {[...Array(10)].map((_, index) => (
        <Float key={index} speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            0
          ]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? "#3b82f6" : index % 3 === 1 ? "#8b5cf6" : "#10b981"}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxios();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          axiosPublic.get(`/products/${id}`),
          axiosPublic.get(`/reviews/${id}`)
        ]);
        
        setProduct(prodRes.data);
        setReviews(revRes.data);
        
        if (user) {
          setHasUpvoted(prodRes.data.upvotedUsers?.includes(user.email));
          setHasReported(prodRes.data.reportedUsers?.includes(user.email));
        }
      } catch {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, axiosPublic, navigate]);

  const toggleUpvote = async () => {
    if (!user) return navigate('/login');
    if (actionLoading) return;

    setActionLoading(true);
    try {
      await axiosSecure.patch(`/products/upvote/${id}`);
      setHasUpvoted((prev) => !prev);
      setProduct((prev) => ({
        ...prev,
        upvotes: hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
        upvotedUsers: hasUpvoted
          ? prev.upvotedUsers.filter((e) => e !== user.email)
          : [...prev.upvotedUsers, user.email],
      }));
      toast.success(hasUpvoted ? 'Upvote removed' : 'Upvoted!');
    } catch {
      toast.error('Upvote failed');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleReport = async () => {
    if (!user) return navigate('/login');
    if (actionLoading) return;

    setActionLoading(true);
    try {
      await axiosSecure.post(`/products/report/${id}`);
      setHasReported((prev) => !prev);
      setProduct((prev) => ({
        ...prev,
        reportCount: hasReported ? (prev.reportCount || 1) - 1 : (prev.reportCount || 0) + 1,
        reportedUsers: hasReported
          ? prev.reportedUsers.filter((e) => e !== user.email)
          : [...(prev.reportedUsers || []), user.email],
      }));
      toast.success(hasReported ? 'Report removed' : 'Reported successfully');
    } catch {
      toast.error('Report failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      return toast.warning('Review comment is required');
    }
    setReviewLoading(true);
    try {
      const reviewData = {
        productId: id,
        reviewerName: user.displayName || 'Anonymous',
        reviewerEmail: user.email,
        reviewerImage: user.photoURL || '',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        createdAt: new Date().toISOString(),
      };
      await axiosSecure.post('/reviews', reviewData);
      setReviews((prev) => [reviewData, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review posted!');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-100 relative">
      {/* 3D Animation Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#3b82f6" />
          
          <FloatingProductDetailsIcons />
          
          <Sparkles
            count={60}
            scale={20}
            size={2}
            speed={0.3}
            opacity={0.3}
            color="#3b82f6"
          />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Product Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-1/2 group">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={product.image || 'https://via.placeholder.com/400x300'}
                  alt={product.name}
                  className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {product.name}
                </h2>
                <p className="text-gray-300 whitespace-pre-line mb-4 leading-relaxed">
                  {product.description}
                </p>

                {product.tags?.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-indigo-600/80 text-white px-3 py-1 text-sm rounded-full border border-indigo-500/50 hover:bg-indigo-500/80 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {product.externalLink && (
                  <a
                    href={product.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 hover:underline block mb-2 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>🔗</span>
                    Visit: {new URL(product.externalLink).hostname}
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <button
                  onClick={toggleUpvote}
                  disabled={actionLoading}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    hasUpvoted 
                      ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/50' 
                      : 'bg-green-700/80 hover:bg-green-600 hover:shadow-lg hover:shadow-green-600/50'
                  } text-white ${
                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="animate-pulse">👍</span> {hasUpvoted ? 'Upvoted' : 'Upvote'} ({product.upvotes || 0})
                </button>

                <button
                  onClick={toggleReport}
                  disabled={actionLoading}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    hasReported 
                      ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/50' 
                      : 'bg-red-700/80 hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/50'
                  } text-white ${
                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="animate-pulse">⚠️</span> {hasReported ? 'Reported' : 'Report'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <span>💬</span>
            Reviews ({reviews.length})
          </h3>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl transition-colors ${
                        star <= newReview.rating ? 'text-yellow-400' : 'text-gray-400'
                      } hover:text-yellow-300`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Write your review..."
                className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
              <button
                type="submit"
                disabled={reviewLoading}
                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {reviewLoading ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={review.reviewerImage || 'https://via.placeholder.com/40'}
                    alt={review.reviewerName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{review.reviewerName}</p>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;