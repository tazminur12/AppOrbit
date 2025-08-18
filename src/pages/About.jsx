import React, { useEffect, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 px-4 py-12 text-center">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative inline-block mb-4 group">
              <img 
                src="/src/assets/ai.png" 
                alt="AppOrbit Logo" 
                className="w-14 h-14 mx-auto animate-bounce hover:scale-110 transition-transform duration-300 cursor-pointer" 
              />
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            </div>
          </div>

          <h1 className={`text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            AppOrbit
          </h1>
          <p className={`text-base md:text-lg text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Revolutionizing the way developers, creators, and innovators connect, collaborate, and bring their ideas to life in the digital ecosystem.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Vision & Mission Section */}
          <div className={`mb-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-400">
                  Our Vision
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  To become the premier platform where innovation meets opportunity, creating a global ecosystem that accelerates the development and adoption of cutting-edge digital solutions.
                </p>
                <p className="text-gray-400 leading-relaxed text-sm">
                  We envision a world where every great idea has the potential to reach its audience, where collaboration transcends boundaries, and where technology serves as a bridge between creativity and impact.
                </p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Our Mission</h3>
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                  AppOrbit is committed to empowering the global tech community by providing:
                </p>
                <ul className="space-y-2">
                  {[
                    "A comprehensive platform for product discovery and validation",
                    "Advanced AI-powered tools for market research and user insights",
                    "Seamless collaboration opportunities between developers and stakeholders",
                    "Robust analytics and feedback systems for continuous improvement"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className={`mb-12 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold mb-8 text-center text-indigo-400">Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Innovation First",
                  description: "We believe in pushing boundaries and embracing new technologies to solve complex challenges.",
                  icon: "🚀"
                },
                {
                  title: "Community Driven",
                  description: "Our success is built on the strength and collaboration of our global community of creators and users.",
                  icon: "🤝"
                },
                {
                  title: "Quality Excellence",
                  description: "We maintain the highest standards in everything we do, from platform development to user experience.",
                  icon: "⭐"
                },
                {
                  title: "Transparency",
                  description: "Open communication and honest feedback are the cornerstones of our platform and relationships.",
                  icon: "🔍"
                },
                {
                  title: "User-Centric",
                  description: "Every decision we make is guided by the needs and feedback of our community members.",
                  icon: "👥"
                },
                {
                  title: "Continuous Growth",
                  description: "We are committed to constant learning, improvement, and adaptation to meet evolving needs.",
                  icon: "📈"
                }
              ].map((value, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="text-2xl mb-3">{value.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What We Offer Section */}
          <div className={`mb-12 transition-all duration-1000 delay-1300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold mb-8 text-center text-indigo-400">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">For Developers & Creators</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Product showcase and discovery platform</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">AI-powered market analysis and insights</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Community feedback and validation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Collaboration opportunities with stakeholders</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">For Users & Stakeholders</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Early access to innovative products</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Direct engagement with development teams</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Influence product development direction</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Access to exclusive beta testing opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className={`mb-12 transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold mb-8 text-center text-indigo-400">Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  name: "Alex Rahman", 
                  role: "Chief Executive Officer & Founder", 
                  image: "https://randomuser.me/api/portraits/men/32.jpg",
                  bio: "Visionary leader with 10+ years in tech entrepreneurship and platform development."
                },
                { 
                  name: "Sara Lee", 
                  role: "Chief Design Officer", 
                  image: "https://randomuser.me/api/portraits/women/44.jpg",
                  bio: "Award-winning designer focused on creating intuitive and engaging user experiences."
                },
                { 
                  name: "John Doe", 
                  role: "Chief Technology Officer", 
                  image: "https://randomuser.me/api/portraits/men/65.jpg",
                  bio: "Full-stack expert specializing in scalable architecture and AI integration."
                }
              ].map((member, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105 text-center"
                >
                  <div className="relative mb-3 inline-block">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-16 h-16 rounded-full border-2 border-indigo-500 mx-auto" 
                    />
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-indigo-300">{member.name}</h3>
                  <p className="text-indigo-400 font-medium mb-2 text-sm">{member.role}</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA Section */}
          <div className={`text-center transition-all duration-1000 delay-1700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-3 text-indigo-400">Ready to Join Our Community?</h2>
              <p className="text-gray-300 mb-4 max-w-2xl mx-auto text-sm">
                Whether you're a developer looking to showcase your work, a user seeking innovative solutions, or a stakeholder wanting to invest in the future, AppOrbit is your gateway to the next generation of digital innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:transform hover:scale-105 text-sm">
                  Get Started Today
                </button>
                <button className="border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 text-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-1900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 mb-1 text-sm">
                &copy; {new Date().getFullYear()} AppOrbit. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Empowering innovation, one connection at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 