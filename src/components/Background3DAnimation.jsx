// components/Background3DAnimation.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Environment, 
  Sparkles,
  Text3D
} from '@react-three/drei';
import * as THREE from 'three';

// Dynamic Wave Effect
const WaveEffect = () => {
  const meshRef = useRef();
  const geometryRef = useRef();

  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const time = state.clock.elapsedTime;
      const positions = geometryRef.current.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 2 + time) * 0.3 + Math.sin(z * 2 + time * 0.5) * 0.2;
      }
      
      geometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry ref={geometryRef} args={[20, 20, 50, 50]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
};

// Floating Data Stream
const DataStream = () => {
  const groupRef = useRef();
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 200; i++) {
      pts.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01
        ),
        size: Math.random() * 0.1 + 0.05
      });
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      particles.forEach((particle, index) => {
        particle.position.add(particle.velocity);
        
        // Wrap around boundaries
        if (particle.position.x > 10) particle.position.x = -10;
        if (particle.position.x < -10) particle.position.x = 10;
        if (particle.position.y > 10) particle.position.y = -10;
        if (particle.position.y < -10) particle.position.y = 10;
        if (particle.position.z > 10) particle.position.z = -10;
        if (particle.position.z < -10) particle.position.z = 10;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? "#3b82f6" : index % 3 === 1 ? "#8b5cf6" : "#10b981"}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// Animated Grid
const AnimatedGrid = () => {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.001;
      gridRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <gridHelper args={[20, 20, "#3b82f6", "#8b5cf6"]} />
    </mesh>
  );
};

// Floating Geometric Network
const GeometricNetwork = () => {
  const groupRef = useRef();
  const nodes = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 15; i++) {
      pts.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ),
        connections: []
      });
    }
    
    // Create connections
    pts.forEach((node, i) => {
      pts.forEach((otherNode, j) => {
        if (i !== j && node.position.distanceTo(otherNode.position) < 5) {
          node.connections.push(j);
        }
      });
    });
    
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, index) => (
        <Float key={index} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={node.position}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Connections */}
      {nodes.map((node, i) =>
        node.connections.map((j) => {
          if (i < j) { // Avoid duplicate lines
            const start = node.position;
            const end = nodes[j].position;
            const mid = start.clone().lerp(end, 0.5);
            const distance = start.distanceTo(end);
            
            return (
              <mesh key={`${i}-${j}`} position={mid}>
                <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
                <meshStandardMaterial
                  color="#3b82f6"
                  transparent
                  opacity={0.3}
                />
              </mesh>
            );
          }
          return null;
        })
      )}
    </group>
  );
};

// Main Background Animation Component
const Background3DAnimation = ({ 
  intensity = "medium",
  className = "fixed inset-0 -z-10 pointer-events-none"
}) => {
  const getOpacity = () => {
    switch (intensity) {
      case "low": return "opacity-20";
      case "high": return "opacity-60";
      default: return "opacity-40";
    }
  };

  return (
    <div className={`${className} ${getOpacity()}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#3b82f6" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.6}
          color="#3b82f6"
        />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* Background Stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        
        {/* Sparkles */}
        <Sparkles
          count={200}
          scale={25}
          size={3}
          speed={0.3}
          opacity={0.3}
          color="#3b82f6"
        />
        
        {/* Main Components */}
        <WaveEffect />
        <DataStream />
        <AnimatedGrid />
        <GeometricNetwork />
        
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default Background3DAnimation; 