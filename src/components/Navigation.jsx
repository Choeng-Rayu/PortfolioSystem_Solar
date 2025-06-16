import useUniverseStore from '../store/universeStore';

const Navigation = () => {
  const { universeData, setSelectedObject } = useUniverseStore();
  
  const focusOnPlanet = (planetName) => {
    const planet = universeData.solarSystem.planets.find(p => p.name === planetName);
    if (planet) {
      setSelectedObject({
        type: 'planet',
        name: planetName,
        data: {
          position: planet.position,
          radius: planet.radius,
          orbitRadius: planet.orbitRadius
        }
      });
    }
  };
  
  const focusOnSun = () => {
    setSelectedObject({
      type: 'star',
      name: 'Sun',
      data: {
        radius: 696340,
        temperature: 5778,
        mass: '1.989 × 10³⁰ kg'
      }
    });
  };
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 hud-panel pointer-events-auto">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          className="space-button text-sm"
          onClick={focusOnSun}
        >
          ☀️ Sun
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Mercury')}
        >
          🌑 Mercury
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Venus')}
        >
          🌕 Venus
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Earth')}
        >
          🌍 Earth
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Mars')}
        >
          🔴 Mars
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Jupiter')}
        >
          🪐 Jupiter
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Saturn')}
        >
          🪐 Saturn
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Uranus')}
        >
          🔵 Uranus
        </button>
        <button
          className="space-button text-sm"
          onClick={() => focusOnPlanet('Neptune')}
        >
          🔷 Neptune
        </button>
      </div>
    </div>
  );
};

export default Navigation;
