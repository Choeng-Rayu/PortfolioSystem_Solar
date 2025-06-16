import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useUniverseStore from '../store/universeStore';

const useCameraControls = () => {
  const { camera, gl } = useThree();
  const { camera: cameraState, setCamera } = useUniverseStore();
  const controlsRef = useRef();
  
  // Initialize camera position
  useEffect(() => {
    if (camera && cameraState.position) {
      camera.position.set(...cameraState.position);
      camera.lookAt(...cameraState.target);
    }
  }, [camera, cameraState]);
  
  // Camera animation functions
  const flyToObject = (targetPosition, duration = 2000) => {
    const startPosition = camera.position.clone();
    const endPosition = targetPosition.clone();
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = easeInOut(progress);
      
      camera.position.lerpVectors(startPosition, endPosition, easedProgress);
      camera.lookAt(...cameraState.target);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCamera({ position: endPosition.toArray() });
      }
    };
    
    animate();
  };
  
  const focusOnPlanet = (planetName) => {
    const planet = useUniverseStore.getState().getPlanet(planetName);
    if (planet) {
      const targetPosition = [
        planet.position[0] + 5,
        planet.position[1] + 3,
        planet.position[2] + 5
      ];
      flyToObject(new THREE.Vector3(...targetPosition));
      setCamera({ target: planet.position });
    }
  };
  
  const resetCamera = () => {
    flyToObject(new THREE.Vector3(0, 5, 20));
    setCamera({ target: [0, 0, 0] });
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case '1':
          focusOnPlanet('Mercury');
          break;
        case '2':
          focusOnPlanet('Venus');
          break;
        case '3':
          focusOnPlanet('Earth');
          break;
        case '4':
          focusOnPlanet('Mars');
          break;
        case '0':
          resetCamera();
          break;
        case 'h':
          useUniverseStore.getState().toggleHUD();
          break;
        case 'i':
          useUniverseStore.getState().toggleInfo();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Update store when camera moves
  useFrame(() => {
    if (camera) {
      const currentPosition = camera.position.toArray();
      const storePosition = cameraState.position;
      
      // Only update if position changed significantly
      const threshold = 0.1;
      const hasChanged = currentPosition.some((pos, index) => 
        Math.abs(pos - storePosition[index]) > threshold
      );
      
      if (hasChanged) {
        setCamera({ position: currentPosition });
      }
    }
  });
  
  return {
    flyToObject,
    focusOnPlanet,
    resetCamera,
    controlsRef
  };
};

export default useCameraControls;
