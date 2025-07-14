// components/Button3DAnimation.jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Environment, 
  Sparkles,
  Text3D
} from '@react-three/drei';
import * as THREE from 'three';

// Interactive 3D Button
const Button3D = ({ 
  text = "Click Me", 
  color = "#3b82f6", 
  isHovered, 
  isPressed,
  onClick,
  ...props 
}) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const textRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation animation
      meshRef.current.rotation.y += 0.01;
      
      // Scale animation based on hover and press state
      let targetScale = 1;
      if (isPressed) targetScale = 0.95;
      else if (isHovered) targetScale = 1.1;
      
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.015;
      glowRef.current.rotation.x += 0.008;
      
      // Glow intensity based on hover state
      const targetOpacity = isHovered ? 0.3 : 0.1;
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        targetOpacity,
        0.1
      );
    }
    
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group {...props}>
      {/* Glow effect */}
      <mesh ref={glowRef} scale={[2.5, 2.5, 2.5]}>
        <boxGeometry args={[1.5, 0.8, 0.3]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main button */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[1.5, 0.8, 0.3]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>
      
      {/* Button text */}
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.15}
        height={0.05}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
        position={[0, 0, 0.2]}
      >
        {text}
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </Text3D>
    </group>
  );
};

// Floating Particles around Button
const ButtonParticles = ({ isHovered }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.children.forEach((child, index) => {
        const time = state.clock.elapsedTime;
        child.position.y += Math.sin(time + index) * 0.002;
        child.position.x += Math.cos(time * 0.5 + index) * 0.001;
        child.rotation.z += 0.02;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(6)].map((_, index) => (
        <Float key={index} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[
            Math.cos(index * Math.PI / 3) * 3,
            Math.sin(index * Math.PI / 3) * 3,
            0
          ]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
              transparent
              opacity={isHovered ? 0.8 : 0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Animated Ring around Button
const ButtonRing = ({ isHovered }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      ringRef.current.rotation.y += 0.01;
      
      // Scale animation on hover
      const targetScale = isHovered ? 1.2 : 1;
      ringRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, 0]}>
      <torusGeometry args={[2.5, 0.05, 16, 100]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={isHovered ? 0.6 : 0.3}
        wireframe
      />
    </mesh>
  );
};

// Main 3D Button Animation Component
const Button3DAnimation = ({ 
  text = "Click Me",
  color = "#3b82f6",
  onClick,
  className = "w-64 h-32",
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <div 
      className={`relative ${className} cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color={color} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          color={color}
        />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Sparkles */}
        <Sparkles
          count={30}
          scale={8}
          size={2}
          speed={0.3}
          opacity={isHovered ? 0.6 : 0.3}
          color={color}
        />
        
        {/* Main Components */}
        <Button3D
          text={text}
          color={color}
          isHovered={isHovered}
          isPressed={isPressed}
          onClick={handleClick}
          position={[0, 0, 0]}
        />
        <ButtonParticles isHovered={isHovered} />
        <ButtonRing isHovered={isHovered} />
        
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isHovered}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Overlay for better interaction */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm font-medium">Disabled</span>
        </div>
      )}
    </div>
  );
};

export default Button3DAnimation; 