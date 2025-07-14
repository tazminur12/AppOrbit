import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text3D } from '@react-three/drei';
import * as THREE from 'three';

// Floating Tech Icons for Hero
const FloatingTechIcons = () => {
  const groupRef = React.useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.001;
        child.rotation.x += 0.01;
        child.rotation.z += 0.005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* React Logo */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[8, 2, 0]}>
          <torusGeometry args={[0.4, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#61DAFB"
            transparent
            opacity={0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* Node.js */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-8, -1, 1]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#68A063"
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      </Float>

      {/* Database */}
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[6, -2, -1]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
          <meshStandardMaterial
            color="#F7DF1E"
            transparent
            opacity={0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* AI/ML */}
      <Float speed={1.9} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh position={[-6, 1, 2]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial
            color="#FF6B6B"
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
};

const HeroBanner = () => {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* 3D Animation Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#a78bfa" />
          
          <FloatingTechIcons />
          
          <Sparkles
            count={100}
            scale={20}
            size={3}
            speed={0.3}
            opacity={0.4}
            color="#a78bfa"
          />
        </Canvas>
      </div>

      {/* Dotted grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {/* Remove the soft gradient overlay for seamless look */}
      
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 gap-12">
        {/* Left Text */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            Discover, Share, and Illuminate Tech Innovations
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
            Discover and celebrate the latest tech ideas. AppOrbit connects innovators, developers, and tech lovers in one digital universe.
          </p>
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all text-lg relative focus:outline-none focus:ring-2 focus:ring-purple-400 group">
            <span className="drop-shadow group-hover:scale-105 transition-transform">Explore More</span>
            <span className="absolute -inset-1 rounded-xl blur-xl opacity-40 bg-gradient-to-r from-purple-600 to-indigo-600 z-[-1] group-hover:opacity-60 transition-opacity" />
          </button>
        </div>

        {/* Right Card with Enhanced 3D Effects */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative group">
            {/* Animated glow effects */}
            <div className="absolute top-4 left-4 w-full h-full rounded-3xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-md scale-95 z-0 animate-pulse" />
            <div className="absolute top-8 left-8 w-full h-full rounded-3xl bg-gradient-to-r from-indigo-500/15 to-pink-500/15 blur-md scale-90 z-0 animate-pulse delay-1000" />
            
            <div className="relative z-10 rounded-3xl bg-purple-900/80 border border-white/10 shadow-2xl p-8 w-[320px] md:w-[350px] backdrop-blur-xl group-hover:scale-105 transition-all duration-300 hover:border-white/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mb-4 border-4 border-purple-300/30 shadow-lg group-hover:border-purple-300/50 transition-all duration-300 animate-bounce">
                  <img
                    src="/ai.png"
                    alt="icon"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Developer Productivity Suite</h2>
                <p className="text-gray-300 mb-6 text-sm">
                  Supercharge your workflow with tools built for creators and coders.
                </p>
                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all text-base focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105 transform">
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
