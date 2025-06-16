import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Universe...');
  
  useEffect(() => {
    const loadingSteps = [
      'Initializing Universe...',
      'Loading Solar System...',
      'Positioning Planets...',
      'Calculating Orbits...',
      'Rendering Stars...',
      'Creating Particle Systems...',
      'Generating Comets...',
      'Activating Solar Wind...',
      'Calibrating Nebulae...',
      'Finalizing Scene...'
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepIndex !== currentStep && stepIndex < loadingSteps.length) {
          currentStep = stepIndex;
          setLoadingText(loadingSteps[stepIndex]);
        }
        
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-space-blue/30"></div>
            <div className="absolute inset-2 rounded-full border-2 border-space-gold/50 animate-spin-slow"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-space-blue to-space-purple animate-pulse-slow"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold cosmic-text mb-4">
          3D Universe
        </h2>
        
        <p className="text-white/70 mb-6 text-lg">
          {loadingText}
        </p>
        
        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-space-blue to-space-gold transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/50 text-sm mt-2">
            {Math.round(progress)}%
          </p>
        </div>
        
        {/* Enhanced floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                backgroundColor: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#87CEEB' : '#FF6347',
                opacity: 0.3 + Math.random() * 0.4,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}

          {/* Shooting stars */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-20 bg-gradient-to-b from-white to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `shootingStar ${3 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes shootingStar {
            0% {
              opacity: 0;
              transform: translateY(-100px) rotate(45deg);
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateY(100vh) rotate(45deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingScreen;
