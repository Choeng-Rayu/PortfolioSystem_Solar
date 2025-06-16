import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useUniverseStore from '../store/universeStore';

const Wormhole = ({ position = [100, 0, 0], radius = 5 }) => {
  const meshRef = useRef();
  const particlesRef = useRef();
  const { effects, performance } = useUniverseStore();
  
  // Create wormhole geometry
  const wormholeGeometry = useMemo(() => {
    const geometry = new THREE.TorusGeometry(radius, radius * 0.3, 16, 100);
    return geometry;
  }, [radius]);
  
  // Create particle tunnel effect
  const particles = useMemo(() => {
    const count = performance.quality === 'high' ? 2000 : 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create spiral tunnel
      const t = (i / count) * Math.PI * 4;
      const spiralRadius = radius * (1 - (i / count) * 0.8);
      const z = (i / count) * 20 - 10;
      
      positions[i3] = Math.cos(t) * spiralRadius;
      positions[i3 + 1] = Math.sin(t) * spiralRadius;
      positions[i3 + 2] = z;
      
      // Color gradient from blue to purple to white
      const colorT = i / count;
      colors[i3] = 0.5 + colorT * 0.5;     // Red
      colors[i3 + 1] = 0.2 + colorT * 0.3; // Green
      colors[i3 + 2] = 1.0;                // Blue
      
      sizes[i] = 1 + Math.random() * 3;
    }
    
    return { positions, colors, sizes, count };
  }, [radius, performance.quality]);
  
  useFrame((state) => {
    if (!meshRef.current || !effects.warpSpeed) return;
    
    // Rotate wormhole
    meshRef.current.rotation.z += 0.02;
    meshRef.current.rotation.x += 0.01;
    
    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particles.count; i++) {
        const i3 = i * 3;
        
        // Move particles through tunnel
        positions[i3 + 2] += 0.2;
        
        // Reset particles that exit the tunnel
        if (positions[i3 + 2] > 10) {
          const t = (i / particles.count) * Math.PI * 4;
          const spiralRadius = radius * (1 - (i / particles.count) * 0.8);
          
          positions[i3] = Math.cos(t) * spiralRadius;
          positions[i3 + 1] = Math.sin(t) * spiralRadius;
          positions[i3 + 2] = -10;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Pulsing effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });
  
  if (!effects.warpSpeed) return null;
  
  return (
    <group position={position}>
      {/* Main wormhole ring */}
      <mesh ref={meshRef} geometry={wormholeGeometry}>
        <meshBasicMaterial 
          color="#4B0082"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh geometry={wormholeGeometry}>
        <meshBasicMaterial 
          color="#8A2BE2"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer energy field */}
      <mesh>
        <torusGeometry args={[radius * 1.5, radius * 0.2, 16, 100]} />
        <meshBasicMaterial 
          color="#FF00FF"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Particle tunnel */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.count}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.count}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Energy bolts */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 1.2;
        const y = Math.sin(angle) * radius * 1.2;
        
        return (
          <mesh key={i} position={[x, y, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshBasicMaterial 
              color="#00FFFF"
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Wormhole;
