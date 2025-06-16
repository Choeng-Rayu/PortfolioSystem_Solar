import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import useUniverseStore from '../store/universeStore';

const Planet = ({ name, position, radius, orbitRadius, rotationSpeed, orbitSpeed, hasRings, moons, hasStorms, tilt }) => {
  const meshRef = useRef();
  const ringsRef = useRef();
  const { setSelectedObject, setHoveredObject, hoveredObject, effects } = useUniverseStore();
  
  // Planet colors and data
  const planetData = {
    Mercury: { 
      color: '#8C7853', 
      data: { 
        diameter: '4,879 km', 
        mass: '3.3011 × 10²³ kg',
        distance: '57.9 million km from Sun',
        day: '58.6 Earth days',
        year: '88 Earth days'
      }
    },
    Venus: { 
      color: '#FFC649', 
      data: { 
        diameter: '12,104 km', 
        mass: '4.8675 × 10²⁴ kg',
        distance: '108.2 million km from Sun',
        day: '243 Earth days',
        year: '225 Earth days'
      }
    },
    Earth: { 
      color: '#6B93D6', 
      data: { 
        diameter: '12,756 km', 
        mass: '5.972 × 10²⁴ kg',
        distance: '149.6 million km from Sun',
        day: '24 hours',
        year: '365.25 days'
      }
    },
    Mars: {
      color: '#CD5C5C',
      data: {
        diameter: '6,792 km',
        mass: '6.4171 × 10²³ kg',
        distance: '227.9 million km from Sun',
        day: '24.6 hours',
        year: '687 Earth days'
      }
    },
    Jupiter: {
      color: '#D8CA9D',
      data: {
        diameter: '142,984 km',
        mass: '1.898 × 10²⁷ kg',
        distance: '778.5 million km from Sun',
        day: '9.9 hours',
        year: '11.9 Earth years',
        moons: '79 known moons',
        features: 'Great Red Spot storm'
      }
    },
    Saturn: {
      color: '#FAD5A5',
      data: {
        diameter: '120,536 km',
        mass: '5.683 × 10²⁶ kg',
        distance: '1.432 billion km from Sun',
        day: '10.7 hours',
        year: '29.5 Earth years',
        moons: '82 known moons',
        features: 'Spectacular ring system'
      }
    },
    Uranus: {
      color: '#4FD0E7',
      data: {
        diameter: '51,118 km',
        mass: '8.681 × 10²⁵ kg',
        distance: '2.867 billion km from Sun',
        day: '17.2 hours',
        year: '84 Earth years',
        features: 'Tilted 98° on its side'
      }
    },
    Neptune: {
      color: '#4B70DD',
      data: {
        diameter: '49,528 km',
        mass: '1.024 × 10²⁶ kg',
        distance: '4.515 billion km from Sun',
        day: '16.1 hours',
        year: '165 Earth years',
        features: 'Fastest winds in solar system'
      }
    }
  };
  
  const planetInfo = planetData[name] || { color: '#888888', data: {} };
  const isHovered = hoveredObject?.name === name;
  
  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Apply tilt for Uranus
      if (tilt && name === 'Uranus') {
        meshRef.current.rotation.z = (tilt * Math.PI) / 180;
      }
      meshRef.current.rotation.y += rotationSpeed;
    }

    // Animate rings for Saturn
    if (ringsRef.current && hasRings) {
      ringsRef.current.rotation.z += rotationSpeed * 0.5;
    }
  });
  
  const handleClick = (event) => {
    event.stopPropagation();
    setSelectedObject({
      type: 'planet',
      name,
      data: planetInfo.data
    });
  };
  
  const handlePointerOver = (event) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHoveredObject({ type: 'planet', name });
  };
  
  const handlePointerOut = (event) => {
    event.stopPropagation();
    document.body.style.cursor = 'default';
    setHoveredObject(null);
  };
  
  return (
    <group position={position}>
      {/* Planet Sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={isHovered ? 1.1 : 1}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial
          color={planetInfo.color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Atmosphere for Earth */}
      {name === 'Earth' && (
        <mesh>
          <sphereGeometry args={[radius * 1.05, 16, 16]} />
          <meshBasicMaterial
            color="#87CEEB"
            transparent
            opacity={0.2}
            side={2}
          />
        </mesh>
      )}

      {/* Rings for Saturn and Uranus */}
      {hasRings && (
        <mesh ref={ringsRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.5, 64]} />
          <meshBasicMaterial
            color={name === 'Saturn' ? '#FAD5A5' : '#4FD0E7'}
            transparent
            opacity={0.6}
            side={2}
          />
        </mesh>
      )}

      {/* Great Red Spot for Jupiter */}
      {name === 'Jupiter' && (
        <mesh position={[radius * 0.8, 0, 0]}>
          <sphereGeometry args={[radius * 0.3, 16, 16]} />
          <meshBasicMaterial
            color="#8B0000"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Storm effects for Neptune */}
      {hasStorms && name === 'Neptune' && (
        <>
          <mesh position={[radius * 0.6, radius * 0.3, 0]}>
            <sphereGeometry args={[radius * 0.2, 12, 12]} />
            <meshBasicMaterial
              color="#87CEEB"
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[-radius * 0.5, -radius * 0.4, 0]}>
            <sphereGeometry args={[radius * 0.15, 12, 12]} />
            <meshBasicMaterial
              color="#ADD8E6"
              transparent
              opacity={0.6}
            />
          </mesh>
        </>
      )}
      
      {/* Hover glow effect */}
      {isHovered && (
        <mesh>
          <sphereGeometry args={[radius * 1.3, 32, 32]} />
          <meshBasicMaterial 
            color={planetInfo.color}
            transparent
            opacity={0.3}
            side={2}
          />
        </mesh>
      )}
      
      {/* Planet label (always facing camera) */}
      {isHovered && (
        <group position={[0, radius + 0.5, 0]}>
          {/* This would be a text component in a real implementation */}
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default Planet;
