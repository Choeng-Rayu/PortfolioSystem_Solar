import { Suspense } from 'react';
import UniverseCanvas from './components/UniverseCanvas';
import HUD from './components/HUD';
import LoadingScreen from './components/LoadingScreen';
import SoundSystem from './components/SoundSystem';
import useUniverseStore from './store/universeStore';

function App() {
  const { showHUD } = useUniverseStore();

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <UniverseCanvas />
        {showHUD && <HUD />}
        <SoundSystem />
      </Suspense>

      {/* Toggle HUD button when HUD is hidden */}
      {!showHUD && (
        <button
          className="fixed top-4 right-4 space-button z-20"
          onClick={() => useUniverseStore.getState().toggleHUD()}
        >
          👁️ Show HUD
        </button>
      )}
    </div>
  );
}

export default App;
