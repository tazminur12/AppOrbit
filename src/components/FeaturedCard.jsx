import React from "react";
import { RocketIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";

const FeatureCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {/* Card 1 */}
      <div className="rounded-2xl shadow-lg p-6 text-center transition hover:-translate-y-1 hover:shadow-2xl">
        <RocketIcon className="mx-auto text-purple-400 w-10 h-10 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">Launch with Ease</h3>
        <p className="text-gray-300 text-sm">
          Effortlessly upload and showcase your digital products to a global audience.
        </p>
      </div>

      {/* Card 2 */}
      <div className="rounded-2xl shadow-lg p-6 text-center transition hover:-translate-y-1 hover:shadow-2xl">
        <ShieldCheckIcon className="mx-auto text-indigo-400 w-10 h-10 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">Secure & Trusted</h3>
        <p className="text-gray-300 text-sm">
          Verified sellers, secure payments, and real-time reporting for ultimate trust.
        </p>
      </div>

      {/* Card 3 */}
      <div className="rounded-2xl shadow-lg p-6 text-center transition hover:-translate-y-1 hover:shadow-2xl">
        <UsersIcon className="mx-auto text-pink-400 w-10 h-10 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">Built for Community</h3>
        <p className="text-gray-300 text-sm">
          Engage with users, receive feedback, and grow your digital brand together.
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
