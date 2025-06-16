import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Stats, OrbitControls } from '@react-three/drei';
import useUniverseStore from '../store/universeStore';
import SolarSystemScene from '../scenes/SolarSystemScene';
import TestScene from './TestScene';
import LoadingScreen from './LoadingScreen';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';

const UniverseCanvas = () => {
  const { performance, showControls, effects } = useUniverseStore();

  // Performance monitoring component
  const PerformanceMonitor = () => {
    usePerformanceMonitor();
    return null;
  };
  
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          position: [0, 2, 10],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: performance.quality === 'high',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        shadows={false}
        dpr={performance.quality === 'high' ? [1, 2] : 1}
        className="bg-black"
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight
          position={[0, 0, 0]}
          intensity={1.5}
          color="#FDB813"
        />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.3}
          color="#ffffff"
        />
        
        {/* Controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={200}
            autoRotate={effects.warpSpeed}
            autoRotateSpeed={effects.warpSpeed ? 2 : 0.5}
            dampingFactor={0.05}
            enableDamping={true}
          />
        )}


        
        {/* Performance Monitor */}
        <PerformanceMonitor />

        {/* Scene Content */}
        <Suspense fallback={null}>
          <SolarSystemScene />
        </Suspense>
        
        {/* Performance Stats */}
        {performance.quality === 'high' && <Stats />}
      </Canvas>
      
      {/* Loading Screen */}
      <Suspense fallback={<LoadingScreen />}>
        <div />
      </Suspense>
    </div>
  );
};

export default UniverseCanvas;
