// components/Product3DAnimation.jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Environment, 
  Sparkles,
  Text3D,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';

// Interactive Product Cube
const ProductCube = ({ color = "#3b82f6", hovered, ...props }) => {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      
      // Scale animation on hover
      const targetScale = isHovered || hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group {...props}>
      {/* Glow effect */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main cube */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Floating Product Spheres
const ProductSpheres = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.002;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[2, 1, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#10b981"
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-2, -1, 1]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[1, -1.5, -1]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
};

// Animated Product Ring
const ProductRing = () => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      ringRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, 0]}>
      <torusGeometry args={[1.5, 0.1, 16, 100]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
};

// Interactive Product Animation
const Product3DAnimation = ({ 
  isHovered = false, 
  productType = "default",
  className = "w-full h-64"
}) => {
  const getProductColor = () => {
    switch (productType) {
      case "tech": return "#3b82f6";
      case "design": return "#8b5cf6";
      case "business": return "#10b981";
      case "creative": return "#f59e0b";
      default: return "#3b82f6";
    }
  };

  return (
    <div className={`relative ${className} rounded-lg overflow-hidden`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color={getProductColor()} />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Sparkles */}
        <Sparkles
          count={50}
          scale={8}
          size={2}
          speed={0.3}
          opacity={0.4}
          color={getProductColor()}
        />
        
        {/* Main Components */}
        <ProductCube 
          color={getProductColor()} 
          hovered={isHovered}
          position={[0, 0, 0]}
        />
        <ProductSpheres />
        <ProductRing />
        
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isHovered}
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

export default Product3DAnimation; 