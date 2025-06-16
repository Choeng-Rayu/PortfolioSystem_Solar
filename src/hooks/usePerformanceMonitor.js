import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useUniverseStore from '../store/universeStore';

const usePerformanceMonitor = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef([]);
  const { performance: perfSettings, setPerformance } = useUniverseStore();
  
  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    // Calculate FPS every second
    if (currentTime - lastTime.current >= 1000) {
      const fps = frameCount.current;
      fpsHistory.current.push(fps);
      
      // Keep only last 5 seconds of FPS data
      if (fpsHistory.current.length > 5) {
        fpsHistory.current.shift();
      }
      
      // Calculate average FPS
      const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
      
      // Auto-adjust quality based on performance
      if (fpsHistory.current.length >= 3) {
        if (avgFPS < 30 && perfSettings.quality !== 'low') {
          console.log('Performance: Switching to low quality (FPS:', avgFPS, ')');
          setPerformance({
            quality: 'low',
            maxParticles: 100,
            enableBloom: false,
            enableParticles: false
          });
        } else if (avgFPS < 45 && perfSettings.quality === 'high') {
          console.log('Performance: Switching to medium quality (FPS:', avgFPS, ')');
          setPerformance({
            quality: 'medium',
            maxParticles: 300,
            enableBloom: false,
            enableParticles: true
          });
        } else if (avgFPS > 55 && perfSettings.quality === 'low') {
          console.log('Performance: Switching to medium quality (FPS:', avgFPS, ')');
          setPerformance({
            quality: 'medium',
            maxParticles: 300,
            enableBloom: false,
            enableParticles: true
          });
        }
      }
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });
  
  return null;
};

export default usePerformanceMonitor;
