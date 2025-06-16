import { useEffect, useRef } from 'react';
import useUniverseStore from '../store/universeStore';

const SoundSystem = () => {
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef({});
  const { performance, effects, selectedObject } = useUniverseStore();
  
  useEffect(() => {
    if (!performance.enableSoundEffects) return;
    
    // Initialize Web Audio API
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
      return;
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [performance.enableSoundEffects]);
  
  // Ambient space sound
  useEffect(() => {
    if (!audioContextRef.current || !performance.enableSoundEffects) return;
    
    const createAmbientSound = () => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(40, audioContextRef.current.currentTime);
      
      gainNode.gain.setValueAtTime(0.02, audioContextRef.current.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      
      // Slowly modulate frequency for ambient effect
      const modulate = () => {
        if (oscillator.frequency) {
          oscillator.frequency.setValueAtTime(
            40 + Math.sin(Date.now() * 0.001) * 10,
            audioContextRef.current.currentTime
          );
        }
      };
      
      const interval = setInterval(modulate, 100);
      
      return () => {
        clearInterval(interval);
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator already stopped
        }
      };
    };
    
    const cleanup = createAmbientSound();
    
    return cleanup;
  }, [performance.enableSoundEffects]);
  
  // Planet selection sound
  useEffect(() => {
    if (!audioContextRef.current || !selectedObject || !performance.enableSoundEffects) return;
    
    const playSelectionSound = () => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      // Different frequencies for different objects
      let frequency = 440;
      switch (selectedObject.name) {
        case 'Sun': frequency = 220; break;
        case 'Mercury': frequency = 330; break;
        case 'Venus': frequency = 370; break;
        case 'Earth': frequency = 440; break;
        case 'Mars': frequency = 494; break;
        case 'Jupiter': frequency = 262; break;
        case 'Saturn': frequency = 294; break;
        case 'Uranus': frequency = 523; break;
        case 'Neptune': frequency = 587; break;
        default: frequency = 440;
      }
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    };
    
    playSelectionSound();
  }, [selectedObject, performance.enableSoundEffects]);
  
  // Warp speed sound effect
  useEffect(() => {
    if (!audioContextRef.current || !performance.enableSoundEffects) return;
    
    if (effects.warpSpeed) {
      const createWarpSound = () => {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        const filter = audioContextRef.current.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioContextRef.current.currentTime + 2);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, audioContextRef.current.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, audioContextRef.current.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 2);
        
        return oscillator;
      };
      
      const warpOscillator = createWarpSound();
      oscillatorsRef.current.warp = warpOscillator;
      
      return () => {
        try {
          if (oscillatorsRef.current.warp) {
            oscillatorsRef.current.warp.stop();
          }
        } catch (e) {
          // Already stopped
        }
      };
    }
  }, [effects.warpSpeed, performance.enableSoundEffects]);
  
  return null; // This component doesn't render anything
};

export default SoundSystem;
