import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useUniverseStore from '../store/universeStore';

const ParticleSystem = ({ type = 'nebula', count = 1000, position = [0, 0, 0] }) => {
  const meshRef = useRef();
  const { performance, effects } = useUniverseStore();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      switch (type) {
        case 'nebula':
          // Create nebula cloud
          const radius = 50 + Math.random() * 100;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);
          
          // Nebula colors (purple, pink, blue)
          colors[i3] = 0.5 + Math.random() * 0.5;     // Red
          colors[i3 + 1] = 0.2 + Math.random() * 0.3; // Green
          colors[i3 + 2] = 0.8 + Math.random() * 0.2; // Blue
          
          sizes[i] = 2 + Math.random() * 8;
          break;
          
        case 'solarWind':
          // Solar wind particles emanating from sun
          const distance = 5 + Math.random() * 200;
          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * 20;
          
          positions[i3] = Math.cos(angle) * distance;
          positions[i3 + 1] = height;
          positions[i3 + 2] = Math.sin(angle) * distance;
          
          // Solar wind colors (yellow, orange)
          colors[i3] = 1.0;                           // Red
          colors[i3 + 1] = 0.8 + Math.random() * 0.2; // Green
          colors[i3 + 2] = 0.2 + Math.random() * 0.3; // Blue
          
          sizes[i] = 0.5 + Math.random() * 2;
          
          // Velocity away from sun
          velocities[i3] = Math.cos(angle) * 0.1;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
          velocities[i3 + 2] = Math.sin(angle) * 0.1;
          break;
          
        case 'cosmicDust':
          // Cosmic dust throughout space
          positions[i3] = (Math.random() - 0.5) * 500;
          positions[i3 + 1] = (Math.random() - 0.5) * 500;
          positions[i3 + 2] = (Math.random() - 0.5) * 500;
          
          // Dust colors (brown, gray)
          const dustColor = 0.3 + Math.random() * 0.4;
          colors[i3] = dustColor;
          colors[i3 + 1] = dustColor * 0.8;
          colors[i3 + 2] = dustColor * 0.6;
          
          sizes[i] = 0.2 + Math.random() * 1;
          break;
          
        default:
          // Default star field
          positions[i3] = (Math.random() - 0.5) * 1000;
          positions[i3 + 1] = (Math.random() - 0.5) * 1000;
          positions[i3 + 2] = (Math.random() - 0.5) * 1000;
          
          colors[i3] = Math.random();
          colors[i3 + 1] = Math.random();
          colors[i3 + 2] = Math.random();
          
          sizes[i] = Math.random() * 3;
      }
    }
    
    return { positions, colors, sizes, velocities };
  }, [count, type]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !effects.enableParticles) return;

    // Reduce update frequency for better performance
    if (state.clock.elapsedTime % 0.2 < delta) return;
    
    const positions = meshRef.current.geometry.attributes.position.array;
    const colors = meshRef.current.geometry.attributes.color.array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (type === 'solarWind') {
        // Move solar wind particles outward
        positions[i3] += particles.velocities[i3] * delta * 60;
        positions[i3 + 1] += particles.velocities[i3 + 1] * delta * 60;
        positions[i3 + 2] += particles.velocities[i3 + 2] * delta * 60;
        
        // Reset particles that are too far
        const distance = Math.sqrt(
          positions[i3] ** 2 + 
          positions[i3 + 1] ** 2 + 
          positions[i3 + 2] ** 2
        );
        
        if (distance > 200) {
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = Math.cos(angle) * 5;
          positions[i3 + 1] = (Math.random() - 0.5) * 2;
          positions[i3 + 2] = Math.sin(angle) * 5;
        }
      } else if (type === 'nebula') {
        // Slowly rotate nebula
        const x = positions[i3];
        const z = positions[i3 + 2];
        const angle = Math.atan2(z, x) + delta * 0.1;
        const radius = Math.sqrt(x * x + z * z);
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 2] = Math.sin(angle) * radius;
        
        // Pulsing colors
        const pulse = Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.2 + 0.8;
        colors[i3] *= pulse;
        colors[i3 + 1] *= pulse;
        colors[i3 + 2] *= pulse;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  if (!effects.enableParticles && performance.quality === 'low') return null;
  
  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
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
  );
};

export default ParticleSystem;
