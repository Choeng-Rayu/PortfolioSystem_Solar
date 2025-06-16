import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import useUniverseStore from '../store/universeStore';

const Sun = ({ position, radius, temperature }) => {
  const meshRef = useRef();
  const coronaRef = useRef();
  const flareRefs = useRef([]);
  const { setSelectedObject, setHoveredObject, effects } = useUniverseStore();
  
  // Create sun material with glow effect
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(0.1, 1, 0.5),
    transparent: true,
    opacity: 0.9
  });
  
  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;

      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }

    // Animate corona
    if (coronaRef.current) {
      coronaRef.current.rotation.y += 0.002;
      coronaRef.current.rotation.z += 0.001;

      // Pulsing corona
      const coronaScale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      coronaRef.current.scale.setScalar(coronaScale);
    }

    // Animate solar flares
    flareRefs.current.forEach((flare, index) => {
      if (flare) {
        const time = state.clock.elapsedTime + index * 2;
        const intensity = Math.sin(time * 3) * 0.5 + 0.5;
        flare.material.opacity = intensity * 0.8;
        flare.scale.setScalar(1 + intensity * 0.5);
      }
    });
  });
  
  const handleClick = (event) => {
    event.stopPropagation();
    setSelectedObject({
      type: 'star',
      name: 'Sun',
      data: {
        radius: radius * 696340, // Convert to km
        temperature,
        mass: '1.989 × 10³⁰ kg',
        composition: 'Hydrogen (73%), Helium (25%), Other (2%)',
        age: '4.6 billion years'
      }
    });
  };
  
  const handlePointerOver = (event) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHoveredObject({ type: 'star', name: 'Sun' });
  };
  
  const handlePointerOut = (event) => {
    event.stopPropagation();
    document.body.style.cursor = 'default';
    setHoveredObject(null);
  };
  
  return (
    <group position={position}>
      {/* Main Sun Sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color="#FDB813"
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Enhanced Corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.3, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Corona */}
      <mesh>
        <sphereGeometry args={[radius * 1.8, 32, 32]} />
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Extreme Outer Glow */}
      <mesh>
        <sphereGeometry args={[radius * 2.5, 32, 32]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Solar Flares - Optimized */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const distance = radius * (1.5 + Math.sin(i) * 0.3);
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = Math.sin(i * 2) * radius * 0.5;

        return (
          <mesh
            key={i}
            position={[x, y, z]}
            ref={(el) => (flareRefs.current[i] = el)}
          >
            <sphereGeometry args={[0.15 + Math.sin(i) * 0.1, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#FF4500" : i % 3 === 1 ? "#FF6347" : "#FFD700"}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Magnetic Field Lines - Simplified */}
      {effects.showSolarWind && performance.quality === 'high' && [...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const distance = radius * 2;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        return (
          <mesh key={`field-${i}`} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <cylinderGeometry args={[0.02, 0.02, distance, 6]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Sun;
