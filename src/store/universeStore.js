import { create } from 'zustand';

const useUniverseStore = create((set, get) => ({
  // Camera state
  camera: {
    position: [0, 0, 10],
    target: [0, 0, 0],
    mode: 'orbit', // 'orbit' | 'free'
  },
  
  // Selected objects
  selectedObject: null,
  hoveredObject: null,
  
  // UI state
  showHUD: true,
  showInfo: false,
  showControls: true,
  
  // Performance settings - Optimized for smooth performance
  performance: {
    quality: 'medium', // Start with medium for better performance
    enableLOD: true,
    maxParticles: 500, // Reduced for better performance
    enableBloom: false,
    enableParticles: true,
    enableSoundEffects: false, // Disabled by default for performance
  },

  // Visual effects
  effects: {
    showNebula: false, // Start with simpler effects
    showComets: false,
    showSolarWind: false,
    showLensFlare: true,
    cameraShake: false,
    warpSpeed: false,
    enableParticles: true,
  },
  
  // Universe data
  currentScene: 'solar-system',
  universeData: {
    solarSystem: {
      sun: { position: [0, 0, 0], radius: 2, temperature: 5778 },
      planets: [
        { 
          name: 'Mercury', 
          position: [5, 0, 0], 
          radius: 0.2, 
          orbitRadius: 5,
          rotationSpeed: 0.01,
          orbitSpeed: 0.02 
        },
        { 
          name: 'Venus', 
          position: [7, 0, 0], 
          radius: 0.3, 
          orbitRadius: 7,
          rotationSpeed: 0.008,
          orbitSpeed: 0.015 
        },
        { 
          name: 'Earth', 
          position: [10, 0, 0], 
          radius: 0.4, 
          orbitRadius: 10,
          rotationSpeed: 0.01,
          orbitSpeed: 0.01 
        },
        {
          name: 'Mars',
          position: [15, 0, 0],
          radius: 0.25,
          orbitRadius: 15,
          rotationSpeed: 0.01,
          orbitSpeed: 0.008
        },
        {
          name: 'Jupiter',
          position: [25, 0, 0],
          radius: 1.2,
          orbitRadius: 25,
          rotationSpeed: 0.02,
          orbitSpeed: 0.005,
          hasRings: false,
          moons: ['Io', 'Europa', 'Ganymede', 'Callisto']
        },
        {
          name: 'Saturn',
          position: [35, 0, 0],
          radius: 1.0,
          orbitRadius: 35,
          rotationSpeed: 0.018,
          orbitSpeed: 0.003,
          hasRings: true,
          moons: ['Titan', 'Enceladus']
        },
        {
          name: 'Uranus',
          position: [45, 0, 0],
          radius: 0.6,
          orbitRadius: 45,
          rotationSpeed: 0.015,
          orbitSpeed: 0.002,
          hasRings: true,
          tilt: 98 // Uranus is tilted on its side
        },
        {
          name: 'Neptune',
          position: [55, 0, 0],
          radius: 0.58,
          orbitRadius: 55,
          rotationSpeed: 0.016,
          orbitSpeed: 0.001,
          hasStorms: true
        },
      ]
    }
  },
  
  // Actions
  setCamera: (camera) => set((state) => ({ 
    camera: { ...state.camera, ...camera } 
  })),
  
  setSelectedObject: (object) => set({ selectedObject: object }),
  setHoveredObject: (object) => set({ hoveredObject: object }),
  
  toggleHUD: () => set((state) => ({ showHUD: !state.showHUD })),
  toggleInfo: () => set((state) => ({ showInfo: !state.showInfo })),
  toggleControls: () => set((state) => ({ showControls: !state.showControls })),
  
  setPerformance: (settings) => set((state) => ({
    performance: { ...state.performance, ...settings }
  })),

  setEffects: (settings) => set((state) => ({
    effects: { ...state.effects, ...settings }
  })),
  
  setCurrentScene: (scene) => set({ currentScene: scene }),
  
  // Get planet by name
  getPlanet: (name) => {
    const state = get();
    return state.universeData.solarSystem.planets.find(p => p.name === name);
  },
  
  // Update planet position (for orbital animation)
  updatePlanetPositions: (deltaTime) => set((state) => {
    const updatedPlanets = state.universeData.solarSystem.planets.map(planet => {
      const angle = Date.now() * planet.orbitSpeed * 0.001;
      return {
        ...planet,
        position: [
          Math.cos(angle) * planet.orbitRadius,
          0,
          Math.sin(angle) * planet.orbitRadius
        ]
      };
    });
    
    return {
      universeData: {
        ...state.universeData,
        solarSystem: {
          ...state.universeData.solarSystem,
          planets: updatedPlanets
        }
      }
    };
  }),
}));

export default useUniverseStore;
