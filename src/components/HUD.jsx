import { useState } from 'react';
import useUniverseStore from '../store/universeStore';
import Navigation from './Navigation';
import { NavLink } from 'react-router-dom';

const HUD = () => {
  const {
    showHUD,
    selectedObject,
    hoveredObject,
    performance,
    effects,
    toggleHUD,
    toggleInfo,
    toggleControls,
    setPerformance
  } = useUniverseStore();
  
  const [showSettings, setShowSettings] = useState(false);
  
  if (!showHUD) return null;
  function LinkToHomePage() {
    window.location.href = "https://rayuchoeng-profolio-website.netlify.app/";
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Logo/Title */}
        <div className="hud-panel" onClick={() => LinkToHomePage()}>
          <h1 className="text-xl font-bold cosmic-text">Home </h1>
          <p className="text-white/60 text-sm">Solar System Explorer</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-2">
          <button
            className="space-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Settings
          </button>
          <button
            className="space-button"
            onClick={() => useUniverseStore.getState().setEffects({
              ...effects,
              warpSpeed: !effects.warpSpeed
            })}
          >
            {effects.warpSpeed ? '🚀 Warp ON' : '🛸 Warp OFF'}
          </button>
          <button
            className="space-button"
            onClick={toggleHUD}
          >
            👁️ Hide HUD
          </button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-4 hud-panel pointer-events-auto">
          <h3 className="text-lg font-semibold mb-3">Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Quality</label>
              <select 
                value={performance.quality}
                onChange={(e) => setPerformance({ quality: e.target.value })}
                className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={performance.enableLOD}
                onChange={(e) => setPerformance({ enableLOD: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm text-white/70">Enable LOD</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={performance.enableSoundEffects}
                onChange={(e) => setPerformance({ enableSoundEffects: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm text-white/70">Sound Effects</label>
            </div>
            
            <button
              className="space-button w-full"
              onClick={toggleControls}
            >
              Toggle Controls
            </button>

            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-semibold text-white/80">Visual Effects</h4>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={effects.showNebula}
                  onChange={(e) => useUniverseStore.getState().setEffects({
                    ...effects,
                    showNebula: e.target.checked
                  })}
                  className="rounded"
                />
                <label className="text-sm text-white/70">Nebula</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={effects.showComets}
                  onChange={(e) => useUniverseStore.getState().setEffects({
                    ...effects,
                    showComets: e.target.checked
                  })}
                  className="rounded"
                />
                <label className="text-sm text-white/70">Comets</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={effects.showSolarWind}
                  onChange={(e) => useUniverseStore.getState().setEffects({
                    ...effects,
                    showSolarWind: e.target.checked
                  })}
                  className="rounded"
                />
                <label className="text-sm text-white/70">Solar Wind</label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Object Info Panel */}
      {selectedObject && (
        <div className="absolute bottom-4 left-4 hud-panel pointer-events-auto max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold cosmic-text">
              {selectedObject.name}
            </h3>
            <button 
              className="text-white/50 hover:text-white"
              onClick={() => useUniverseStore.getState().setSelectedObject(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            {Object.entries(selectedObject.data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-white/70 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hover Info */}
      {hoveredObject && !selectedObject && (
        <div className="absolute bottom-4 left-4 hud-panel pointer-events-none">
          <p className="text-white/90">
            <span className="cosmic-text font-semibold">{hoveredObject.name}</span>
            <br />
            <span className="text-white/60 text-sm">Click to learn more</span>
          </p>
        </div>
      )}
      
      {/* Navigation */}
      <Navigation />
      
      {/* Performance Monitor */}
      <div className="absolute bottom-4 right-4 hud-panel pointer-events-none text-xs">
        <div className="text-white/60">
          <div>Quality: {performance.quality}</div>
          <div>Particles: {performance.maxParticles}</div>
          <div>Sound: {performance.enableSoundEffects ? 'On' : 'Off'}</div>
          <div className="text-green-400 mt-1">Auto-optimizing for smooth performance</div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-20 right-4 hud-panel pointer-events-none text-xs text-white/50">
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>👆 Click objects to explore</div>
        {performance.quality === 'low' && (
          <div className="text-yellow-400 mt-1">⚡ Performance mode active</div>
        )}
      </div>
    </div>
  );
};

export default HUD;
