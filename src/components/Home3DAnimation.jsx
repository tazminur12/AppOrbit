// components/Home3DAnimation.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Text3D, 
  Float, 
  Environment, 
  Sparkles,
  useGLTF,
  PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';

// Animated DNA Helix
const DNAHelix = () => {
  const groupRef = useRef();
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 4;
      const radius = 1;
      const x = Math.cos(angle) * radius;
      const y = (i / 100) * 4 - 2;
      const z = Math.sin(angle) * radius;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Animated Home Sphere with Advanced Effects
const HomeSphere = () => {
  const meshRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x += 0.008;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.02;
      glowRef.current.rotation.x += 0.012;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group>
      {/* Outer glow ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.1, 16, 100]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={[2.2, 2.2, 2.2]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
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

// Floating Tech Icons
const FloatingTechIcons = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.002;
        child.rotation.y += 0.02;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* React Logo */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[4, 1, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
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
        <mesh position={[-4, -1, 1]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
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
        <mesh position={[2, -2, 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
          <meshStandardMaterial
            color="#F7DF1E"
            transparent
            opacity={0.8}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
};

// Animated Text
const AnimatedText = () => {
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.3}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={[0, 3, 0]}
      >
        AppOrbit
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.8}
        />
      </Text3D>
    </Float>
  );
};

const Home3DAnimation = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          color="#3b82f6"
        />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Background Stars */}
        <Stars
          radius={80}
          depth={50}
          count={4000}
          factor={4}
          fade
          speed={0.8}
        />
        
        {/* Sparkles */}
        <Sparkles
          count={150}
          scale={15}
          size={3}
          speed={0.4}
          opacity={0.4}
          color="#3b82f6"
        />
        
        {/* Main Components */}
        <HomeSphere />
        <FloatingTechIcons />
        <DNAHelix />
        <AnimatedText />
        
        {/* Camera Controls */}
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.8}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </PresentationControls>
      </Canvas>
    </div>
  );
};

export default Home3DAnimation;
