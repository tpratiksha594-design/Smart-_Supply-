import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshWobbleMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const FloatingWarehouse = () => {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Central Futuristic Warehouse Hub */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.4, 2.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.8} wireframe={false} />
      </mesh>
      
      {/* Glass Roof Accent */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2.0, 0.2, 2.0]} />
        <meshStandardMaterial color="#6366F1" transparent opacity={0.7} roughness={0.1} />
      </mesh>

      {/* Cyan Pulse Core */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <MeshWobbleMaterial factor={0.2} speed={1.5} color="#06B6D4" transparent opacity={0.6} />
      </mesh>

      {/* Orbiting Product Boxes */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[2.2, 1.0, 0.5]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#6366F1" roughness={0.3} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-2.0, -0.8, 1.0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#06B6D4" roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={1} floatIntensity={2.5}>
        <mesh position={[1.5, -1.2, -1.5]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color="#10B981" roughness={0.4} />
        </mesh>
      </Float>

      {/* Connected Nodes Lines Ring */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.85, 32]} />
        <meshBasicMaterial color="#6366F1" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>

      {/* Orbital Node Orbs */}
      <mesh position={[2.8, -0.9, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#06B6D4" />
      </mesh>
      <mesh position={[-2.8, -0.9, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <mesh position={[0, -0.9, 2.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#6366F1" />
      </mesh>
      <mesh position={[0, -0.9, -2.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
    </group>
  );
};

export const Hero3DCanvas: React.FC = () => {
  return (
    <div className="w-full h-[480px] lg:h-[550px] relative rounded-2xl overflow-hidden glass-panel border border-slate-200/50 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-500/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Interactive 3D Logistics Canvas (Rotate with Mouse)
      </div>

      <Canvas camera={{ position: [0, 2, 6.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#06B6D4" />
        <spotLight position={[0, 10, 0]} intensity={1.5} color="#6366F1" penumbra={1} />
        
        <FloatingWarehouse />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 4} />
      </Canvas>

      {/* Floating Overlay Analytics Cards */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-lg flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-lg">
          98.6%
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Logistics Speed</div>
          <div className="text-xs font-semibold text-slate-800">Automated Dispatch Active</div>
        </div>
      </div>
    </div>
  );
};
