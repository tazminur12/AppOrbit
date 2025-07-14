import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { format, isAfter } from 'date-fns';
import { FiClock, FiPercent, FiCode } from 'react-icons/fi';
import { FaFire, FaRegCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CouponSlider = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosSecure.get('/coupons');
        // Filter out expired coupons and sort by newest first
        const activeCoupons = (res.data || [])
          .filter(coupon => coupon.isActive && isAfter(new Date(coupon.expiryDate), new Date()))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCoupons(activeCoupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [axiosSecure]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (isLoading) {
    return (
      <div className="mt-16 text-center">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-gray-700 h-12 w-12"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading coupons...</p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="mt-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <FiPercent className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-300">No active coupons available</h3>
        <p className="mt-2 text-gray-500">Check back later for special offers</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white mb-3">
          <FaFire className="mr-1" /> HOT DEALS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Exclusive Discounts</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Limited-time offers to enhance your shopping experience
        </p>
      </div>

      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: (index, className) => {
              return `<span class="${className}" style="background-color: #a855f7"></span>`;
            }
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          loop={coupons.length > 1}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { 
              slidesPerView: coupons.length >= 3 ? 3 : coupons.length,
              spaceBetween: 30
            },
          }}
          className="pb-12"
        >
          {coupons.map((coupon) => (
            <SwiperSlide key={coupon._id}>
              <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 text-white shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow">
                      <FiPercent className="mr-1" /> {coupon.discountAmount}% OFF
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-300">
                      <FiClock className="mr-1" /> Expires {format(new Date(coupon.expiryDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white">{coupon.description || 'Special Discount'}</h3>
                  
                  <div className="mt-6 mb-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiCode className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        readOnly
                        value={coupon.code} 
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full pl-10 p-2.5 pr-10 font-mono"
                      />
                      <button 
                        onClick={() => copyToClipboard(coupon.code)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-purple-400 transition-colors"
                        aria-label="Copy code"
                      >
                        <FaRegCopy />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Valid until</span>
                      <span className="text-sm text-white font-medium">
                        {format(new Date(coupon.expiryDate), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Created</span>
                      <span className="text-sm text-gray-300">
                        {format(new Date(coupon.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation buttons */}
        {coupons.length > 3 && (
          <>
            <button 
              className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-800/80 shadow-md flex items-center justify-center text-white hover:bg-purple-600 transition-colors backdrop-blur-sm"
              aria-label="Previous coupon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-800/80 shadow-md flex items-center justify-center text-white hover:bg-purple-600 transition-colors backdrop-blur-sm"
              aria-label="Next coupon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default CouponSlider;