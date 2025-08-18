// components/AnimationShowcase.jsx
import React, { useState } from 'react';
import Global3DAnimation from './Global3DAnimation';
import Home3DAnimation from './Home3DAnimation';
import Product3DAnimation from './Product3DAnimation';
import Loading3DAnimation from './Loading3DAnimation';
import Background3DAnimation from './Background3DAnimation';
import Button3DAnimation from './Button3DAnimation';

const AnimationShowcase = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const tabs = [
    { id: 'global', name: 'Global Animation', component: <Global3DAnimation /> },
    { id: 'home', name: 'Home Animation', component: <Home3DAnimation /> },
    { id: 'product', name: 'Product Animation', component: <Product3DAnimation /> },
    { id: 'loading', name: 'Loading Animation', component: <Loading3DAnimation size="large" /> },
    { id: 'background', name: 'Background Animation', component: <Background3DAnimation /> },
    { id: 'button', name: '3D Button', component: <Button3DAnimation text="Try Me!" onClick={handleButtonClick} /> }
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Background Animation */}
      <Background3DAnimation intensity="low" />
      
      {/* Header */}
      <div className="relative z-10 pt-6 pb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            3D Animation Showcase
          </h1>
          <p className="text-base text-center text-gray-300 mb-6">
            Professional 3D animations for modern web applications
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/50'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700">
            {/* Tab Content */}
            <div className="min-h-[400px] flex items-center justify-center">
              {tabs.find(tab => tab.id === activeTab)?.component}
            </div>

            {/* Description */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto text-sm">
                {activeTab === 'global' && 
                  "Global background animation with floating particles, geometric shapes, and dynamic lighting effects."
                }
                {activeTab === 'home' && 
                  "Home page animation featuring DNA helix, tech icons, and interactive 3D text with professional lighting."
                }
                {activeTab === 'product' && 
                  "Product card animation with interactive hover effects, floating spheres, and dynamic color themes."
                }
                {activeTab === 'loading' && 
                  "Professional loading animation with pulsing spheres, rotating rings, and floating particles."
                }
                {activeTab === 'background' && 
                  "Dynamic background animation with wave effects, data streams, and geometric networks."
                }
                {activeTab === 'button' && 
                  "Interactive 3D button with hover effects, press animations, and floating particle systems."
                }
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-800/40 rounded-lg p-4 border border-purple-600">
                <h4 className="text-base font-semibold mb-2 text-purple-300">Performance Optimized</h4>
                <p className="text-gray-300 text-xs">
                  Efficient rendering with optimized geometries and smart re-rendering strategies.
                </p>
              </div>
              <div className="bg-purple-800/40 rounded-lg p-4 border border-purple-600">
                <h4 className="text-base font-semibold mb-2 text-indigo-300">Interactive Elements</h4>
                <p className="text-gray-300 text-xs">
                  Hover effects, click animations, and responsive interactions for better UX.
                </p>
              </div>
              <div className="bg-purple-800/40 rounded-lg p-4 border border-purple-600">
                <h4 className="text-base font-semibold mb-2 text-pink-300">Modern Design</h4>
                <p className="text-gray-300 text-xs">
                  Professional visual effects with glow, sparkles, and dynamic lighting systems.
                </p>
              </div>
            </div>

            {/* Code Example */}
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3 text-center text-purple-300">Usage Example</h4>
              <div className="bg-gray-900 rounded-lg p-3 border border-purple-700">
                <pre className="text-xs text-gray-300 overflow-x-auto">
                  <code>{`import { Global3DAnimation } from './components/Global3DAnimation';

// Add to your component
<Global3DAnimation />

// Or with custom props
<Background3DAnimation intensity="high" />
<Button3DAnimation text="Click Me" color="#10b981" />`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loading3DAnimation size="large" />
        </div>
      )}
    </div>
  );
};

export default AnimationShowcase; 