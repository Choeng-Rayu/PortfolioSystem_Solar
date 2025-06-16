import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useUniverseStore from '../store/universeStore';

const Comet = ({ 
  name = 'Halley', 
  orbitRadius = 80, 
  speed = 0.005, 
  inclination = 15,
  eccentricity = 0.8 
}) => {
  const groupRef = useRef();
  const trailRef = useRef();
  const { effects, performance } = useUniverseStore();
  
  // Create comet trail
  const trail = useMemo(() => {
    const trailLength = 100;
    const positions = new Float32Array(trailLength * 3);
    const colors = new Float32Array(trailLength * 3);
    const sizes = new Float32Array(trailLength);
    
    for (let i = 0; i < trailLength; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      // Trail colors (blue to white)
      const alpha = i / trailLength;
      colors[i3] = 0.5 + alpha * 0.5;     // Red
      colors[i3 + 1] = 0.7 + alpha * 0.3; // Green
      colors[i3 + 2] = 1.0;               // Blue
      
      sizes[i] = (1 - alpha) * 3;
    }
    
    return { positions, colors, sizes, trailLength };
  }, []);
  
  const trailPositions = useRef([]);
  
  useFrame((state) => {
    if (!groupRef.current || !effects.showComets) return;
    
    const time = state.clock.elapsedTime * speed;
    
    // Elliptical orbit calculation
    const a = orbitRadius; // Semi-major axis
    const b = orbitRadius * Math.sqrt(1 - eccentricity * eccentricity); // Semi-minor axis
    
    const x = a * Math.cos(time);
    const z = b * Math.sin(time);
    const y = Math.sin(time + inclination) * 5; // Orbital inclination
    
    groupRef.current.position.set(x, y, z);
    
    // Update trail
    if (trailRef.current) {
      trailPositions.current.unshift([x, y, z]);
      if (trailPositions.current.length > trail.trailLength) {
        trailPositions.current.pop();
      }
      
      const positions = trailRef.current.geometry.attributes.position.array;
      const colors = trailRef.current.geometry.attributes.color.array;
      
      for (let i = 0; i < trailPositions.current.length; i++) {
        const i3 = i * 3;
        const pos = trailPositions.current[i];
        if (pos) {
          positions[i3] = pos[0];
          positions[i3 + 1] = pos[1];
          positions[i3 + 2] = pos[2];
          
          // Fade trail over distance
          const alpha = (trail.trailLength - i) / trail.trailLength;
          colors[i3] = 0.5 + alpha * 0.5;
          colors[i3 + 1] = 0.7 + alpha * 0.3;
          colors[i3 + 2] = 1.0;
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true;
      trailRef.current.geometry.attributes.color.needsUpdate = true;
    }
    
    // Rotate comet nucleus
    if (groupRef.current.children[0]) {
      groupRef.current.children[0].rotation.x += 0.01;
      groupRef.current.children[0].rotation.y += 0.02;
    }
  });
  
  if (!effects.showComets || performance.quality === 'low') return null;
  
  return (
    <group>
      {/* Comet nucleus */}
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#4A4A4A"
            roughness={0.9}
            metalness={0.1}
            emissive="#001122"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Coma (glowing atmosphere around nucleus) */}
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial 
            color="#87CEEB"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Outer coma */}
        <mesh>
          <sphereGeometry args={[3, 16, 16]} />
          <meshBasicMaterial 
            color="#ADD8E6"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Comet trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trail.trailLength}
            array={trail.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={trail.trailLength}
            array={trail.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={trail.trailLength}
            array={trail.sizes}
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
    </group>
  );
};

export default Comet;
