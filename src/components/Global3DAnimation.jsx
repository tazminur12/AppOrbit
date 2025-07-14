// components/Global3DAnimation.jsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text3D, Float, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Animated Floating Particles
const FloatingParticles = ({ count = 100 }) => {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
      mesh.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4ADE80"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Animated Sphere with Glow Effect
const AnimatedSphere = () => {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.015;
      glowRef.current.rotation.x += 0.008;
    }
  });

  return (
    <group>
      {/* Glow effect */}
      <mesh ref={glowRef} scale={[2.2, 2.2, 2.2]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#4ADE80"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#4ADE80"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Floating Geometric Shapes
const FloatingShapes = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.001;
        child.rotation.x += 0.01;
        child.rotation.z += 0.005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cube */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[3, 2, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#3B82F6"
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      </Float>

      {/* Torus */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[-3, -1, 2]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#8B5CF6"
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      </Float>

      {/* Octahedron */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[2, -2, -1]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
};

const Global3DAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ADE80" />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* Background Stars */}
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        
        {/* Sparkles for extra effect */}
        <Sparkles
          count={100}
          scale={20}
          size={2}
          speed={0.3}
          opacity={0.3}
          color="#4ADE80"
        />
        
        {/* Main Components */}
        <AnimatedSphere />
        <FloatingShapes />
        <FloatingParticles count={150} />
        
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
    </div>
  );
};

export default Global3DAnimation;
