// components/Loading3DAnimation.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Environment, 
  Sparkles,
  Text3D
} from '@react-three/drei';
import * as THREE from 'three';

// Animated Loading Ring
const LoadingRing = () => {
  const ringRef = useRef();
  const innerRingRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.03;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= 0.02;
    }
  });

  return (
    <group>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.2, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </group>
  );
};

// Pulsing Loading Sphere
const LoadingSphere = () => {
  const sphereRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.02;
      sphereRef.current.rotation.x += 0.01;
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      sphereRef.current.scale.set(scale, scale, scale);
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.03;
      glowRef.current.rotation.x += 0.015;
    }
  });

  return (
    <group>
      {/* Glow effect */}
      <mesh ref={glowRef} scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

// Floating Loading Particles
const LoadingParticles = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.children.forEach((child, index) => {
        const time = state.clock.elapsedTime;
        child.position.y = Math.sin(time * 2 + index) * 0.5;
        child.position.x = Math.cos(time * 1.5 + index) * 0.3;
        child.rotation.z += 0.02;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, index) => (
        <Float key={index} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[
            Math.cos(index * Math.PI / 4) * 3,
            Math.sin(index * Math.PI / 4) * 3,
            0
          ]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Animated Loading Text
const LoadingText = () => {
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.2}
        height={0.05}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
        position={[0, -3, 0]}
      >
        Loading...
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.8}
        />
      </Text3D>
    </Float>
  );
};

// Main Loading Animation Component
const Loading3DAnimation = ({ 
  size = "medium",
  className = ""
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small": return "w-32 h-32";
      case "large": return "w-96 h-96";
      default: return "w-64 h-64";
    }
  };

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#3b82f6" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Sparkles */}
        <Sparkles
          count={30}
          scale={10}
          size={2}
          speed={0.3}
          opacity={0.4}
          color="#3b82f6"
        />
        
        {/* Main Components */}
        <LoadingRing />
        <LoadingSphere />
        <LoadingParticles />
        <LoadingText />
        
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-gray-500 font-medium">Please wait...</div>
        </div>
      </div>
    </div>
  );
};

export default Loading3DAnimation; 