import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import useUniverseStore from '../store/universeStore';
import Planet from '../components/Planet';
import Sun from '../components/Sun';
import ParticleSystem from '../components/ParticleSystem';
import Comet from '../components/Comet';
import Wormhole from '../components/Wormhole';

const SolarSystemScene = () => {
  const groupRef = useRef();
  const { universeData, updatePlanetPositions, effects, performance } = useUniverseStore();
  
  // Animation loop - Optimized
  useFrame((state, delta) => {
    // Reduce update frequency for better performance
    if (state.clock.elapsedTime % 0.1 < delta) {
      updatePlanetPositions(delta);
    }

    // Rotate the entire solar system slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.005; // Slower rotation
    }
  });
  
  const solarSystem = universeData.solarSystem;
  
  return (
    <group ref={groupRef}>
      {/* Background Stars - Optimized */}
      <Stars
        radius={300}
        depth={50}
        count={performance.quality === 'high' ? 3000 : performance.quality === 'medium' ? 1500 : 800}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Sun */}
      <Sun 
        position={solarSystem.sun.position}
        radius={solarSystem.sun.radius}
        temperature={solarSystem.sun.temperature}
      />
      
      {/* Planets */}
      {solarSystem.planets.map((planet, index) => (
        <Planet
          key={planet.name}
          name={planet.name}
          position={planet.position}
          radius={planet.radius}
          orbitRadius={planet.orbitRadius}
          rotationSpeed={planet.rotationSpeed}
          orbitSpeed={planet.orbitSpeed}
          hasRings={planet.hasRings}
          moons={planet.moons}
          hasStorms={planet.hasStorms}
          tilt={planet.tilt}
        />
      ))}
      
      {/* Orbital paths */}
      {solarSystem.planets.map((planet, index) => (
        <mesh key={`orbit-${planet.name}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            side={2}
          />
        </mesh>
      ))}
      
      {/* Asteroid Belt (between Mars and Jupiter) - Optimized */}
      <group>
        {[...Array(performance.quality === 'high' ? 100 : performance.quality === 'medium' ? 50 : 25)].map((_, i) => {
          const totalAsteroids = performance.quality === 'high' ? 100 : performance.quality === 'medium' ? 50 : 25;
          const angle = (i / totalAsteroids) * Math.PI * 2;
          const radius = 20 + Math.random() * 5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 2;

          return (
            <mesh key={`asteroid-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.02 + Math.random() * 0.05, 6, 4]} />
              <meshBasicMaterial
                color="#8B4513"
              />
            </mesh>
          );
        })}
      </group>

      {/* Particle Systems - Performance Optimized */}
      {effects.showNebula && performance.quality === 'high' && (
        <ParticleSystem
          type="nebula"
          count={200}
          position={[0, 0, -200]}
        />
      )}

      {effects.showSolarWind && performance.quality === 'high' && (
        <ParticleSystem
          type="solarWind"
          count={100}
          position={[0, 0, 0]}
        />
      )}

      {/* Comets */}
      {effects.showComets && performance.quality === 'high' && (
        <Comet
          name="Halley"
          orbitRadius={80}
          speed={0.005}
          inclination={15}
          eccentricity={0.8}
        />
      )}

      {/* Wormhole */}
      {effects.warpSpeed && (
        <Wormhole position={[80, 20, 0]} radius={6} />
      )}
    </group>
  );
};

export default SolarSystemScene;
