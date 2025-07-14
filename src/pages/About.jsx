import React, { useEffect, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className={`max-w-3xl w-full mx-auto bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-12 flex flex-col items-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo/Icon with floating animation */}
        <div className={`mb-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            <img 
              src="/src/assets/ai.png" 
              alt="AppOrbit Logo" 
              className="w-16 h-16 mx-auto animate-bounce hover:scale-110 transition-transform duration-300 cursor-pointer" 
            />
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </div>
        </div>

        {/* Project Name & Tagline with staggered animation */}
        <h1 className={`text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          AppOrbit
        </h1>
        <p className={`text-lg text-gray-300 mb-8 text-center max-w-xl transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Empowering developers and creators to showcase, discover, and collaborate on innovative products in a vibrant, AI-powered community.
        </p>

        {/* Mission/Features with slide-in animation */}
        <div className={`mb-10 w-full transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold mb-3 text-indigo-400 text-center hover:text-indigo-300 transition-colors duration-300">
            Our Mission
          </h2>
          <p className="text-gray-400 text-center mb-4">
            AppOrbit is dedicated to connecting tech enthusiasts, makers, and users. We provide a platform to:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mx-auto max-w-md">
            {[
              "Share and discover cutting-edge products",
              "Get real feedback and reviews from the community", 
              "Promote your ideas and grow your audience",
              "Leverage AI tools for smarter product discovery"
            ].map((item, index) => (
              <li 
                key={index}
                className={`transition-all duration-500 delay-${1000 + index * 200} hover:text-indigo-300 hover:translate-x-2 cursor-default ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Team/Credits with card animations */}
        <div className={`w-full mt-6 border-t border-gray-700 pt-6 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center hover:text-indigo-300 transition-colors duration-300">
            Meet the Team
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {[
              { name: "Alex Rahman", role: "Founder", image: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Sara Lee", role: "Lead Designer", image: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "John Doe", role: "Full Stack Dev", image: "https://randomuser.me/api/portraits/men/65.jpg" }
            ].map((member, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center group transition-all duration-500 delay-${1200 + index * 200} hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="relative mb-2">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-14 h-14 rounded-full border-2 border-indigo-500 group-hover:border-indigo-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25" 
                  />
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </div>
                <span className="font-medium group-hover:text-indigo-300 transition-colors duration-300">{member.name}</span>
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{member.role}</span>
              </div>
            ))}
          </div>
          <p className={`text-xs text-gray-500 mt-6 text-center transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            &copy; {new Date().getFullYear()} AppOrbit. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 